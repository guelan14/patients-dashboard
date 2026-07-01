import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { PatientDetails } from './pages/PatientDetails';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-slate-900 transition-colors duration-200">
        <header className="bg-black dark:bg-slate-950 text-white py-3 px-6 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded flex items-center justify-center text-black dark:text-white font-bold text-xl leading-none">
              P
            </div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">PatientsApp</span>
          </div>
          <ThemeToggle />
        </header>

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
      </div>
    </ThemeProvider>
  );
}

export default App;
