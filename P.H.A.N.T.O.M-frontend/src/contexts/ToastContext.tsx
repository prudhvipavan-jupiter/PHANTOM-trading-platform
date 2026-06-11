import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';
import type { ToastProps } from '../components/common/Toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((title: string, message: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const value: ToastContextType = {
    showToast: addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}; 