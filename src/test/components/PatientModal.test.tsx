import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PatientModal } from '../../components/PatientModal/PatientModal'

describe('PatientModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(<PatientModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />)
    expect(screen.queryByText('Add Patient')).not.toBeInTheDocument()
  })

  it('renders Add Patient title when no patient is provided', () => {
    render(<PatientModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />)
    expect(screen.getByText('Add Patient')).toBeInTheDocument()
  })

  it('renders Edit Patient title and populates fields when patient is provided', () => {
    const mockPatient = { id: '1', name: 'John', description: 'Desc', website: 'https://j.com', avatar: '', createdAt: '2023' }
    render(<PatientModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} patient={mockPatient} />)
    expect(screen.getByText('Edit Patient')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Desc')).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<PatientModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows validation errors when saving with empty required fields', () => {
    render(<PatientModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />)
    fireEvent.click(screen.getByText('Add patient'))
    
    // If it fails validation, onSave is not called
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('calls onSave with form data when validation passes', () => {
    render(<PatientModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />)
    
    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Patient name'), { target: { value: 'New Patient' } })
    fireEvent.change(screen.getByPlaceholderText('Patient description'), { target: { value: 'New Description' } })
    
    fireEvent.click(screen.getByText('Add patient'))
    
    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'New Patient',
      description: 'New Description',
      website: '',
      avatar: ''
    })
  })
})
