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
        className="hidden peer"
      />
      <div 
        className={`
          w-5 h-5 flex items-center justify-center
          border-2 rounded-md transition-all duration-200  // 修改为rounded-md
          border-gray-300 bg-white  // 日间模式优化为白色背景和浅灰色边框
          peer-checked:border-green-500 peer-checked:bg-green-500
          dark:border-gray-500 dark:bg-gray-700
          dark:peer-checked:border-green-500 dark:peer-checked:bg-green-500
          peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-500/50
          hover:border-green-400 dark:hover:border-green-400
        `}
      >
        {checked && (
          <svg 
            className="w-3 h-3 text-white" 
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