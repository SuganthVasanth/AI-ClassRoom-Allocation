import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  padding = 'md',
  header,
  footer,
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-300
        ${hoverEffect ? 'hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-4">
          {header}
        </div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};
