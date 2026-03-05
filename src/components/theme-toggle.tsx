import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

const themes = ["system", "light", "dark"] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-8 w-8" />
  }

  const cycle = () => {
    const idx = themes.indexOf(theme as (typeof themes)[number])
    setTheme(themes[(idx + 1) % themes.length])
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor

  return (
    <button
      onClick={cycle}
      className="flex h-8 w-8 items-center justify-center rounded-md text-foreground/60 transition-colors hover:text-foreground hover:bg-accent"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
