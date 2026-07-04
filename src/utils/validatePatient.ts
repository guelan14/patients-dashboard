export interface PatientFormData {
  name: string
  description: string
  website: string
  avatar: string
}

export function validatePatient(form: PatientFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (form.website && !/^https?:\/\/.+/.test(form.website)) {
    errors.website = 'URL must start with http:// or https://'
  }

  return errors
}
