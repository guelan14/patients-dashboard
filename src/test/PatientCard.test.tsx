import { render, screen, fireEvent } from '@testing-library/react'
import { PatientCard } from '../components/PatientCard/PatientCard'

const mockPatient = {
  id: '1',
  name: 'John Doe',
  description: 'Test description',
  website: 'https://example.com',
  avatar: '',
  createdAt: '2023-01-01',
}

describe('PatientCard', () => {
  it('renders patient name', () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
      />
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders patient ID', () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
      />
    )
    expect(screen.getByText('ID: 1')).toBeInTheDocument()
  })

  it('shows description when expanded', () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
      />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('calls onToggleFavorite when favorite button clicked', () => {
    const mockToggle = vi.fn()
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        onToggleFavorite={mockToggle}
        onEdit={() => {}}
      />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(mockToggle).toHaveBeenCalledWith('1')
  })

  it('calls onEdit when edit button clicked', () => {
    const mockEdit = vi.fn()
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onEdit={mockEdit}
      />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockEdit).toHaveBeenCalledWith(mockPatient)
  })
})