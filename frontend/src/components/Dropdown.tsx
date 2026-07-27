import React from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 appearance-none pr-10 cursor-pointer
            ${error 
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
              : 'border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-rose-500 font-medium select-none animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
