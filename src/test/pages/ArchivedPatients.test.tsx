import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ArchivedPatients } from '../../pages/ArchivedPatients'
import * as useArchivedPatientsHook from '../../hooks/useArchivedPatients'
import * as useToastHook from '../../hooks/useToast'

describe('ArchivedPatients', () => {
  const mockRestorePatient = vi.fn()
  const mockShowToast = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(useToastHook, 'useToast').mockReturnValue({
      toasts: [],
      showToast: mockShowToast,
      hideToast: vi.fn(),
    })

    vi.spyOn(useArchivedPatientsHook, 'useArchivedPatients').mockReturnValue({
      archivedPatients: [
        { id: 'local-1', name: 'Archived John', description: 'Test', website: '', avatar: '', createdAt: '2023-01-01' },
        { id: 'local-2', name: 'Archived Jane', description: 'Test', website: '', avatar: '', createdAt: '2023-01-01' },
      ],
      restorePatient: mockRestorePatient,
    })
  })

  it('renders archived patients and filters by search', () => {
    render(<ArchivedPatients />, { wrapper: MemoryRouter })

    expect(screen.getByText('Archived John')).toBeInTheDocument()
    expect(screen.getByText('Archived Jane')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search archived patients...')
    fireEvent.change(searchInput, { target: { value: 'Jane' } })

    expect(screen.getByText('Archived Jane')).toBeInTheDocument()
    expect(screen.queryByText('Archived John')).not.toBeInTheDocument()
  })

  it('restores an archived patient', () => {
    mockRestorePatient.mockReturnValue({
      id: 'local-1',
      name: 'Archived John',
      description: 'Test',
      website: '',
      avatar: '',
      createdAt: '2023-01-01',
    })

    render(<ArchivedPatients />, { wrapper: MemoryRouter })

    const restoreButton = screen.getAllByRole('button', { name: 'Restore' })[0]
    fireEvent.click(restoreButton)

    expect(mockRestorePatient).toHaveBeenCalledWith('local-1')
    expect(mockShowToast).toHaveBeenCalledWith('Patient restored successfully', 'success')
  })
})