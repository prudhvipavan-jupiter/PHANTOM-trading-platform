import React from 'react';

interface PhantomLoadingProps {
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const PhantomLoading: React.FC<PhantomLoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div className={`phantom-loading-spinner ${sizeClasses[size]}`} />
  );

  const renderPulse = () => (
    <div className={`phantom-loading-pulse ${sizeClasses[size]} bg-phantom-primary rounded-full`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-phantom-primary rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1 bg-phantom-primary rounded-full animate-pulse`}
          style={{ 
            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      <div className="phantom-loading-skeleton h-4 w-3/4" />
      <div className="phantom-loading-skeleton h-4 w-1/2" />
      <div className="phantom-loading-skeleton h-4 w-5/6" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {renderLoader()}
      {text && (
        <p
          className="phantom-caption text-center text-phantom-text-secondary"
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-phantom-bg-overlay backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default PhantomLoading; 