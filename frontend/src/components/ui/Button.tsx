import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** `lg` for forms and page CTAs, `md` for toolbar actions, `sm` for inline ones. */
  size?: Size
  loading?: boolean
  loadingText?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-paper hover:bg-brand-hover',
  secondary:
    'border border-paper/15 text-paper/90 hover:border-paper/35 hover:bg-paper/[0.04] hover:text-paper',
  /** Looks like `secondary` until hovered, so destructive actions don't shout. */
  danger:
    'border border-paper/15 text-paper/80 hover:border-signal/50 hover:bg-signal/[0.06] hover:text-signal',
  ghost: 'text-paper/60 hover:bg-paper/[0.06] hover:text-paper',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-13 px-6 text-[15px]',
}

export function Button({
  variant = 'primary',
  size = 'lg',
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
        'group/button relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-[-0.01em] transition-colors duration-200 select-none',
        'focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 focus-visible:outline-none',
        'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
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
