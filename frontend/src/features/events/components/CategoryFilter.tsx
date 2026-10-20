import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { EventCategory } from '../types'
import { categories, categoryOrder } from '../utils/categories'

export type CategorySelection = EventCategory | 'ALL'

interface CategoryFilterProps {
  value: CategorySelection
  onChange: (value: CategorySelection) => void
  counts: Record<CategorySelection, number>
}

export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  const options: { key: CategorySelection; label: string; icon: LucideIcon }[] = [
    { key: 'ALL', label: 'All events', icon: LayoutGrid },
    ...categoryOrder.map((key) => ({
      key,
      label: categories[key].label,
      icon: categories[key].icon,
    })),
  ]

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={cn(
              'relative inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:outline-none',
              active
                ? 'border-transparent text-ink-950'
                : 'border-paper/15 text-paper/70 hover:border-paper/35 hover:text-paper',
            )}
          >
            {/* One shared pill that slides to whichever chip is active. */}
            {active && (
              <motion.span
                layoutId="category-pill"
                className="absolute -inset-px rounded-full bg-paper"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative inline-flex items-center gap-2">
              <Icon className="size-4" aria-hidden />
              {label}
              <span
                className={cn(
                  'font-mono text-xs tabular-nums transition-colors duration-200',
                  active ? 'text-ink-950/55' : 'text-paper/35',
                )}
              >
                {counts[key]}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
