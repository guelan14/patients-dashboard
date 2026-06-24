import { useState, useEffect } from 'react'
import type { Patient } from '../../types/patient'

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

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida'
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      newErrors.website = 'La URL debe comenzar con http:// o https://'
    }
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {patient ? 'Edit Patient' : 'Add Patient'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Patient name"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
              rows={3}
              placeholder="Patient description"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.website ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="https://example.com"
            />
            {errors.website && <p className="text-xs text-red-400 mt-1">{errors.website}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={e => setForm(prev => ({ ...prev, avatar: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm hover:bg-blue-600 transition-colors"
          >
            {patient ? 'Save changes' : 'Add patient'}
          </button>
        </div>

      </div>
    </div>
  )
}