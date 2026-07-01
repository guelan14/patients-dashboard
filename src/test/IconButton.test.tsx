import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { IconButton } from '../components/ui/IconButton/IconButton'

describe('IconButton', () => {
  it('renders correctly with aria-label', () => {
    render(
      <IconButton aria-label="Delete" onClick={() => {}}>
        <svg data-testid="icon" />
      </IconButton>
    )
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()
    render(
      <IconButton aria-label="Delete" onClick={mockOnClick}>
        <svg />
      </IconButton>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(mockOnClick).toHaveBeenCalled()
  })
})
