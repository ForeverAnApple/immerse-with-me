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
    <div className="relative min-h-screen w-full bg-[#FAFAF7] text-[#1A1A1A] font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:bg-[#0F0F0F] dark:text-white dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
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
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/80 to-transparent dark:from-[#0F0F0F]/80" />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 py-12"
        variants={containerVars}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVars} className="mb-16 text-center">
          <h1 className="font-serif-jp text-5xl font-bold tracking-tight text-[#1F2A44] sm:text-7xl lg:text-8xl dark:text-white">
            Fluency Is Built in Hours.
          </h1>
          <p className="mt-8 max-w-lg mx-auto text-lg text-stone-600 leading-relaxed dark:text-stone-400">
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
              <Card className={cn("relative overflow-hidden border border-black/5 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/5", stat.border)}>
                <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", stat.bg)} />
                <CardContent className="relative p-8 text-center">
                  <div className={cn("mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="font-serif-jp text-4xl font-bold text-[#1A1A1A] tabular-nums dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xs text-stone-400 dark:text-stone-500">
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
                <span className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Live Activity</span>
              </div>
           </div>
          
          <div className="relative space-y-3">
            {/* Gradient mask for fading out at bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF7] to-transparent z-20 dark:from-[#0F0F0F]" />
            
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
                    <div className="group flex items-center gap-4 rounded-xl border border-black/5 bg-white p-3 shadow-sm transition-all hover:border-black/10 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 border border-black/5 dark:border-white/10">
                        <AvatarFallback className={cn("text-xs font-bold", log.member.color)}>
                          {log.member.initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-[#1A1A1A] dark:text-white">
                            {log.member.name}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500">
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
                        <div className="font-serif-jp text-lg font-bold text-[#1F2A44] tabular-nums dark:text-white">
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
    <span className="inline-flex items-baseline overflow-hidden tabular-nums font-bold text-[#1F2A44] dark:text-white">
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
