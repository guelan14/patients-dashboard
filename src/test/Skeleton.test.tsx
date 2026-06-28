import { render } from '@testing-library/react'
import { SkeletonCard } from '../components/Skeleton/SkeletonCard'

describe('SkeletonCard', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

})
