import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage, getTypeColor, getTypeIcon, generateLog } from './home'

// Mock next-themes
const mockSetTheme = vi.fn()
let mockTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    const Component = ({ children, ...props }: any) => {
      const filtered: Record<string, any> = {}
      const motionKeys = ['variants', 'initial', 'animate', 'exit', 'transition', 'whileHover', 'layout']
      for (const [key, value] of Object.entries(props)) {
        if (!motionKeys.includes(key)) {
          filtered[key] = value
        }
      }
      const Tag = tag as any
      return <Tag {...filtered}>{children}</Tag>
    }
    return Component
  }

  return {
    motion: {
      div: createMotionComponent('div'),
      span: createMotionComponent('span'),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

describe('getTypeColor', () => {
  it('returns correct color classes for each media type', () => {
    expect(getTypeColor('Anime')).toBe('bg-blue-50 text-blue-700 border-blue-200')
    expect(getTypeColor('Manga')).toBe('bg-green-50 text-green-700 border-green-200')
    expect(getTypeColor('LN')).toBe('bg-amber-50 text-amber-700 border-amber-200')
    expect(getTypeColor('VN')).toBe('bg-purple-50 text-purple-700 border-purple-200')
    expect(getTypeColor('Listening')).toBe('bg-red-50 text-red-700 border-red-200')
    expect(getTypeColor('Reading')).toBe('bg-stone-100 text-stone-600 border-stone-200')
  })
})

describe('getTypeIcon', () => {
  it('returns correct icon component for each media type', () => {
    // Lucide icons have displayName set
    expect(getTypeIcon('Anime').displayName).toBe('Play')
    expect(getTypeIcon('Manga').displayName).toBe('BookOpen')
    expect(getTypeIcon('LN').displayName).toBe('BookOpen')
    expect(getTypeIcon('VN').displayName).toBe('Monitor')
    expect(getTypeIcon('Listening').displayName).toBe('Headphones')
    expect(getTypeIcon('Reading').displayName).toBe('FileText')
  })
})

describe('generateLog', () => {
  it('returns a log entry with all required fields', () => {
    const log = generateLog()
    expect(log).toHaveProperty('id')
    expect(log).toHaveProperty('member.name')
    expect(log).toHaveProperty('member.initials')
    expect(log).toHaveProperty('member.color')
    expect(log).toHaveProperty('media.title')
    expect(log).toHaveProperty('media.type')
    expect(log).toHaveProperty('amount')
    expect(log).toHaveProperty('totalMonth')
    expect(log).toHaveProperty('timestamp')
  })

  it('generates valid media types', () => {
    const validTypes = ['Anime', 'Manga', 'LN', 'VN', 'Listening', 'Reading']
    for (let i = 0; i < 30; i++) {
      const log = generateLog()
      expect(validTypes).toContain(log.media.type)
    }
  })

  it('generates amount format matching media type', () => {
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

  it('generates totalMonth in hours format', () => {
    const log = generateLog()
    expect(log.totalMonth).toMatch(/^\d+h$/)
  })
})

describe('HomePage', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockTheme = 'light'
  })

  it('renders the header with app name', () => {
    render(<HomePage />)
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })

  it('renders the hero heading', () => {
    render(<HomePage />)
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })

  it('renders Discord and GitHub buttons', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: 'Discord' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('renders all stat cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders Live Activity section', () => {
    render(<HomePage />)
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('calls setTheme("dark") when clicking toggle in light mode', async () => {
    mockTheme = 'light'
    const user = userEvent.setup()
    render(<HomePage />)
    await user.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme("light") when clicking toggle in dark mode', async () => {
    mockTheme = 'dark'
    const user = userEvent.setup()
    render(<HomePage />)
    await user.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('uses theme-aware CSS classes on root container', () => {
    const { container } = render(<HomePage />)
    const rootDiv = container.firstElementChild as HTMLElement
    expect(rootDiv.className).toContain('bg-background')
    expect(rootDiv.className).toContain('text-foreground')
  })

  it('uses theme-aware CSS classes on header', () => {
    render(<HomePage />)
    const header = document.querySelector('header')
    expect(header).not.toBeNull()
    expect(header!.className).toContain('bg-background/80')
    expect(header!.className).toContain('border-border')
  })

  it('renders Join now text', () => {
    render(<HomePage />)
    expect(screen.getByText('Join now')).toBeInTheDocument()
  })
})
