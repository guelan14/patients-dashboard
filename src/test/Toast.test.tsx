import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Toast } from '../components/ui/Toast/Toast'

describe('Toast', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders success toast correctly', () => {
    render(<Toast message="Success message" type="success" onClose={mockOnClose} />)
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders error toast correctly', () => {
    render(<Toast message="Error message" type="error" onClose={mockOnClose} />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
    const errorIcons = screen.getAllByText('✕')
    expect(errorIcons.length).toBeGreaterThan(0)
  })

  it('calls onClose when close button is clicked', () => {
    render(<Toast message="Test" type="success" onClose={mockOnClose} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockOnClose).toHaveBeenCalled()
  })
})
