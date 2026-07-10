import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PatientGrid } from '../../components/PatientGrid/PatientGrid'

describe('PatientGrid', () => {
  const mockPatients = [
    { id: '1', name: 'Patient One', description: 'Desc 1', website: '', avatar: '', createdAt: '2023' },
    { id: '2', name: 'Patient Two', description: 'Desc 2', website: '', avatar: '', createdAt: '2023' }
  ]
  const mockOnToggle = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnArchive = vi.fn()

  it('renders skeletons when loading is true', () => {
    const { container } = render(
      <PatientGrid 
        patients={[]} 
        isFavorite={() => false} 
        onToggleFavorite={mockOnToggle} 
        onEdit={mockOnEdit} 
        onArchive={mockOnArchive}
        loading={true} 
      />,
      { wrapper: MemoryRouter }
    )
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders patient cards when loading is false and patients exist', () => {
    render(
      <PatientGrid 
        patients={mockPatients} 
        isFavorite={() => false} 
        onToggleFavorite={mockOnToggle} 
        onEdit={mockOnEdit} 
        onArchive={mockOnArchive}
        loading={false} 
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.getByText('Patient One')).toBeInTheDocument()
    expect(screen.getByText('Patient Two')).toBeInTheDocument()
  })
})
