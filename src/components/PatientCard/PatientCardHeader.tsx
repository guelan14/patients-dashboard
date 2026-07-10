import type { Patient } from '../../types/patient'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui/Avatar/Avatar'
import { IconButton } from '../ui/IconButton/IconButton'
import { EditIcon, StarIcon, TrashIcon, ChevronDownIcon } from '../ui/Icons/Icons'

interface PatientCardHeaderProps {
  patient: Patient
  isFavorite: boolean
  expanded: boolean
  onToggleFavorite: (patient: Patient) => void
  onEdit?: (patient: Patient) => void
  onArchive?: (patient: Patient) => void
  onToggleExpand: () => void
}

export function PatientCardHeader({
  patient,
  isFavorite,
  expanded,
  onToggleFavorite,
  onEdit,
  onArchive,
  onToggleExpand,
}: PatientCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={patient.name} src={patient.avatar} />

      <div className="flex-1 min-w-0 pr-2">
        <Link to={`/patient/${patient.id}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm">
          <h3 className="font-bold text-black dark:text-white truncate">{patient.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-0.5 truncate">ID: {patient.id}</p>
      </div>

      <IconButton onClick={() => onEdit?.(patient)} aria-label="Edit patient">
        <EditIcon className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={() => onArchive?.(patient)}
        aria-label="Archive patient"
        className="text-gray-400 hover:text-red-600 dark:hover:text-red-500"
      >
        <TrashIcon className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={() => onToggleFavorite(patient)}
        aria-label="Toggle favorite"
        className={`transition-colors ${isFavorite ? 'text-black dark:text-white' : 'text-gray-300 dark:text-slate-600 hover:text-black dark:hover:text-white'
          }`}
      >
        <StarIcon className={`w-5 h-5 ${isFavorite ? 'fill-black dark:fill-white' : ''}`} />
      </IconButton>

      <IconButton
        onClick={onToggleExpand}
        aria-label={expanded ? 'Collapse patient details' : 'Expand patient details'}
      >
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </IconButton>
    </div>
  )
}
