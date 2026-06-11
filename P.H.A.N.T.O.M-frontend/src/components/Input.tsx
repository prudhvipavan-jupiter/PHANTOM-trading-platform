import React, { forwardRef } from 'react';
import PhantomInput from './common/PhantomInput';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: string;
  icon?: any;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  label?: string;
  helperText?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  success,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  className = '',
  label,
  helperText,
  autoComplete,
  name,
  id,
  ...props
}, ref) => {
  return (
    <PhantomInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      required={required}
      error={error}
      success={success}
      icon={icon}
      iconPosition={iconPosition}
      size={size}
      fullWidth={fullWidth}
      className={className}
      label={label}
      helperText={helperText}
      autoComplete={autoComplete}
      name={name}
      id={id}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 