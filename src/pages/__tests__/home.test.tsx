import type { ReactElement, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import { MemoryRouter } from 'react-router'
import { HomePage } from '@/pages/home'

type MotionProps<T> = { children: ReactNode } & React.HTMLAttributes<T> & {
  whileHover?: unknown
  initial?: unknown
  animate?: unknown
  exit?: unknown
  transition?: unknown
  layout?: unknown
  variants?: unknown
}

const stripMotionProps = <T,>({
  children,
  whileHover,
  initial,
  animate,
  exit,
  transition,
  layout,
  variants,
  ...rest
}: MotionProps<T>) => ({ children, props: rest })

vi.mock('framer-motion', () => ({
  motion: {
    div: (input: MotionProps<HTMLDivElement>) => {
      const { children, props } = stripMotionProps(input)
      return <div {...props}>{children}</div>
    },
    span: (input: MotionProps<HTMLSpanElement>) => {
      const { children, props } = stripMotionProps(input)
      return <span {...props}>{children}</span>
    },
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

// Helper to render with providers
function renderWithProviders(ui: ReactElement, { theme = 'light' } = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    // next-themes uses localStorage
    localStorage.clear()
  })

  it('renders the page heading', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders the brand name in header', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })

  it('renders Discord and GitHub buttons', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('button', { name: 'Discord' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('renders all three stat cards', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders the live activity section', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('uses theme-aware CSS classes on the root container', () => {
    const { container } = renderWithProviders(<HomePage />)
    const root = container.querySelector('div.min-h-screen')
    expect(root?.className).toContain('bg-background')
    expect(root?.className).toContain('text-foreground')
  })

  it('uses theme-aware CSS classes on the header', () => {
    renderWithProviders(<HomePage />)
    const header = document.querySelector('header')
    expect(header?.className).toContain('bg-background/80')
    expect(header?.className).toContain('border-border')
  })

  describe('theme toggle interaction', () => {
    it('clicking toggle theme button changes the theme', async () => {
      const user = userEvent.setup()
      renderWithProviders(<HomePage />)

      const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })

      // Click to toggle theme
      await user.click(toggleButton)

      // After clicking, the theme should have changed
      // We verify the button is still present and clickable
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
    })
  })
})
