import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  glass = true,
  padding = 'md',
  header,
  footer,
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 relative overflow-hidden
        ${glass ? 'glass-card' : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm'}
        ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-5 sm:px-6 py-4">
          {header}
        </div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 sm:px-6 py-4 bg-slate-50/60 dark:bg-slate-900/40 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};
