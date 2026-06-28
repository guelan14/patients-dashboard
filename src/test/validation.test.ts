import { validatePatient } from '../utils/validatePatient'

describe('PatientModal validation', () => {
  it('returns error when name is empty', () => {
    const errors = validatePatient({ name: '', description: 'desc', website: '', avatar: '' })
    expect(errors.name).toBeDefined()
  })

  it('returns error when description is empty', () => {
    const errors = validatePatient({ name: 'John', description: '', website: '', avatar: '' })
    expect(errors.description).toBeDefined()
  })

  it('returns error when website is invalid URL', () => {
    const errors = validatePatient({ name: 'John', description: 'desc', website: 'not-a-url', avatar: '' })
    expect(errors.website).toBeDefined()
  })

  it('passes with valid data', () => {
    const errors = validatePatient({ name: 'John', description: 'desc', website: 'https://example.com', avatar: '' })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('passes with empty website', () => {
    const errors = validatePatient({ name: 'John', description: 'desc', website: '', avatar: '' })
    expect(errors.website).toBeUndefined()
  })
})