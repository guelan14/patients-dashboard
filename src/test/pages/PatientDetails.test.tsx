import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PatientDetails } from '../../pages/PatientDetails'
import * as useFavoritesHook from '../../hooks/useFavorites'
import * as useToastHook from '../../hooks/useToast'
import { fetchPatientById, isPatientArchived, deletePatientById, restoreArchivedPatient } from '../../services/api'

// Mock the API services
vi.mock('../../services/api', () => ({
  fetchPatientById: vi.fn(),
  isPatientArchived: vi.fn(),
  deletePatientById: vi.fn(),
  restoreArchivedPatient: vi.fn(),
}))

describe('PatientDetails', () => {
  const mockShowToast = vi.fn()
  const mockToggleFavorite = vi.fn()
  const mockIsFavorite = vi.fn()

  const mockPatient = {
    id: '1',
    name: 'John Doe',
    description: 'Patient about text',
    website: 'https://johndoe.com',
    avatar: '',
    createdAt: '2023-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(useToastHook, 'useToast').mockReturnValue({
      toasts: [],
      showToast: mockShowToast,
      hideToast: vi.fn(),
    })

    vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
      isFavorite: mockIsFavorite,
    })

    mockIsFavorite.mockReturnValue(false)
    vi.mocked(isPatientArchived).mockReturnValue(false)
  })

  const renderComponent = (patientId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/patient/${patientId}`]}>
        <Routes>
          <Route path="/patient/:id" element={<PatientDetails />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders loading skeleton and then loaded patient profile', async () => {
    vi.mocked(fetchPatientById).mockResolvedValueOnce(mockPatient)

    renderComponent()

    // Initially loading skeleton is displayed
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()

    // Wait for the patient profile to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'John Doe' })).toBeInTheDocument()
    })

    expect(screen.getByText('Patient about text')).toBeInTheDocument()
    expect(screen.getByText('https://johndoe.com')).toBeInTheDocument()
    expect(screen.getByText(/Registered on/i)).toBeInTheDocument()
  })

  it('renders error message when patient is not found', async () => {
    vi.mocked(fetchPatientById).mockRejectedValueOnce(new Error('Patient not found'))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Patient not found')).toBeInTheDocument()
    })
  })

  it('toggles favorite status when clicking the favorite button', async () => {
    vi.mocked(fetchPatientById).mockResolvedValueOnce(mockPatient)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const favButton = screen.getByLabelText('Toggle favorite')
    fireEvent.click(favButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockPatient)
  })

  it('opens edit modal and updates local display upon save', async () => {
    vi.mocked(fetchPatientById).mockResolvedValueOnce(mockPatient)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const editBtn = screen.getByLabelText('Edit patient')
    fireEvent.click(editBtn)

    // Verify modal is open
    expect(screen.getByRole('heading', { name: 'Edit Patient' })).toBeInTheDocument()

    // Change input value
    const nameInput = screen.getByPlaceholderText('Patient name')
    fireEvent.change(nameInput, { target: { value: 'Johnny Doe' } })

    // Save
    const saveBtn = screen.getByRole('button', { name: 'Save changes' })
    fireEvent.click(saveBtn)

    // Verify modal is closed, toast shown, and name updated on page
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Edit Patient' })).not.toBeInTheDocument()
    })

    expect(mockShowToast).toHaveBeenCalledWith('Patient updated successfully', 'success')
    expect(screen.getByText('Johnny Doe')).toBeInTheDocument()
  })

  it('shows confirmation modal and archives patient upon delete click', async () => {
    vi.mocked(fetchPatientById).mockResolvedValueOnce(mockPatient)
    vi.mocked(isPatientArchived).mockReturnValue(false)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByLabelText('Archive patient')
    fireEvent.click(deleteBtn)

    // Confirm archive modal is open
    expect(screen.getByRole('heading', { name: 'Archive Patient' })).toBeInTheDocument()

    // Click confirm button in modal
    const archiveConfirmBtn = screen.getByRole('button', { name: 'Archive' })
    fireEvent.click(archiveConfirmBtn)

    expect(deletePatientById).toHaveBeenCalledWith(mockPatient)
    expect(mockShowToast).toHaveBeenCalledWith('Patient archived successfully', 'success')
  })

  it('shows confirmation modal and restores patient upon restore click', async () => {
    vi.mocked(fetchPatientById).mockResolvedValueOnce(mockPatient)
    vi.mocked(isPatientArchived).mockReturnValue(true)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const restoreBtn = screen.getByLabelText('Restore patient')
    fireEvent.click(restoreBtn)

    // Confirm restore modal is open
    expect(screen.getByRole('heading', { name: 'Restore Patient' })).toBeInTheDocument()

    // Click confirm button in modal
    const restoreConfirmBtn = screen.getByRole('button', { name: 'Restore' })
    fireEvent.click(restoreConfirmBtn)

    expect(restoreArchivedPatient).toHaveBeenCalledWith('1')
    expect(mockShowToast).toHaveBeenCalledWith('Patient restored successfully', 'success')
  })
})
