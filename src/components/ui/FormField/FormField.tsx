import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-black dark:text-white mb-1 block">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
