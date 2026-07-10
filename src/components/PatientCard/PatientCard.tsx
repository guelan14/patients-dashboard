import { useState } from 'react'
import type { Patient } from '../../types/patient'
import { PatientCardHeader } from './PatientCardHeader'
import { PatientCardBody } from './PatientCardBody'
import { Card } from '../ui/Card/Card'

interface PatientCardProps {
  patient: Patient
  isFavorite: boolean
  onToggleFavorite: (patient: Patient) => void
  onEdit?: (patient: Patient) => void
  onArchive?: (patient: Patient) => void
}

export function PatientCard({ patient, isFavorite, onToggleFavorite, onEdit, onArchive }: PatientCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card data-testid="patient-card">
      <PatientCardHeader
        patient={patient}
        isFavorite={isFavorite}
        expanded={expanded}
        onToggleFavorite={onToggleFavorite}
        onEdit={onEdit}
        onArchive={onArchive}
        onToggleExpand={() => setExpanded(!expanded)}
      />
      <PatientCardBody
        description={patient.description}
        website={patient.website}
        createdAt={patient.createdAt}
        expanded={expanded}
      />
    </Card>
  )
}
