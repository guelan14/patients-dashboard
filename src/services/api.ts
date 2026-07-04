import axios from "axios";
import { PatientsArraySchema, type Patient } from "../types/patient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

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
  const response = await api.get(`/users/${id}`);
  
  const { PatientSchema } = await import('../types/patient');
  const parsed = PatientSchema.safeParse(response.data);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    throw new Error("API response format is invalid");
  }

  return parsed.data;
}
