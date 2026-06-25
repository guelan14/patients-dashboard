import { renderHook, act } from '@testing-library/react'
import { useToast } from '../hooks/useToast'

describe('useToast', () => {
  it('starts hidden', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toast.visible).toBe(false)
  })

  it('shows success toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Patient saved', 'success')
    })
    expect(result.current.toast.visible).toBe(true)
    expect(result.current.toast.message).toBe('Patient saved')
    expect(result.current.toast.type).toBe('success')
  })

  it('shows error toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Something went wrong', 'error')
    })
    expect(result.current.toast.type).toBe('error')
  })

  it('hides toast on hideToast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('test', 'success')
    })
    act(() => {
      result.current.hideToast()
    })
    expect(result.current.toast.visible).toBe(false)
  })

  it('defaults to success type', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('test')
    })
    expect(result.current.toast.type).toBe('success')
  })
})