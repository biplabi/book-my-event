import { useId } from 'react'
import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId()
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4d8d" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M10 14a2.5 2.5 0 0 1 2.5-2.5h15A2.5 2.5 0 0 1 30 14v3.2a2.8 2.8 0 0 0 0 5.6V26a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 10 26v-3.2a2.8 2.8 0 0 0 0-5.6z"
        fill="#0d0b14"
        fillOpacity="0.88"
      />
      <path
        d="M24 13v14"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeDasharray="2 2"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-[-0.03em] text-white">
        Book<span className="font-display text-[22px] font-normal text-white/80 italic">my</span>
        Event
      </span>
    </span>
  )
}
