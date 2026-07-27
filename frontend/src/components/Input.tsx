import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            {leftIcon}
          </span>
        )}
        
        <input
          id={id}
          className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
              : 'border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary'
            }
          `}
          {...props}
        />
        
        {rightIcon && (
          <span className="absolute right-3.5 text-slate-400 dark:text-slate-500">
            {rightIcon}
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-rose-500 font-medium select-none animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
