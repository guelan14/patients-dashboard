import { createContext, useState, useCallback, type ReactNode } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      // Limit to 3 toasts max
      if (newToasts.length > 3) {
        return newToasts.slice(newToasts.length - 3);
      }
      return newToasts;
    });
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}
