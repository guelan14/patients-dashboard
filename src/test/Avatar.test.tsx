import { render, screen } from '@testing-library/react'
import { Avatar } from '../components/ui/Avatar'

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />)
    const img = screen.getByAltText('John Doe')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders fallback ui-avatars URL when src is not provided', () => {
    render(<Avatar name="John Doe" />)
    const img = screen.getByAltText('John Doe')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'))
  })
})
