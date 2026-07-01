import { useState, useEffect } from 'react'
import type { Patient } from '../../types/patient'
import { FormField } from '../ui/FormField'
import { validatePatient } from '../../utils/validatePatient'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { IconButton } from '../ui/IconButton'

interface PatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patient: Omit<Patient, 'id' | 'createdAt'>) => void
  patient?: Patient | null
}

export function PatientModal({ isOpen, onClose, onSave, patient }: PatientModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    avatar: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        description: patient.description,
        website: patient.website,
        avatar: patient.avatar,
      })
    } else {
      setForm({ name: '', description: '', website: '', avatar: '' })
    }
    setErrors({})
  }, [patient, isOpen])

  const handleSubmit = () => {
    const newErrors = validatePatient(form)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-full overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-black">
            {patient ? 'Edit Patient' : 'Add Patient'}
          </h2>
          <IconButton onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <FormField label="Name" error={errors.name} required>
            <Input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              hasError={!!errors.name}
              className="mt-1"
              placeholder="Patient name"
            />
          </FormField>

          <FormField label="Description" error={errors.description} required>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none ${errors.description ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
              rows={3}
              placeholder="Patient description"
            />
          </FormField>

          <FormField label="Website" error={errors.website}>
            <Input
              type="text"
              value={form.website}
              onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))}
              hasError={!!errors.website}
              className="mt-1"
              placeholder="https://example.com"
            />
          </FormField>

          <FormField label="Avatar URL">
            <Input
              type="text"
              value={form.avatar}
              onChange={e => setForm(prev => ({ ...prev, avatar: e.target.value }))}
              className="mt-1"
              placeholder="https://example.com/avatar.jpg"
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
          >
            {patient ? 'Save changes' : 'Add patient'}
          </Button>
        </div>

      </div>
    </div>
  )
}

