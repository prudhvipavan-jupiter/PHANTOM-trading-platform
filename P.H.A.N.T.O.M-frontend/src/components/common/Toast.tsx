import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          icon: 'text-green-400',
          title: 'text-green-300',
          message: 'text-gray-300'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500/10 to-pink-500/10',
          border: 'border-red-500/20',
          icon: 'text-red-400',
          title: 'text-red-300',
          message: 'text-gray-300'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          icon: 'text-yellow-400',
          title: 'text-yellow-300',
          message: 'text-gray-300'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          icon: 'text-blue-400',
          title: 'text-blue-300',
          message: 'text-gray-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500/10 to-gray-600/10',
          border: 'border-gray-500/20',
          icon: 'text-gray-400',
          title: 'text-gray-300',
          message: 'text-gray-300'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`relative p-4 rounded-xl backdrop-blur-sm border ${colors.bg} ${colors.border} shadow-xl min-w-[320px] max-w-[400px] animate-in slide-in-from-right-2`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full bg-white/10 ${colors.icon}`}>
          <FontAwesomeIcon icon={getIcon()} className="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${colors.title}`}>{title}</h4>
          <p className={`text-xs mt-1 ${colors.message}`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
          aria-label="Close notification"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-b-xl animate-pulse"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default Toast; 