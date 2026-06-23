import axios from "axios";
import { PatientsArraySchema, type Patient } from "../types/patient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function fetchPatients(
  page: number = 1,
  limit: number = 10,
): Promise<Patient[]> {
  const response = await api.get("/users", {
    params: { page, limit },
  });

  const parsed = PatientsArraySchema.safeParse(response.data);

  if (!parsed.success) {
    console.error("Error de validación:", parsed.error.issues);
    throw new Error("La respuesta de la API no tiene el formato esperado");
  }

  return parsed.data;
}
