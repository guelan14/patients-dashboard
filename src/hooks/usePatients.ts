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
      const data = await fetchPatients(pageToLoad, 9, search);
      const visibleApiPatients = filterVisiblePatients(data);
      const mergedPatients = mergePatients(visibleApiPatients, storedPatientsRef.current, search);

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

  // When searchTerm changes, debounce for 300ms to avoid hammering the API while typing.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPatients(1, searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, loadPatients]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadPatients(state.page + 1, searchTerm);
    }
  }, [state.loading, state.hasMore, state.page, searchTerm, loadPatients]);

  const refresh = useCallback(() => {
    loadPatients(1, searchTerm);
  }, [loadPatients, searchTerm]);

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

  return {
    ...state,
    loadMore,
    refresh,
    addPatient,
    updatePatient,
  };
}
