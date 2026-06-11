import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

interface LoadingStateProps {
  type?: 'spinner' | 'pulse' | 'neural' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  type = 'spinner', 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const renderSpinner = () => (
    <motion.div
      className={`${getSizeClasses()} border-2 border-cyan-500/20 border-t-cyan-400 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  const renderPulse = () => (
    <motion.div
      className={`${getSizeClasses()} bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );

  const renderNeural = () => (
    <div className={`${getSizeClasses()} relative`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-2 bg-black rounded-full flex items-center justify-center"
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <FontAwesomeIcon 
            icon={faBrain} 
            className="text-cyan-400 text-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-cyan-400 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            delay: i * 0.2,
            ease: 'easeInOut' 
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'neural':
        return renderNeural();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      {text && (
        <motion.p 
          className={`text-gray-300 ${getTextSize()} font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingState; 