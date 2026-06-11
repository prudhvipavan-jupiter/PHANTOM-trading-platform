import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PhantomInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: any; // Changed from IconDefinition to any
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const PhantomInput: React.FC<PhantomInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  icon,
  required = false,
  min,
  max,
  step,
}) => {
  return (
    <div className={`phantom-input-container ${className}`}>
      {label && (
        <label className="phantom-input-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="phantom-input-wrapper">
        {icon && (
          <div className="phantom-input-icon">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`phantom-input ${icon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
        />
      </div>
      {error && <div className="phantom-input-error">{error}</div>}
    </div>
  );
};

export default PhantomInput; 