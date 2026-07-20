import React from 'react';

const Checkbox = ({ checked, onChange, label, title, className = '' }) => {
  return (
    <label 
      className={`inline-flex items-center cursor-pointer ${className}`}
      title={title}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className={`glass-checkbox ${checked ? "glass-checkbox-checked" : ""}`}
      >
        {checked && (
          <svg
            className="w-3 h-3"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10.6667 1L4 8.33333L1.33333 5.66667" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
};

export default Checkbox;