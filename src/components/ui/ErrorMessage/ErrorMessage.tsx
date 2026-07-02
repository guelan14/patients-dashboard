import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';

interface ErrorMessageProps {
  message?: string;
  backUrl?: string;
  backText?: string;
}

export function ErrorMessage({ 
  message = "Ha ocurrido un error", 
  backUrl = "/", 
  backText = "Volver" 
}: ErrorMessageProps) {
  return (
    <div className="py-6">
      <Link to={backUrl}>
        <Button variant="outline" className="mb-6">&larr; {backText}</Button>
      </Link>
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-900/50">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
