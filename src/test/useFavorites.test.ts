import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../hooks/useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a patient to favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.toggleFavorite('43')
    })
    expect(result.current.isFavorite('43')).toBe(true)
  })

  it('removes a patient from favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.toggleFavorite('43')
      result.current.toggleFavorite('43')
    })
    expect(result.current.isFavorite('43')).toBe(false)
  })

  it('persists favorites in localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.toggleFavorite('43')
    })
    const stored = JSON.parse(localStorage.getItem('patient-favorites') || '[]')
    expect(stored).toContain('43')
  })
})