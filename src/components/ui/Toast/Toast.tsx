import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg bg-[#111111] text-white text-sm transition-all duration-300 border border-gray-800">
      <span className={type === 'success' ? 'text-green-400' : 'text-red-400'}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className="font-medium tracking-wide">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white transition-colors">
        ✕
      </button>
    </div>
  )
}