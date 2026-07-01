import { useState, useEffect } from 'react'
import type { Patient } from '../../types/patient'
import { FormField } from '../ui/FormField/FormField'
import { validatePatient } from '../../utils/validatePatient'
import { Button } from '../ui/Button/Button'
import { Input } from '../ui/Input/Input'
import { Textarea } from '../ui/Textarea/Textarea'
import { Modal } from '../ui/Modal/Modal'

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={patient ? 'Edit Patient' : 'Add Patient'}>
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
          <Textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
            hasError={!!errors.description}
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

    </Modal>
  )
}

