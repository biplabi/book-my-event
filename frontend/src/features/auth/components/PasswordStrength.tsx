import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { passwordRules } from '../schemas/auth.schemas'

const levels = [
  { label: 'Too weak', color: 'bg-signal' },
  { label: 'Weak', color: 'bg-signal' },
  { label: 'Fair', color: 'bg-amber' },
  { label: 'Good', color: 'bg-amber' },
  { label: 'Strong', color: 'bg-brand/70' },
  { label: 'Excellent', color: 'bg-brand' },
] as const

export function PasswordStrength({ password }: { password: string }) {
  const passed = passwordRules.map((rule) => rule.test(password))
  const score = passed.filter(Boolean).length
  const level = levels[score]!

  return (
    <div className="pt-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {passwordRules.map((rule, i) => (
            <div key={rule.id} className="h-1 flex-1 overflow-hidden rounded-full bg-paper/[0.08]">
              <motion.div
                className={cn('h-full rounded-full', level.color)}
                initial={false}
                animate={{ width: i < score ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.03 }}
              />
            </div>
          ))}
        </div>
        <span className="w-16 text-right text-xs font-medium text-paper/60">
          {password ? level.label : ''}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {passwordRules.map((rule, i) => (
          <li
            key={rule.id}
            className={cn(
              'flex items-center gap-2 text-[12.5px] transition-colors duration-300',
              passed[i] ? 'text-paper/80' : 'text-paper/40',
            )}
          >
            <span
              className={cn(
                'grid size-4 shrink-0 place-items-center rounded-full border transition-all duration-300',
                passed[i] ? 'border-brand bg-brand text-paper' : 'border-paper/20',
              )}
            >
              <motion.span
                initial={false}
                animate={{ scale: passed[i] ? 1 : 0, opacity: passed[i] ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="size-2.5" strokeWidth={4} aria-hidden />
              </motion.span>
            </span>
            {rule.label}
            <span className="sr-only">{passed[i] ? '(met)' : '(not met)'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
