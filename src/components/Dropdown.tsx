import React from 'react';
import './Dropdown.css'; // Import custom styles for the dropdown if needed

interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange }) => (
  <div className="dropdown-container">
    <label htmlFor={id} className="dropdown-label">
      {label}
    </label>
    <select
      id={id}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="dropdown-select"
    >
      <option value="">All Options</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
