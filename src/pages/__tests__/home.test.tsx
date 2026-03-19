import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { generateLog, getTypeColor, getTypeIcon, HomePage } from '@/pages/home'
import type { MediaType } from '@/pages/home'
import { BookOpen, Play, Monitor, Headphones, FileText } from 'lucide-react'
import { MemoryRouter } from 'react-router'

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

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Filter out motion-specific props to avoid React warnings
function filterMotionProps(props: Record<string, any>) {
  const motionProps = ['variants', 'initial', 'animate', 'exit', 'transition', 'whileHover', 'layout', 'mode']
  const filtered: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!motionProps.includes(key)) {
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
  it('returns Play for Anime', () => {
    expect(getTypeIcon('Anime')).toBe(Play)
  })

  it('returns BookOpen for Manga', () => {
    expect(getTypeIcon('Manga')).toBe(BookOpen)
  })

  it('returns BookOpen for LN', () => {
    expect(getTypeIcon('LN')).toBe(BookOpen)
  })

  it('returns Monitor for VN', () => {
    expect(getTypeIcon('VN')).toBe(Monitor)
  })

  it('returns Headphones for Listening', () => {
    expect(getTypeIcon('Listening')).toBe(Headphones)
  })

  it('returns FileText for Reading (default)', () => {
    expect(getTypeIcon('Reading')).toBe(FileText)
  })
})

describe('generateLog', () => {
  it('returns a valid LogEntry object', () => {
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
    // Initials should be derived from name
    const expectedInitials = log.member.name.split(' ').map((n: string) => n[0]).join('')
    expect(log.member.initials).toBe(expectedInitials)
  })

  it('generates media with title and valid type', () => {
    const log = generateLog()
    expect(log.media.title).toBeTruthy()
    const validTypes: MediaType[] = ['Anime', 'Manga', 'LN', 'VN', 'Listening', 'Reading']
    expect(validTypes).toContain(log.media.type)
  })

  it('generates appropriate amount format for Anime/Listening types', () => {
    // Run multiple times to increase chance of hitting these types
    for (let i = 0; i < 100; i++) {
      const log = generateLog()
      if (['Anime', 'Listening'].includes(log.media.type)) {
        expect(log.amount).toMatch(/^\d+ eps$/)
      }
    }
  })

  it('generates appropriate amount format for VN type', () => {
    for (let i = 0; i < 100; i++) {
      const log = generateLog()
      if (log.media.type === 'VN') {
        expect(log.amount).toMatch(/^\d+ mins$/)
      }
    }
  })

  it('generates appropriate amount format for page-based types', () => {
    for (let i = 0; i < 100; i++) {
      const log = generateLog()
      if (['Manga', 'LN', 'Reading'].includes(log.media.type)) {
        expect(log.amount).toMatch(/^\d+ pages$/)
      }
    }
  })

  it('generates totalMonth in hours format', () => {
    const log = generateLog()
    expect(log.totalMonth).toMatch(/^\d+h$/)
  })

  it('generates a unique id', () => {
    const log = generateLog()
    expect(log.id).toBeTruthy()
    expect(typeof log.id).toBe('string')
  })
})

describe('HomePage', () => {
  beforeEach(() => {
    mockTheme = 'light'
    mockSetTheme.mockClear()
  })

  const renderHomePage = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
  }

  it('renders the page title', () => {
    renderHomePage()
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders the site name in header', () => {
    renderHomePage()
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    renderHomePage()
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('renders Moon icon when theme is light', () => {
    mockTheme = 'light'
    renderHomePage()
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    // In light mode, Moon icon should be shown (to switch to dark)
    expect(toggleButton).toBeInTheDocument()
  })

  it('calls setTheme with dark when clicking toggle in light mode', () => {
    mockTheme = 'light'
    renderHomePage()
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    fireEvent.click(toggleButton)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with light when clicking toggle in dark mode', () => {
    mockTheme = 'dark'
    renderHomePage()
    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })
    fireEvent.click(toggleButton)
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('renders Discord button', () => {
    renderHomePage()
    const discordButton = screen.getByRole('button', { name: 'Discord' })
    expect(discordButton).toBeInTheDocument()
  })

  it('renders GitHub button', () => {
    renderHomePage()
    const githubButton = screen.getByRole('button', { name: 'GitHub' })
    expect(githubButton).toBeInTheDocument()
  })

  it('renders stats cards', () => {
    renderHomePage()
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders Live Activity section', () => {
    renderHomePage()
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('renders Join now text', () => {
    renderHomePage()
    expect(screen.getByText('Join now')).toBeInTheDocument()
  })

  it('uses theme-aware CSS classes on root element', () => {
    const { container } = renderHomePage()
    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv.className).toContain('bg-background')
    expect(rootDiv.className).toContain('text-foreground')
  })

  it('uses theme-aware CSS classes on header', () => {
    renderHomePage()
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(header?.className).toContain('bg-background/80')
    expect(header?.className).toContain('border-border')
  })
})
