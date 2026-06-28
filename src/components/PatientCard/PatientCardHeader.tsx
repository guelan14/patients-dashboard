import type { Patient } from '../../types/patient'
import { Avatar } from '../ui/Avatar'
import { IconButton } from '../ui/IconButton'

interface PatientCardHeaderProps {
  patient: Patient
  isFavorite: boolean
  expanded: boolean
  onToggleFavorite: (id: string) => void
  onEdit?: (patient: Patient) => void
  onToggleExpand: () => void
}

export function PatientCardHeader({
  patient,
  isFavorite,
  expanded,
  onToggleFavorite,
  onEdit,
  onToggleExpand,
}: PatientCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={patient.name} src={patient.avatar} />

      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-bold text-black truncate">{patient.name}</h3>
        <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5 truncate">ID: {patient.id}</p>
      </div>

      <IconButton onClick={() => onEdit?.(patient)} aria-label="Edit patient">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </IconButton>

      <IconButton
        onClick={() => onToggleFavorite(patient.id)}
        aria-label="Toggle favorite"
        className={`transition-colors ${
          isFavorite ? 'text-black' : 'text-gray-300 hover:text-black'
        }`}
      >
        <svg
          className={`w-5 h-5 ${isFavorite ? 'fill-black' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </IconButton>

      <IconButton
        onClick={onToggleExpand}
        aria-label={expanded ? 'Collapse patient details' : 'Expand patient details'}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </IconButton>
    </div>
  )
}
