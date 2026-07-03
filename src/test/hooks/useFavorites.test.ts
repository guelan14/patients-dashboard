import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFavorites } from '../../hooks/useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('should toggle favorite status', () => {
    const { result } = renderHook(() => useFavorites())
    const patient = { id: '1', name: 'John Doe' }

    act(() => {
      result.current.toggleFavorite(patient)
    })
    expect(result.current.favorites).toEqual([{ id: '1', name: 'John Doe', avatar: '' }])
    expect(result.current.isFavorite('1')).toBe(true)

    act(() => {
      result.current.toggleFavorite(patient)
    })
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite('1')).toBe(false)
  })

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    const patient = { id: '2', name: 'Jane Doe' }
    
    act(() => {
      result.current.toggleFavorite(patient)
    })

    const stored = JSON.parse(localStorage.getItem('patient-favorites') || '[]')
    expect(stored).toEqual([{ id: '2', name: 'Jane Doe', avatar: '' }])
  })
})