import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Users, Clock, Play, FileText, Headphones, Monitor } from 'lucide-react'

// Types for our dummy data
type MediaType = 'Anime' | 'Manga' | 'LN' | 'VN' | 'Listening' | 'Reading'

interface LogEntry {
  id: string
  member: {
    name: string
    initials: string
    color: string
  }
  media: {
    title: string
    type: MediaType
  }
  amount: string
  totalMonth: string
  timestamp: number
}

// Dummy data generators
const MEMBER_NAMES = ['Sarah K.', 'Mike R.', 'Jessica T.', 'David L.', 'Alex M.', 'Emily W.', 'Chris B.', 'Hana S.']
const MEDIA_TITLES = [
  'Re:Zero Starting Life in Another World',
  'Frieren: Beyond Journey\'s End',
  'Mushoku Tensei: Jobless Reincarnation',
  'The Apothecary Diaries',
  'Ascendance of a Bookworm',
  'Oshi no Ko',
  'Spy x Family',
  'Chainsaw Man',
  'Vinland Saga',
  'Monster',
  '86 - Eighty Six',
  'Kaguya-sama: Love is War'
]
const MEDIA_TYPES: MediaType[] = ['Anime', 'Manga', 'LN', 'VN', 'Listening', 'Reading']
const COLORS = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
]

const generateLog = (): LogEntry => {
  const name = MEMBER_NAMES[Math.floor(Math.random() * MEMBER_NAMES.length)]
  const initials = name.split(' ').map(n => n[0]).join('')
  const type = MEDIA_TYPES[Math.floor(Math.random() * MEDIA_TYPES.length)]
  
  let amount = ''
  if (['Anime', 'Listening'].includes(type)) amount = `${Math.floor(Math.random() * 3) + 1} eps`
  else if (type === 'VN') amount = `${Math.floor(Math.random() * 60) + 15} mins`
  else amount = `${Math.floor(Math.random() * 50) + 10} pages`

  return {
    id: Math.random().toString(36).substring(7),
    member: {
      name,
      initials,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    },
    media: {
      title: MEDIA_TITLES[Math.floor(Math.random() * MEDIA_TITLES.length)],
      type
    },
    amount,
    totalMonth: `${Math.floor(Math.random() * 50) + 10}h`,
    timestamp: Date.now()
  }
}

const getTypeColor = (type: MediaType) => {
  switch (type) {
    case 'Anime': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Manga': return 'bg-green-50 text-green-700 border-green-200'
    case 'LN': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'VN': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Listening': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-stone-100 text-stone-600 border-stone-200'
  }
}

const getTypeIcon = (type: MediaType) => {
  switch (type) {
    case 'Anime': return Play
    case 'Manga': 
    case 'LN': return BookOpen
    case 'VN': return Monitor
    case 'Listening': return Headphones
    default: return FileText
  }
}

export function HomePage() {
  const [totalLogs, setTotalLogs] = useState(145203)
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])

  // Initial population
  useEffect(() => {
    const initialLogs = Array.from({ length: 5 }).map(generateLog)
    setRecentLogs(initialLogs)
  }, [])

  // Live feed simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance to add a log
        const newLog = generateLog()
        setTotalLogs(prev => prev + 1)
        setRecentLogs(prev => [newLog, ...prev].slice(0, 6))
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: 'Hours Immersed',
      value: '28,450',
      sub: 'This Month',
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Logs Created',
      value: '1,204',
      sub: 'This Month',
      icon: BookOpen,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Active Members',
      value: '842',
      sub: 'This Month',
      icon: Users,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ]

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  } as const

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF7] text-[#1A1A1A] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&display=swap');
        .font-serif-jp { font-family: 'Zen Old Mincho', serif; }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle paper texture/noise */}
        <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        {/* Very subtle gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/80 to-transparent" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-black/5 bg-[#FAFAF7]/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#1F2A44]" />
          <span className="font-serif-jp text-lg font-bold tracking-tight text-[#1F2A44]">Immerse With Me</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="text-[#1F2A44]/60 transition-colors hover:text-[#1F2A44]" aria-label="Discord">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
              </svg>
            </button>
            <button className="text-[#1F2A44]/60 transition-colors hover:text-[#1F2A44]" aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <g transform="translate(4.8, 4.8) scale(0.6)" strokeWidth="3.33">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </g>
              </svg>
            </button>
          </div>
          <div className="text-sm font-medium text-stone-500">
            Join now
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 py-12"
        variants={containerVars}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVars} className="mb-16 text-center">
          <h1 className="font-serif-jp text-5xl font-bold tracking-tight text-[#1F2A44] sm:text-7xl lg:text-8xl">
            Japanese Fluency Is Built in Hours.
          </h1>
          <p className="mt-8 max-w-lg mx-auto text-lg text-stone-600 leading-relaxed">
            <AnimatedCounter value={23482 + (totalLogs - 145203)} />
            {' '}hours tracked across reading, listening, and watching.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVars} className="grid w-full max-w-5xl gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className={cn("relative overflow-hidden border border-black/5 bg-white shadow-sm transition-all hover:shadow-md", stat.border)}>
                <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", stat.bg)} />
                <CardContent className="relative p-8 text-center">
                  <div className={cn("mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="font-serif-jp text-4xl font-bold text-[#1A1A1A] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium uppercase tracking-wide text-stone-500">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xs text-stone-400">
                    {stat.sub}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Log Feed */}
        <motion.div 
          variants={itemVars} 
          className="mt-16 w-full max-w-2xl"
        >
          <div className="mb-6 flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-stone-500">Live Activity</span>
             </div>
          </div>
          
          <div className="relative space-y-3">
            {/* Gradient mask for fading out at bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF7] to-transparent z-20" />
            
            <AnimatePresence initial={false} mode='popLayout'>
              {recentLogs.map((log) => {
                 const TypeIcon = getTypeIcon(log.media.type)
                 return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <div className="group flex items-center gap-4 rounded-xl border border-black/5 bg-white p-3 shadow-sm transition-all hover:border-black/10 hover:shadow-md">
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 border border-black/5">
                        <AvatarFallback className={cn("text-xs font-bold", log.member.color)}>
                          {log.member.initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-[#1A1A1A]">
                            {log.member.name}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {log.totalMonth} this month
                          </span>
                        </div>
                        <div className="flex items-center gap-2 truncate text-xs text-stone-500">
                          <span className="truncate font-medium">{log.media.title}</span>
                          <Badge variant="outline" className={cn("h-4 px-1 py-0 text-[9px] uppercase tracking-wider", getTypeColor(log.media.type))}>
                            <TypeIcon className="mr-1 h-2 w-2" />
                            {log.media.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <div className="font-serif-jp text-lg font-bold text-[#1F2A44] tabular-nums">
                          {log.amount}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}

function AnimatedCounter({ value }: { value: number }) {
  const valueStr = value.toLocaleString()
  const chars = valueStr.split('')

  return (
    <span className="inline-flex items-baseline overflow-hidden tabular-nums font-bold text-[#1F2A44]">
      {chars.map((char, index) => (
        <Digit key={index} char={char} />
      ))}
    </span>
  )
}

function Digit({ char }: { char: string }) {
  // Non-digit characters (commas) shouldn't animate
  if (/[^0-9]/.test(char)) {
    return <span>{char}</span>
  }

  return (
    <div className="relative inline-grid place-items-center overflow-hidden">
      <span className="invisible col-start-1 row-start-1">{char}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="col-start-1 row-start-1"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
