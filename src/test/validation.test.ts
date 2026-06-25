describe('PatientModal validation', () => {
  const validate = (form: { name: string; description: string; website: string }) => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'El nombre es requerido'
    if (!form.description.trim()) errors.description = 'La descripción es requerida'
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      errors.website = 'La URL debe comenzar con http:// o https://'
    }
    return errors
  }

  it('returns error when name is empty', () => {
    const errors = validate({ name: '', description: 'desc', website: '' })
    expect(errors.name).toBeDefined()
  })

  it('returns error when description is empty', () => {
    const errors = validate({ name: 'John', description: '', website: '' })
    expect(errors.description).toBeDefined()
  })

  it('returns error when website is invalid URL', () => {
    const errors = validate({ name: 'John', description: 'desc', website: 'not-a-url' })
    expect(errors.website).toBeDefined()
  })

  it('passes with valid data', () => {
    const errors = validate({ name: 'John', description: 'desc', website: 'https://example.com' })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('passes with empty website', () => {
    const errors = validate({ name: 'John', description: 'desc', website: '' })
    expect(errors.website).toBeUndefined()
  })
})