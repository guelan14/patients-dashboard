import { renderHook, act } from '@testing-library/react'
import { useToast } from '../../hooks/useToast'
import { ToastProvider } from '../../contexts/ToastContext'
import type { ReactNode } from 'react'

describe('useToast', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  )

  it('starts with no toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper })
    expect(result.current.toasts.length).toBe(0)
  })

  it('shows success toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper })
    act(() => {
      result.current.showToast('Patient saved', 'success')
    })
    expect(result.current.toasts.length).toBe(1)
    expect(result.current.toasts[0].message).toBe('Patient saved')
    expect(result.current.toasts[0].type).toBe('success')
  })

  it('shows error toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper })
    act(() => {
      result.current.showToast('Something went wrong', 'error')
    })
    expect(result.current.toasts[0].type).toBe('error')
  })

  it('hides toast on hideToast', () => {
    const { result } = renderHook(() => useToast(), { wrapper })
    act(() => {
      result.current.showToast('test', 'success')
    })
    const id = result.current.toasts[0].id
    act(() => {
      result.current.hideToast(id)
    })
    expect(result.current.toasts.length).toBe(0)
  })

  it('defaults to success type', () => {
    const { result } = renderHook(() => useToast(), { wrapper })
    act(() => {
      result.current.showToast('test')
    })
    expect(result.current.toasts[0].type).toBe('success')
  })
})