import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', hasError, ...props }, ref) => {
    const baseStyles = "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-white text-black placeholder-gray-400";
    const normalStyles = "border-gray-200 focus:border-black focus:ring-1 focus:ring-black";
    const errorStyles = "border-red-400 focus:border-red-500 focus:ring-red-500";

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${hasError ? errorStyles : normalStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
