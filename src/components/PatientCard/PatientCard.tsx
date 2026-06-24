import { useState } from 'react'
import type { Patient } from '../../types/patient'

interface PatientCardProps {
  patient: Patient
}

export function PatientCard({ patient }: PatientCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`}
          alt={patient.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
          <p className="text-xs text-gray-400">ID: {patient.id}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{patient.description}</p>
        <a
          href={patient.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline break-all"
        >
          {patient.website}
        </a>
      </div>

    </div>
  )
}