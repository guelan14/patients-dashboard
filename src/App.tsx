import { NavLink, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ArchivedPatients } from './pages/ArchivedPatients';
import { PatientDetails } from './pages/PatientDetails';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { FavoritesSidebar } from './components/FavoritesSidebar/FavoritesSidebar';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/Toast/ToastContainer';
import { useState } from 'react';
import { useFavorites } from './hooks/useFavorites';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { favorites } = useFavorites();
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-slate-900 transition-colors duration-200">
        <header className="bg-black dark:bg-slate-950 text-white sticky top-0 z-40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">

              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-sm'
                      : 'border border-gray-700 text-white/90 hover:text-white hover:bg-gray-800 hover:scale-105 active:scale-95'
                  }`
                }
                aria-label="Dashboard"
              >
                Dashboard
              </NavLink>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
                aria-label="Open favorites"
              >
                <span className="text-yellow-400">★</span>
                <span className="hidden sm:inline">Favorites</span>
                <span>({favorites.length})</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <FavoritesSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 mt-4 pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/archived" element={<ArchivedPatients />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
          </Routes>
        </main>

        {/* Site Footer */}
        <footer className="fixed bottom-0 w-full border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 z-40">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 font-medium">
            <p>PatientsApp Dashboard by Migue</p>
          </div>
        </footer>
        <ToastContainer />
      </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
