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
      className="relative grid grid-cols-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1"
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
              'relative h-10 rounded-xl text-sm font-medium transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-violet/60 focus-visible:outline-none',
              active ? 'text-white' : 'text-white/45 hover:text-white/75',
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-tab-pill"
                className="absolute inset-0 rounded-xl bg-white/[0.09] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_8px_24px_-12px_rgb(0_0_0/0.8)] ring-1 ring-white/10"
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
