import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
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
        <header className="bg-black dark:bg-slate-950 text-white py-3 px-6 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded flex items-center justify-center text-black dark:text-white font-bold text-xl leading-none">
              P
            </div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">PatientsApp</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm font-medium"
              aria-label="Open favorites"
            >
              <span className="text-yellow-400">★</span> Favorites ({favorites.length})
            </button>
            <ThemeToggle />
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
