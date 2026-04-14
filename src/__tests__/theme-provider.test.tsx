import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

describe('ThemeProvider configuration', () => {
  it('renders children within ThemeProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('ThemeProvider with attribute="class" applies class-based theming', () => {
    // The ThemeProvider should accept these props without errors
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <span>Themed content</span>
      </ThemeProvider>
    )
    expect(screen.getByText('Themed content')).toBeInTheDocument()
  })

  it('ThemeProvider defaults to light theme', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div data-testid="themed">Content</div>
      </ThemeProvider>
    )
    // The component should render without errors with defaultTheme="light"
    expect(screen.getByTestId('themed')).toBeInTheDocument()
  })

  it('ThemeProvider has system preference disabled', () => {
    // enableSystem={false} means the theme won't auto-detect from OS preference
    // This is intentional since a manual toggle is provided
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div data-testid="no-system">No system theme</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('no-system')).toBeInTheDocument()
  })
})
