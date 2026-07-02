import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { Avatar } from '../ui/Avatar/Avatar';
import { IconButton } from '../ui/IconButton/IconButton';
import { CloseIcon } from '../ui/Icons/Icons';

interface FavoritesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesSidebar({ isOpen, onClose }: FavoritesSidebarProps) {
  const { favorites } = useFavorites();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl border-l border-white/40 dark:border-slate-700/40 z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 pb-2 flex items-center justify-between border-b border-gray-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-yellow-400">⭐</span> Favoritos
          </h2>
          <IconButton 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            aria-label="Cerrar favoritos"
          >
            <CloseIcon className="w-5 h-5" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 px-4">
              <span className="text-4xl mb-3 opacity-50 grayscale">⭐</span>
              <p className="text-sm font-medium">No tienes pacientes favoritos aún.</p>
              <p className="text-xs mt-2 opacity-70">Marca la estrella en cualquier paciente para añadirlo aquí.</p>
            </div>
          ) : (
            favorites.map((patient) => (
              <Link 
                key={patient.id}
                to={`/patient/${patient.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-gray-200/50 dark:hover:border-slate-700/50 group"
              >
                <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {/* @ts-ignore */}
                  <Avatar name={patient.name} src={patient.avatar} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    ID: {patient.id.substring(0, 8)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
