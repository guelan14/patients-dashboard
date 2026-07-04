import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { FavoritesSidebar } from '../../components/FavoritesSidebar/FavoritesSidebar'
import * as useFavoritesHook from '../../hooks/useFavorites'

describe('FavoritesSidebar', () => {
  const mockToggleFavorite = vi.fn()
  const mockOnClose = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
      isFavorite: () => false
    })
  })

  it('renders empty state when no favorites exist', () => {
    render(<FavoritesSidebar isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('You have no favorite patients yet.')).toBeInTheDocument()
  })

  it('renders favorite patients', () => {
    vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
      favorites: [
        { id: '1', name: 'John Doe', avatar: '' }
      ],
      toggleFavorite: mockToggleFavorite,
      isFavorite: () => true
    })

    render(<FavoritesSidebar isOpen={true} onClose={mockOnClose} />, { wrapper: MemoryRouter })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('ID: 1')).toBeInTheDocument()
  })

  it('shows delete confirmation modal and calls toggleFavorite when confirmed', () => {
    vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
      favorites: [
        { id: '1', name: 'John Doe', avatar: '' }
      ],
      toggleFavorite: mockToggleFavorite,
      isFavorite: () => true
    })

    render(<FavoritesSidebar isOpen={true} onClose={mockOnClose} />, { wrapper: MemoryRouter })
    
    // Find the trash icon button
    const deleteButton = screen.getByLabelText('Eliminar de favoritos')
    fireEvent.click(deleteButton)

    // Modal title should appear
    expect(screen.getByText('Eliminar de favoritos', { selector: 'h2' })).toBeInTheDocument()
    
    // Click confirm delete button
    const confirmButton = screen.getByRole('button', { name: 'Eliminar' })
    fireEvent.click(confirmButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith({ id: '1', name: 'John Doe', avatar: '' })
  })
})
