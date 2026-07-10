import type { Patient } from '../../types/patient'
import { PatientCard } from '../PatientCard/PatientCard'
import { SkeletonCard } from '../Skeleton/SkeletonCard'

interface PatientGridProps {
  patients: Patient[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (patient: Patient) => void
  onEdit: (patient: Patient) => void
  onArchive: (patient: Patient) => void
  loading?: boolean
}

export function PatientGrid({
  patients,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onArchive,
  loading = false,
}: PatientGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          isFavorite={isFavorite(patient.id)}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
      {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
