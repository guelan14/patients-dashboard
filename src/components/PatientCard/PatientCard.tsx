import { useState } from "react";
import type { Patient } from "../../types/patient";

interface PatientCardProps {
  patient: Patient;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onEdit?: (patient: Patient) => void;
}

export function PatientCard({
  patient,
  isFavorite,
  onToggleFavorite,
}: PatientCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={
            patient.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`
          }
          alt={patient.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`;
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {patient.name}
          </h3>
          <p className="text-xs text-gray-400">ID: {patient.id}</p>
        </div>
        {/* Edit button */}
        <button
          onClick={() => onEdit(patient)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(patient.id)}
          className="text-gray-300 hover:text-yellow-400 transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : ""}`}
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
        </button>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
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
        </button>
      </div>

      {/* Expanded content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 mt-4" : "max-h-0"}`}
      >
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {patient.description}
        </p>
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
  );
}
