import { useContext } from 'react';
import { ToastContext } from '../../../contexts/ToastContext';
import { Toast } from './Toast';

export function ToastContainer() {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, hideToast } = context;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
