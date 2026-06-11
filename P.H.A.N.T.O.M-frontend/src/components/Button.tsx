import React from 'react';
import PhantomButton from './common/PhantomButton';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  icon?: any;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false
}) => {
  return (
    <PhantomButton
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      icon={icon}
      iconPosition={iconPosition}
      onClick={onClick}
      className={className}
      type={type}
      fullWidth={fullWidth}
    >
      {children}
    </PhantomButton>
  );
};

export default Button; 