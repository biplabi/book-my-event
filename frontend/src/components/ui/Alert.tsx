import { motion } from 'framer-motion'
import { CircleAlert, WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface AlertProps {
  children: ReactNode
  action?: ReactNode
  tone?: 'error' | 'offline'
  className?: string
}

export function Alert({ children, action, tone = 'error', className }: AlertProps) {
  const Icon = tone === 'offline' ? WifiOff : CircleAlert
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('overflow-hidden', className)}
    >
      <div
        className={cn(
          'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
          tone === 'offline'
            ? 'border-amber/25 bg-amber/[0.06] text-amber'
            : 'border-signal/30 bg-signal/[0.07] text-signal',
        )}
      >
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="flex-1 leading-relaxed text-paper/85">
          {children}
          {action && <div className="mt-1.5">{action}</div>}
        </div>
      </div>
    </motion.div>
  )
}
