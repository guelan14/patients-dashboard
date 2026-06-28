import { useState } from 'react'
import type { Patient } from '../../types/patient'
import { PatientCardHeader } from './PatientCardHeader'
import { PatientCardBody } from './PatientCardBody'

interface PatientCardProps {
  patient: Patient
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onEdit?: (patient: Patient) => void
}

export function PatientCard({ patient, isFavorite, onToggleFavorite, onEdit }: PatientCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:border-gray-300 hover:shadow-sm">
      <PatientCardHeader
        patient={patient}
        isFavorite={isFavorite}
        expanded={expanded}
        onToggleFavorite={onToggleFavorite}
        onEdit={onEdit}
        onToggleExpand={() => setExpanded(!expanded)}
      />
      <PatientCardBody
        description={patient.description}
        website={patient.website}
        createdAt={patient.createdAt}
        expanded={expanded}
      />
    </div>
  )
}
