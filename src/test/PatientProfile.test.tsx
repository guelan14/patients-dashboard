import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PatientProfile } from '../components/PatientProfile/PatientProfile'

describe('PatientProfile', () => {
  const mockPatient = {
    id: '1234567890',
    name: 'John Doe',
    description: 'Test description',
    website: 'example.com',
    avatar: 'avatar.png',
    createdAt: '2023-01-01'
  }

  it('renders patient profile correctly', () => {
    render(<PatientProfile patient={mockPatient} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    // It should render first 8 chars of ID
    expect(screen.getByText('ID: 12345678')).toBeInTheDocument()
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const mockToggleFavorite = vi.fn()
    render(
      <PatientProfile 
        patient={mockPatient} 
        onToggleFavorite={mockToggleFavorite} 
      />
    )
    
    const favoriteBtn = screen.getByLabelText('Toggle favorite')
    fireEvent.click(favoriteBtn)
    
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockPatient)
  })

  it('calls onEdit when edit button is clicked', () => {
    const mockEdit = vi.fn()
    render(
      <PatientProfile 
        patient={mockPatient} 
        onEdit={mockEdit} 
      />
    )
    
    const editBtn = screen.getByLabelText('Edit patient')
    fireEvent.click(editBtn)
    
    expect(mockEdit).toHaveBeenCalledWith(mockPatient)
  })

  it('calls onDelete when delete button is clicked', () => {
    const mockDelete = vi.fn()
    render(
      <PatientProfile 
        patient={mockPatient} 
        onDelete={mockDelete} 
      />
    )
    
    const deleteBtn = screen.getByLabelText('Delete patient')
    fireEvent.click(deleteBtn)
    
    expect(mockDelete).toHaveBeenCalledWith(mockPatient)
  })

  it('formats website link correctly when missing http', () => {
    render(<PatientProfile patient={mockPatient} />)
    const link = screen.getByRole('link', { name: /example.com/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('keeps http in website link if already present', () => {
    const patientWithHttp = { ...mockPatient, website: 'http://example.com' }
    render(<PatientProfile patient={patientWithHttp} />)
    const link = screen.getByRole('link', { name: /http:\/\/example.com/i })
    expect(link).toHaveAttribute('href', 'http://example.com')
  })
})
