import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  loadingText?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-[0_12px_40px_-12px_rgb(255_77_141/0.7)] hover:shadow-[0_16px_50px_-10px_rgb(139_92_246/0.75)] hover:brightness-110',
  secondary:
    'border border-white/10 bg-white/[0.04] text-white/90 hover:border-white/20 hover:bg-white/[0.08]',
  ghost: 'text-white/60 hover:bg-white/[0.06] hover:text-white',
}

export function Button({
  variant = 'primary',
  loading = false,
  loadingText,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'group/button relative inline-flex h-13 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-300 ease-out select-none',
        'focus-visible:ring-2 focus-visible:ring-violet/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 focus-visible:outline-none',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        variants[variant],
        className,
      )}
      {...props}
    >
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
      <span className="relative inline-flex items-center gap-2">
        {loading ? (
          <>
            <Spinner className="size-[18px]" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}
