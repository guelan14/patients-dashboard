import { render, screen } from '@testing-library/react'
import { FormField } from '../components/ui/FormField'

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField label="Username">
        <input data-testid="input" />
      </FormField>
    )
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('renders required asterisk when required is true', () => {
    render(
      <FormField label="Username" required>
        <input />
      </FormField>
    )
    expect(screen.getByText('Username *')).toBeInTheDocument()
  })

  it('renders error message when error is provided', () => {
    render(
      <FormField label="Username" error="This field is required">
        <input />
      </FormField>
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })
})
