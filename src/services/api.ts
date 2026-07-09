import axios from "axios";
import { PatientsArraySchema, type Patient } from "../types/patient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const LOCAL_PATIENTS_KEY = 'patient-records-local-updates';
const ARCHIVED_PATIENTS_KEY = 'patient-records-archived-patients';
const DELETED_PATIENT_IDS_KEY = 'patient-records-deleted-ids';

function emitPatientsArchiveUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('patients-archive-updated'));
  }
}

export function readLocalPatients(): Patient[] {
  try {
    const stored = localStorage.getItem(LOCAL_PATIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function persistLocalPatients(patients: Patient[]) {
  localStorage.setItem(LOCAL_PATIENTS_KEY, JSON.stringify(patients));
}

export function readArchivedPatients(): Patient[] {
  try {
    const stored = localStorage.getItem(ARCHIVED_PATIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistArchivedPatients(patients: Patient[]) {
  localStorage.setItem(ARCHIVED_PATIENTS_KEY, JSON.stringify(patients));
}

export function readDeletedPatientIds(): string[] {
  try {
    const stored = localStorage.getItem(DELETED_PATIENT_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function generateNextLocalPatientId() {
  const localIds = [...readLocalPatients(), ...readArchivedPatients()]
    .map((patient) => patient.id.match(/^local-(\d+)$/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map((value) => Number(value));

  const nextNumber = localIds.length ? Math.max(...localIds) + 1 : 1;
  return `local-${nextNumber}`;
}

function persistDeletedPatientIds(ids: string[]) {
  localStorage.setItem(DELETED_PATIENT_IDS_KEY, JSON.stringify(ids));
}

export function isPatientDeleted(id: string) {
  return readDeletedPatientIds().includes(id);
}

export function markPatientDeleted(id: string) {
  const deletedIds = readDeletedPatientIds();
  if (!deletedIds.includes(id)) {
    persistDeletedPatientIds([...deletedIds, id]);
  }
}

function removeLocalPatient(id: string) {
  const remainingPatients = readLocalPatients().filter((patient) => patient.id !== id);
  persistLocalPatients(remainingPatients);
}

export function archivePatient(patient: Patient) {
  const archivedPatients = readArchivedPatients();
  const nextArchivedPatients = [
    patient,
    ...archivedPatients.filter((archivedPatient) => archivedPatient.id !== patient.id),
  ];

  persistArchivedPatients(nextArchivedPatients);

  if (patient.id.startsWith('local-')) {
    removeLocalPatient(patient.id);
  } else {
    markPatientDeleted(patient.id);
  }

  emitPatientsArchiveUpdated();
}

export function deletePatientById(patient: Patient) {
  archivePatient(patient);
}

export function restoreArchivedPatient(id: string) {
  const archivedPatients = readArchivedPatients();
  const patientToRestore = archivedPatients.find((patient) => patient.id === id);

  if (!patientToRestore) {
    return null;
  }

  persistArchivedPatients(archivedPatients.filter((patient) => patient.id !== id));

  if (id.startsWith('local-')) {
    const localPatients = readLocalPatients();
    persistLocalPatients([patientToRestore, ...localPatients.filter((patient) => patient.id !== id)]);
  } else {
    const deletedIds = readDeletedPatientIds().filter((deletedId) => deletedId !== id);
    persistDeletedPatientIds(deletedIds);
  }

  emitPatientsArchiveUpdated();
  return patientToRestore;
}

export async function fetchPatients(
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<Patient[]> {
  const params: Record<string, string | number> = { page, limit };
  if (search) {
    params.name = search;
  }
  
  try {
    const response = await api.get("/users", { params });
    const parsed = PatientsArraySchema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      throw new Error("API response format is invalid");
    }
    return parsed.data;
  } catch (error: any) {
    // MockAPI returns 404 when a search yields no results.
    if (error.response && error.response.status === 404 && search) {
      return [];
    }
    throw error;
  }
}


export async function fetchPatientById(id: string): Promise<Patient> {
  const localPatient = readLocalPatients().find((patient) => patient.id === id);
  if (localPatient) {
    return localPatient;
  }

  const archivedPatient = readArchivedPatients().find((patient) => patient.id === id);
  if (archivedPatient) {
    return archivedPatient;
  }

  if (id.startsWith('local-')) {
    throw new Error('Patient not found');
  }

  if (isPatientDeleted(id)) {
    throw new Error('Patient not found');
  }

  try {
    const response = await api.get(`/users/${id}`);
  
    const { PatientSchema } = await import('../types/patient');
    const parsed = PatientSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      throw new Error("API response format is invalid");
    }

    return parsed.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Patient not found');
    }

    throw error;
  }
}
