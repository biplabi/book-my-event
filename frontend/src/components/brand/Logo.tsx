import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden>
      <rect width="40" height="40" rx="10" fill="var(--color-brand)" />
      <path
        d="M10 14a2.5 2.5 0 0 1 2.5-2.5h15A2.5 2.5 0 0 1 30 14v3.2a2.8 2.8 0 0 0 0 5.6V26a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 10 26v-3.2a2.8 2.8 0 0 0 0-5.6z"
        fill="var(--color-paper)"
      />
      <path d="M24 13.5v13" stroke="var(--color-brand)" strokeWidth="1.4" strokeDasharray="2 2" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="size-8" />
      <span className="text-[18px] font-semibold tracking-[-0.03em] text-paper">
        book<span className="font-display text-[21px] font-normal italic">my</span>event
      </span>
    </span>
  )
}
