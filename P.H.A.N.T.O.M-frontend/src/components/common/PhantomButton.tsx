import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PhantomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: any; // Changed from IconDefinition to any
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const PhantomButton: React.FC<PhantomButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'phantom-button';
  const variantClasses = `phantom-button-${variant}`;
  const sizeClasses = `phantom-button-${size}`;
  const disabledClasses = disabled || loading ? 'phantom-button-disabled' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  const iconClasses = icon ? `phantom-button-with-icon phantom-button-icon-${iconPosition}` : '';

  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${widthClasses} ${iconClasses} ${className}`.trim();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <FontAwesomeIcon 
        icon={icon} 
        className={`phantom-button-icon ${loading ? 'animate-spin' : ''}`}
      />
    );
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading && (
        <div className="phantom-button-loading">
          <div className="phantom-spinner"></div>
        </div>
      )}
      {icon && iconPosition === 'left' && renderIcon()}
      <span className="phantom-button-text">{children}</span>
      {icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default PhantomButton; 