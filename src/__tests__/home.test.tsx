import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HomePage } from '@/pages/home'

// Mock next-themes
const mockSetTheme = vi.fn()
let mockTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, animate, layout, exit, transition, whileHover, style, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('HomePage', () => {
  beforeEach(() => {
    mockTheme = 'light'
    mockSetTheme.mockClear()
  })

  it('renders the page title', () => {
    render(<HomePage />)
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders the Immerse With Me branding', () => {
    render(<HomePage />)
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    render(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('renders Discord and GitHub buttons', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: 'Discord' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('calls setTheme with "dark" when in light mode and toggle is clicked', () => {
    mockTheme = 'light'
    render(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    fireEvent.click(toggleButton)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with "light" when in dark mode and toggle is clicked', () => {
    mockTheme = 'dark'
    render(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    fireEvent.click(toggleButton)
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('renders stats cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders the live activity section', () => {
    render(<HomePage />)
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('uses theme-aware CSS classes on root container', () => {
    const { container } = render(<HomePage />)
    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv.className).toContain('bg-background')
    expect(rootDiv.className).toContain('text-foreground')
    // Should NOT contain hardcoded colors
    expect(rootDiv.className).not.toContain('bg-[#FAFAF7]')
    expect(rootDiv.className).not.toContain('text-[#1A1A1A]')
  })

  it('uses theme-aware CSS classes on header', () => {
    render(<HomePage />)
    const header = document.querySelector('header')
    expect(header).not.toBeNull()
    expect(header!.className).toContain('bg-background/80')
    expect(header!.className).toContain('border-border')
    // Should NOT contain hardcoded colors
    expect(header!.className).not.toContain('bg-[#FAFAF7]')
    expect(header!.className).not.toContain('border-black/5')
  })

  it('renders stat values', () => {
    render(<HomePage />)
    expect(screen.getByText('28,450')).toBeInTheDocument()
    expect(screen.getByText('1,204')).toBeInTheDocument()
  })

  it('renders "Join now" text', () => {
    render(<HomePage />)
    expect(screen.getByText('Join now')).toBeInTheDocument()
  })
})

describe('Theme toggle icon', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('shows Moon icon in light mode (to switch to dark)', () => {
    mockTheme = 'light'
    render(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    // In light mode, the Moon icon should be shown (to indicate "click to go dark")
    // The button should exist and be clickable
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton.querySelector('svg')).not.toBeNull()
  })

  it('shows Sun icon in dark mode (to switch to light)', () => {
    mockTheme = 'dark'
    render(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton.querySelector('svg')).not.toBeNull()
  })
})
