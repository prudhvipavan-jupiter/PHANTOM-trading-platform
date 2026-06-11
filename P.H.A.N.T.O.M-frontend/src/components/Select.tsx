import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  className = '',
  ...props
}) => {
  return (
    <select
      className={`p-2 border border-[#3a3a3a] rounded-md bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#00f2ff] ${className}`}
      {
        ...props
      }
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select; 