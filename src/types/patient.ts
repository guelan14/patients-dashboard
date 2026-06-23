import { z } from 'zod'

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  website: z.string(),
  avatar: z.union([z.string(), z.object({})]).transform((val) =>
    typeof val === 'string' ? val : ''
  ),
  createdAt: z.string(),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
})

export const PatientsArraySchema = z.array(PatientSchema)

export type Patient = z.infer<typeof PatientSchema>