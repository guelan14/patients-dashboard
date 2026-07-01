import { useState, useCallback, useEffect } from "react";
import { fetchPatients } from "../services/api";
import type { Patient } from "../types/patient";

interface UsePatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export function usePatients(searchTerm: string = "") {
  const [state, setState] = useState<UsePatientsState>({
    patients: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  });

  const loadPatients = useCallback(async (pageToLoad: number, search: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchPatients(pageToLoad, 10, search);

      setState((prev) => ({
        ...prev,
        patients: pageToLoad === 1 ? data
          : [...prev.patients, ...data.filter(p => !prev.patients.some(existing => existing.id === p.id))],
        loading: false,
        hasMore: data.length === 10,
        page: pageToLoad,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Error al cargar los pacientes",
      }));
    }
  }, []);

  // Cuando el searchTerm cambia, hacemos un "debounce" de 300ms 
  // para no saturar la API mientras el usuario tipea.
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
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      patients: [newPatient, ...prev.patients],
    }));
  }, []);

  const updatePatient = useCallback((updated: Patient) => {
    setState((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.id === updated.id ? updated : p)),
    }));
  }, []);

  return {
    ...state,
    loadMore,
    refresh,
    addPatient,
    updatePatient,
  };
}
