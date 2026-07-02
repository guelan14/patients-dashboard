import { useEffect, useState } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { CloseIcon } from '../Icons/Icons'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation after mount
    requestAnimationFrame(() => setIsVisible(true))

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for exit animation
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div 
      className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg bg-[#111111] text-white text-sm transition-all duration-300 border border-gray-800 transform ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'}`}
    >
      <span className={type === 'success' ? 'text-green-400' : 'text-red-400'}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className="font-medium tracking-wide flex-1">{message}</span>
      <IconButton onClick={handleClose} aria-label="Cerrar notificación" className="text-gray-400 hover:text-white -mr-2 p-1">
        <CloseIcon className="w-4 h-4" />
      </IconButton>
    </div>
  )
}