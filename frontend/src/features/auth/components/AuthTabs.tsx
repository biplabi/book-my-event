import { motion } from 'framer-motion'
import type { KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export type AuthMode = 'login' | 'register'

const tabs: { mode: AuthMode; label: string }[] = [
  { mode: 'login', label: 'Sign in' },
  { mode: 'register', label: 'Create account' },
]

interface AuthTabsProps {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
}

export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = mode === 'login' ? 'register' : 'login'
    onChange(next)
    document.getElementById(`auth-tab-${next}`)?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Authentication"
      onKeyDown={onKeyDown}
      className="relative grid grid-cols-2 border-b border-paper/10"
    >
      {tabs.map((tab) => {
        const active = tab.mode === mode
        return (
          <button
            key={tab.mode}
            id={`auth-tab-${tab.mode}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="auth-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.mode)}
            className={cn(
              'relative h-11 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none',
              active ? 'text-paper' : 'text-paper/40 hover:text-paper/75',
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-tab-pill"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-brand"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
