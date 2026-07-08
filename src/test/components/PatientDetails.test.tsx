import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PatientDetails } from '../../pages/PatientDetails'
import * as api from '../../services/api'
import { ToastProvider } from '../../contexts/ToastContext'

describe('PatientDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithProviders = (ui: React.ReactElement, route = '/patient/1') => {
    return render(
      <ToastProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/patient/:id" element={ui} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    )
  }

  it('renders loading skeleton initially', () => {
    vi.spyOn(api, 'fetchPatientById').mockImplementation(() => new Promise(() => {}))
    const { container } = renderWithProviders(<PatientDetails />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders patient details after fetching', async () => {
    const mockPatient = {
      id: '1',
      name: 'Jane Doe',
      description: 'Test patient',
      website: '',
      avatar: '',
      createdAt: '2023-01-01'
    }
    vi.spyOn(api, 'fetchPatientById').mockResolvedValue(mockPatient)

    renderWithProviders(<PatientDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })
    expect(screen.getByText(/Registered on/)).toBeInTheDocument()
  })

  it('renders error message if fetching fails', async () => {
    vi.spyOn(api, 'fetchPatientById').mockRejectedValue(new Error('Failed'))
    
    renderWithProviders(<PatientDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Could not load patient information.')).toBeInTheDocument()
    })
  })
})
