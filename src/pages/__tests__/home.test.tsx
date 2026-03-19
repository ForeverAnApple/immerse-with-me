import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { generateLog, getTypeColor, getTypeIcon } from '@/pages/home'
import type { MediaType } from '@/pages/home'

// Mock next-themes
const mockSetTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Helper to filter out motion-specific props that aren't valid DOM attributes
function filterMotionProps(props: Record<string, any>) {
  const motionPropKeys = ['variants', 'initial', 'animate', 'exit', 'transition', 'whileHover', 'layout', 'mode']
  const filtered: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!motionPropKeys.includes(key)) {
      filtered[key] = value
    }
  }
  return filtered
}

describe('getTypeColor', () => {
  it('returns correct classes for Anime', () => {
    expect(getTypeColor('Anime')).toBe('bg-blue-50 text-blue-700 border-blue-200')
  })

  it('returns correct classes for Manga', () => {
    expect(getTypeColor('Manga')).toBe('bg-green-50 text-green-700 border-green-200')
  })

  it('returns correct classes for LN', () => {
    expect(getTypeColor('LN')).toBe('bg-amber-50 text-amber-700 border-amber-200')
  })

  it('returns correct classes for VN', () => {
    expect(getTypeColor('VN')).toBe('bg-purple-50 text-purple-700 border-purple-200')
  })

  it('returns correct classes for Listening', () => {
    expect(getTypeColor('Listening')).toBe('bg-red-50 text-red-700 border-red-200')
  })

  it('returns correct classes for Reading (default)', () => {
    expect(getTypeColor('Reading')).toBe('bg-stone-100 text-stone-600 border-stone-200')
  })
})

describe('getTypeIcon', () => {
  it('returns Play icon for Anime', () => {
    const icon = getTypeIcon('Anime')
    expect(icon.displayName || icon.name).toContain('Play')
  })

  it('returns BookOpen icon for Manga', () => {
    const icon = getTypeIcon('Manga')
    expect(icon.displayName || icon.name).toContain('BookOpen')
  })

  it('returns BookOpen icon for LN', () => {
    const icon = getTypeIcon('LN')
    expect(icon.displayName || icon.name).toContain('BookOpen')
  })

  it('returns Monitor icon for VN', () => {
    const icon = getTypeIcon('VN')
    expect(icon.displayName || icon.name).toContain('Monitor')
  })

  it('returns Headphones icon for Listening', () => {
    const icon = getTypeIcon('Listening')
    expect(icon.displayName || icon.name).toContain('Headphones')
  })

  it('returns FileText icon for Reading (default)', () => {
    const icon = getTypeIcon('Reading')
    expect(icon.displayName || icon.name).toContain('FileText')
  })
})

describe('generateLog', () => {
  it('returns a LogEntry with all required fields', () => {
    const log = generateLog()
    expect(log).toHaveProperty('id')
    expect(log).toHaveProperty('member')
    expect(log).toHaveProperty('media')
    expect(log).toHaveProperty('amount')
    expect(log).toHaveProperty('totalMonth')
    expect(log).toHaveProperty('timestamp')
  })

  it('generates member with name, initials, and color', () => {
    const log = generateLog()
    expect(log.member.name).toBeTruthy()
    expect(log.member.initials).toBeTruthy()
    expect(log.member.color).toBeTruthy()
  })

  it('generates media with title and valid type', () => {
    const log = generateLog()
    expect(log.media.title).toBeTruthy()
    const validTypes: MediaType[] = ['Anime', 'Manga', 'LN', 'VN', 'Listening', 'Reading']
    expect(validTypes).toContain(log.media.type)
  })

  it('generates appropriate amount format for media type', () => {
    // Run multiple times to cover different types
    for (let i = 0; i < 50; i++) {
      const log = generateLog()
      if (['Anime', 'Listening'].includes(log.media.type)) {
        expect(log.amount).toMatch(/^\d+ eps$/)
      } else if (log.media.type === 'VN') {
        expect(log.amount).toMatch(/^\d+ mins$/)
      } else {
        expect(log.amount).toMatch(/^\d+ pages$/)
      }
    }
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateLog().id))
    expect(ids.size).toBe(20)
  })
})

describe('HomePage', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders the theme toggle button', async () => {
    // Need to import dynamically after mocks are set up
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    const toggleButton = screen.getByLabelText('Toggle theme')
    expect(toggleButton).toBeInTheDocument()
  })

  it('calls setTheme when toggle is clicked', async () => {
    const { HomePage } = await import('@/pages/home')
    const user = userEvent.setup()
    render(<HomePage />)
    const toggleButton = screen.getByLabelText('Toggle theme')
    await user.click(toggleButton)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('renders the hero heading', async () => {
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders stat cards', async () => {
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders the live activity section', async () => {
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('renders Discord and GitHub buttons', async () => {
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    expect(screen.getByLabelText('Discord')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('renders the app title', async () => {
    const { HomePage } = await import('@/pages/home')
    render(<HomePage />)
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })
})
