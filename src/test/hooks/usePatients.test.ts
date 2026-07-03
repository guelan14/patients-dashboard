import { renderHook, act } from '@testing-library/react'
import { usePatients } from '../../hooks/usePatients'
import { vi } from 'vitest'

vi.mock('../../services/api', () => ({
  fetchPatients: vi.fn(),
}))

import { fetchPatients } from '../../services/api'

const mockPatients = [
  { id: '1', name: 'John', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
  { id: '2', name: 'Jane', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
]

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with empty state', () => {
    const { result } = renderHook(() => usePatients())
    expect(result.current.patients).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.hasMore).toBe(true)
  })

  it('loads patients on refresh', async () => {
    vi.mocked(fetchPatients).mockResolvedValue(mockPatients)
    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.patients).toHaveLength(2)
    expect(result.current.loading).toBe(false)
  })

  it('adds a new patient', async () => {
    vi.mocked(fetchPatients).mockResolvedValue(mockPatients)
    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    act(() => {
      result.current.addPatient({
        name: 'New Patient',
        description: 'new desc',
        website: 'https://new.com',
        avatar: '',
      })
    })

    expect(result.current.patients[0].name).toBe('New Patient')
    expect(result.current.patients).toHaveLength(3)
  })

  it('updates an existing patient', async () => {
    vi.mocked(fetchPatients).mockResolvedValue(mockPatients)
    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    act(() => {
      result.current.updatePatient({
        ...mockPatients[0],
        name: 'Updated Name',
      })
    })

    expect(result.current.patients[0].name).toBe('Updated Name')
  })

  it('sets hasMore to false when less than 10 patients returned', async () => {
    vi.mocked(fetchPatients).mockResolvedValue(mockPatients)
    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.hasMore).toBe(false)
  })

  it('handles API error', async () => {
    vi.mocked(fetchPatients).mockRejectedValue(new Error('API error'))
    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.error).toBe('Error al cargar los pacientes')
    expect(result.current.loading).toBe(false)
  })
})