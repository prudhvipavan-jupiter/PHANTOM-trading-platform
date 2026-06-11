import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-success-main border-success-dark',
    error: 'bg-error-main border-error-dark',
    warning: 'bg-warning-main border-warning-dark',
    info: 'bg-info-main border-info-dark',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div
        className={`${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-3 min-w-[300px]`}
      >
        <span className="text-xl">{icons[type]}</span>
        <p className="flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast; 