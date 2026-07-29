import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  required,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase select-none flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        
        <input
          id={id}
          required={required}
          className={`w-full px-4 py-2.5 text-sm font-medium bg-white dark:bg-slate-900 border rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-700'
            }
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <span className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-rose-500 font-medium select-none animate-fade-in flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
