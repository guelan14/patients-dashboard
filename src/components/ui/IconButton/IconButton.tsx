import type { ReactNode } from 'react'

interface IconButtonProps {
  onClick: () => void
  'aria-label': string
  className?: string
  children: ReactNode
}

export function IconButton({
  onClick,
  'aria-label': ariaLabel,
  className = 'text-gray-400 hover:text-gray-600',
  children,
}: IconButtonProps) {
  return (
    <button 
      onClick={onClick} 
      aria-label={ariaLabel} 
      className={`cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 ${className}`}
    >
      {children}
    </button>
  )
}
