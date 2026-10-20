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
  primary: 'bg-brand text-paper hover:bg-brand-hover',
  secondary:
    'border border-paper/15 text-paper/90 hover:border-paper/35 hover:bg-paper/[0.04] hover:text-paper',
  ghost: 'text-paper/60 hover:bg-paper/[0.06] hover:text-paper',
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
        'group/button relative inline-flex h-13 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 select-none',
        'focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 focus-visible:outline-none',
        'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-[18px]" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
