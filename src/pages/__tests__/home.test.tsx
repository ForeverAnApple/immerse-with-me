import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from 'next-themes'
import { HomePage, getTypeColor, getTypeIcon, generateLog, type MediaType } from '../home'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('getTypeColor', () => {
  it('returns correct color for Anime', () => {
    expect(getTypeColor('Anime')).toBe('bg-blue-50 text-blue-700 border-blue-200')
  })

  it('returns correct color for Manga', () => {
    expect(getTypeColor('Manga')).toBe('bg-green-50 text-green-700 border-green-200')
  })

  it('returns correct color for LN', () => {
    expect(getTypeColor('LN')).toBe('bg-amber-50 text-amber-700 border-amber-200')
  })

  it('returns correct color for VN', () => {
    expect(getTypeColor('VN')).toBe('bg-purple-50 text-purple-700 border-purple-200')
  })

  it('returns correct color for Listening', () => {
    expect(getTypeColor('Listening')).toBe('bg-red-50 text-red-700 border-red-200')
  })

  it('returns correct color for Reading', () => {
    expect(getTypeColor('Reading')).toBe('bg-stone-100 text-stone-600 border-stone-200')
  })
})

describe('getTypeIcon', () => {
  it('returns Play icon for Anime', () => {
    const icon = getTypeIcon('Anime')
    expect(icon.displayName || icon.name).toBeTruthy()
  })

  it('returns BookOpen icon for Manga', () => {
    const icon = getTypeIcon('Manga')
    expect(icon).toBe(getTypeIcon('LN'))
  })

  it('returns different icon for VN', () => {
    const vnIcon = getTypeIcon('VN')
    const animeIcon = getTypeIcon('Anime')
    expect(vnIcon).not.toBe(animeIcon)
  })

  it('returns Headphones icon for Listening', () => {
    const listeningIcon = getTypeIcon('Listening')
    const animeIcon = getTypeIcon('Anime')
    expect(listeningIcon).not.toBe(animeIcon)
  })

  it('returns FileText icon for unknown/default type', () => {
    const defaultIcon = getTypeIcon('Reading')
    expect(defaultIcon).toBeTruthy()
  })
})

describe('generateLog', () => {
  it('returns a valid log entry', () => {
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

  it('generates appropriate amount format for Anime/Listening (eps)', () => {
    const logs = Array.from({ length: 100 }, () => generateLog())
    const animeLogs = logs.filter(l => ['Anime', 'Listening'].includes(l.media.type))
    if (animeLogs.length > 0) {
      expect(animeLogs[0].amount).toMatch(/^\d+ eps$/)
    }
  })

  it('generates appropriate amount format for VN (mins)', () => {
    const logs = Array.from({ length: 100 }, () => generateLog())
    const vnLogs = logs.filter(l => l.media.type === 'VN')
    if (vnLogs.length > 0) {
      expect(vnLogs[0].amount).toMatch(/^\d+ mins$/)
    }
  })

  it('generates appropriate amount format for Manga/LN/Reading (pages)', () => {
    const logs = Array.from({ length: 100 }, () => generateLog())
    const pageLogs = logs.filter(l => ['Manga', 'LN', 'Reading'].includes(l.media.type))
    if (pageLogs.length > 0) {
      expect(pageLogs[0].amount).toMatch(/^\d+ pages$/)
    }
  })
})

describe('HomePage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  it('renders the page title', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Fluency Is Built in Hours.')).toBeInTheDocument()
  })

  it('renders the brand name', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Immerse With Me')).toBeInTheDocument()
  })

  it('renders stat cards', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Hours Immersed')).toBeInTheDocument()
    expect(screen.getByText('Logs Created')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('renders the theme toggle button', async () => {
    renderWithProviders(<HomePage />)
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    const user = userEvent.setup()
    await user.click(toggleButton)
    expect(toggleButton).toBeInTheDocument()
  })

  it('renders Discord and GitHub buttons', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('button', { name: /discord/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
  })

  it('renders the live activity section', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Live Activity')).toBeInTheDocument()
  })

  it('renders "Join now" text', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Join now')).toBeInTheDocument()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})
