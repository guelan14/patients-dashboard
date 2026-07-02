import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '../ui/Icons/Icons';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="cursor-pointer flex items-center justify-center p-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 bg-gray-900/50"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
    </button>
  );
}
