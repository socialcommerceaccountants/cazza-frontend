// Simplified toast implementation for now
// In a real project, you would use a proper toast library like sonner or react-hot-toast

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000,
  }: {
    title?: string;
    description: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, variant, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return { id };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast();
  
  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              toast.variant === 'destructive'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border'
            }`}
          >
            {toast.title && (
              <div className="font-semibold mb-1">{toast.title}</div>
            )}
            <div className="text-sm">{toast.description}</div>
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}