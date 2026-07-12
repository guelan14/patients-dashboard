import { renderHook, act, waitFor } from '@testing-library/react'
import { usePatients } from '../../hooks/usePatients'
import { vi } from 'vitest'

vi.mock('../../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api')>()
  return {
    ...actual,
    fetchPatients: vi.fn(),
  }
})

import { fetchPatients } from '../../services/api'

const mockPatients = [
  { id: '1', name: 'John', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
  { id: '2', name: 'Jane', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
]

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts with empty state', async () => {
    vi.mocked(fetchPatients).mockResolvedValue([])
    const { result } = renderHook(() => usePatients())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.patients).toEqual([])
    expect(result.current.hasMore).toBe(false)
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
    expect(result.current.patients[0].id).toBe('local-1')
    expect(result.current.patients).toHaveLength(3)
  })

  it('persists added patients in localStorage and restores them on init', async () => {
    vi.mocked(fetchPatients).mockResolvedValue([])

    const { result, unmount } = renderHook(() => usePatients())

    act(() => {
      result.current.addPatient({
        name: 'Persistent Patient',
        description: 'desc',
        website: 'https://persisted.com',
        avatar: '',
      })
    })

    const storedPatients = JSON.parse(localStorage.getItem('patient-records-local-updates') || '[]')
    expect(storedPatients).toHaveLength(1)
    expect(storedPatients[0].name).toBe('Persistent Patient')

    unmount()

    const { result: restored } = renderHook(() => usePatients())
    expect(restored.current.patients[0].name).toBe('Persistent Patient')
  })

  it('skips ids already used by archived local patients', async () => {
    localStorage.setItem(
      'patient-records-archived-patients',
      JSON.stringify([
        {
          id: 'local-1',
          name: 'Archived Local',
          description: 'desc',
          website: 'https://archived.com',
          avatar: '',
          createdAt: '2023-01-01',
        },
      ])
    )
    vi.mocked(fetchPatients).mockResolvedValue([])

    const { result } = renderHook(() => usePatients())

    act(() => {
      result.current.addPatient({
        name: 'New Patient',
        description: 'new desc',
        website: 'https://new.com',
        avatar: '',
      })
    })

    expect(result.current.patients[0].id).toBe('local-2')
  })

  it('includes persisted patients when searching', async () => {
    localStorage.setItem(
      'patient-records-local-updates',
      JSON.stringify([
        {
          id: 'local-1',
          name: 'Search Match',
          description: 'desc',
          website: 'https://search.com',
          avatar: '',
          createdAt: '2023-01-01',
        },
      ])
    )
    vi.mocked(fetchPatients).mockResolvedValue([])

    const { result } = renderHook(() => usePatients('search'))

    expect(result.current.patients).toHaveLength(1)
    expect(result.current.patients[0].name).toBe('Search Match')
  })

  it('hides deleted api patients without breaking pagination', async () => {
    localStorage.setItem('patient-records-deleted-ids', JSON.stringify(['2']))
    vi.mocked(fetchPatients).mockResolvedValue([
      { id: '1', name: 'Visible', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '2', name: 'Deleted', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '3', name: 'Visible 2', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '4', name: 'Visible 3', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '5', name: 'Visible 4', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '6', name: 'Visible 5', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '7', name: 'Visible 6', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '8', name: 'Visible 7', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
      { id: '9', name: 'Visible 8', description: 'desc', website: 'https://test.com', avatar: '', createdAt: '2023-01-01' },
    ])

    const { result } = renderHook(() => usePatients())

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.patients.map((patient) => patient.id)).not.toContain('2')
    expect(result.current.hasMore).toBe(true)
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

    expect(result.current.error).toBe('Error loading patients')
    expect(result.current.loading).toBe(false)
  })
})