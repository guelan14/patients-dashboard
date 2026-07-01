import { type HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div 
      ref={ref} 
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm transition-all duration-300 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow ${className}`} 
      {...props} 
    />
  )
);
Card.displayName = 'Card';
