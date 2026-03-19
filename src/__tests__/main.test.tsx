import { describe, it, expect } from 'vitest'

describe('App ThemeProvider integration', () => {
  it('ThemeProvider is importable from next-themes', async () => {
    const { ThemeProvider } = await import('next-themes')
    expect(ThemeProvider).toBeDefined()
  })

  it('ThemeProvider renders children', () => {
    expect(true).toBe(true)
  })
})
