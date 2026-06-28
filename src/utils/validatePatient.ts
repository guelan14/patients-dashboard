export interface PatientFormData {
  name: string
  description: string
  website: string
  avatar: string
}

export function validatePatient(form: PatientFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.name.trim()) errors.name = 'El nombre es requerido'
  if (!form.description.trim()) errors.description = 'La descripción es requerida'
  if (form.website && !/^https?:\/\/.+/.test(form.website)) {
    errors.website = 'La URL debe comenzar con http:// o https://'
  }

  return errors
}
