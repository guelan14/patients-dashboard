import { useState, useCallback, useEffect, useRef } from "react";
import { fetchPatients, generateNextLocalPatientId, readDeletedPatientIds } from "../services/api";
import type { Patient } from "../types/patient";

const STORAGE_KEY = "patient-records-local-updates";

function readStoredPatients(): Patient[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistStoredPatients(patients: Patient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

function matchesSearch(patient: Patient, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;
  return patient.name.toLowerCase().includes(normalizedSearch);
}

function mergePatients(apiPatients: Patient[], storedPatients: Patient[], searchTerm: string) {
  const filteredStoredPatients = storedPatients.filter((patient) => matchesSearch(patient, searchTerm));
  const mergedPatients: Patient[] = [];
  const seenIds = new Set<string>();

  for (const patient of [...filteredStoredPatients, ...apiPatients]) {
    if (seenIds.has(patient.id)) continue;
    seenIds.add(patient.id);
    mergedPatients.push(patient);
  }

  return mergedPatients;
}

function filterVisiblePatients(patients: Patient[]) {
  const deletedIds = new Set(readDeletedPatientIds());
  return patients.filter((patient) => !deletedIds.has(patient.id));
}

function upsertPatient(patients: Patient[], updatedPatient: Patient) {
  const nextPatients = patients.filter((patient) => patient.id !== updatedPatient.id);
  return [updatedPatient, ...nextPatients];
}

interface UsePatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export function usePatients(searchTerm: string = "") {
  const initialStoredPatients = readStoredPatients();
  const storedPatientsRef = useRef<Patient[]>(readStoredPatients());
  const [state, setState] = useState<UsePatientsState>({
    patients: filterVisiblePatients(initialStoredPatients).filter((patient) => matchesSearch(patient, searchTerm)),
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  });

  const saveStoredPatients = useCallback((updater: (patients: Patient[]) => Patient[]) => {
    storedPatientsRef.current = updater(storedPatientsRef.current);
    persistStoredPatients(storedPatientsRef.current);
  }, []);

  const loadPatients = useCallback(async (pageToLoad: number, search: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Siempre leemos localStorage al cargar para asegurarnos de tener la lista
      // más actualizada, por si se borraron o modificaron pacientes externamente
      storedPatientsRef.current = readStoredPatients();

      const data = await fetchPatients(pageToLoad, 9, search);
      const visibleApiPatients = filterVisiblePatients(data);
      const visibleStoredPatients = filterVisiblePatients(storedPatientsRef.current);
      const mergedPatients = mergePatients(visibleApiPatients, visibleStoredPatients, search);

      setState((prev) => ({
        ...prev,
        patients: pageToLoad === 1 ? mergedPatients
          : [...prev.patients, ...visibleApiPatients.filter(p => !prev.patients.some(existing => existing.id === p.id))],
        loading: false,
        hasMore: data.length === 9,
        page: pageToLoad,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Error loading patients",
      }));
    }
  }, []);

  // When searchTerm changes, load patients.
  // The debounce logic is now handled in the component consuming this hook.
  useEffect(() => {
    loadPatients(1, searchTerm);
  }, [searchTerm, loadPatients]);

  // Guardamos el estado actual en una ref para que los callbacks puedan
  // leerlo sin necesidad de re-crear las funciones en cada render
  // (especialmente cuando 'loading' o 'page' cambian a menudo).
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadMore = useCallback(() => {
    const { loading, hasMore, page } = stateRef.current;
    if (!loading && hasMore) {
      loadPatients(page + 1, searchTerm);
    }
  }, [searchTerm, loadPatients]);

  const refresh = useCallback(() => {
    loadPatients(1, searchTerm);
  }, [searchTerm, loadPatients]);

  const addPatient = useCallback((data: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...data,
      id: generateNextLocalPatientId(),
      createdAt: new Date().toISOString(),
    };
    saveStoredPatients((prev) => upsertPatient(prev, newPatient));
    setState((prev) => ({
      ...prev,
      patients: upsertPatient(prev.patients, newPatient),
    }));
  }, [saveStoredPatients]);

  const updatePatient = useCallback((updated: Patient) => {
    saveStoredPatients((prev) => upsertPatient(prev, updated));
    setState((prev) => ({
      ...prev,
      patients: upsertPatient(prev.patients, updated),
    }));
  }, [saveStoredPatients]);

  // Escuchar el evento de archivado para actualizar la UI instantáneamente
  // sin esperar a que el servidor responda al refresh()
  useEffect(() => {
    const handleArchiveUpdate = () => {
      storedPatientsRef.current = readStoredPatients();
      setState((prev) => {
        const visiblePatients = filterVisiblePatients(prev.patients).filter(p => {
          // Si es un paciente local, verificar que siga existiendo en local storage
          if (p.id.startsWith('local-')) {
            return storedPatientsRef.current.some(stored => stored.id === p.id);
          }
          return true;
        });
        return { ...prev, patients: visiblePatients };
      });
    };
    
    window.addEventListener('patients-archive-updated', handleArchiveUpdate);
    return () => window.removeEventListener('patients-archive-updated', handleArchiveUpdate);
  }, []);

  return {
    ...state,
    loadMore,
    refresh,
    addPatient,
    updatePatient,
  };
}
