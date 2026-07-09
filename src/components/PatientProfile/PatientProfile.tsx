import { Avatar } from '../ui/Avatar/Avatar';
import type { Patient } from '../../types/patient';
import { IconButton } from '../ui/IconButton/IconButton';
import { StarIcon, EditIcon, TrashIcon } from '../ui/Icons/Icons';

interface PatientProfileProps {
  patient: Patient;
  isFavorite?: boolean;
  onToggleFavorite?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
}

export function PatientProfile({ patient, isFavorite = false, onToggleFavorite, onEdit, onDelete }: PatientProfileProps) {
  const formattedDate = new Date(patient.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 md:p-12 shadow-sm overflow-hidden relative">
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-100 to-transparent dark:from-slate-800 dark:to-transparent rounded-bl-full opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-full blur-md opacity-70" />
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            {/* @ts-ignore */}
            <Avatar name={patient.name} src={patient.avatar} size="lg" className="w-32 h-32 text-4xl border-4 border-white dark:border-slate-900 shadow-xl" />
          </div>
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white leading-tight">
                  {patient.name}
                </h1>
                {onToggleFavorite && (
                  <IconButton
                    onClick={() => onToggleFavorite(patient)}
                    aria-label="Toggle favorite"
                    className={`transition-colors ${isFavorite ? 'text-black dark:text-white' : 'text-gray-300 dark:text-slate-600 hover:text-black dark:hover:text-white'}`}
                  >
                    <StarIcon className={`w-8 h-8 ${isFavorite ? 'fill-black dark:fill-white' : ''}`} />
                  </IconButton>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {onEdit && (
                  <IconButton onClick={() => onEdit(patient)} aria-label="Edit patient">
                    <EditIcon className="w-6 h-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors" />
                  </IconButton>
                )}

                {onDelete && (
                  <IconButton onClick={() => onDelete(patient)} aria-label="Archive patient">
                    <TrashIcon className="w-6 h-6 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" />
                  </IconButton>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                ID: {patient.id.substring(0, 8)}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Registered on {formattedDate}
              </span>
            </div>
          </div>

          {patient.description && (
            <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50">
              <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-2">About the Patient</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {patient.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.website && (
              <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Website</h3>
                <a 
                  href={patient.website.startsWith('http') ? patient.website : `https://${patient.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black dark:text-white font-medium hover:underline flex items-center gap-2"
                >
                  {patient.website}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
