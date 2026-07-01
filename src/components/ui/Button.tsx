import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'outline'; // 👈 1. Declaramos las variantes disponibles
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
    const baseStyles = "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm";

    const variantStyles = {
        primary: "bg-black text-white hover:bg-gray-800",
        outline: "bg-white border border-gray-200 text-black hover:bg-gray-50",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
