import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cn } from '@/lib/cn'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string
  icon?: LucideIcon
  error?: string
  hint?: ReactNode
  /** Rendered inside the field on the right (e.g. a visibility toggle). */
  trailing?: ReactNode
  /** Keep the label raised even when empty (date inputs always show a mask). */
  floatLabel?: boolean
  ref?: Ref<HTMLInputElement>
}

const floated = 'top-[17px] text-[11px] font-medium tracking-wide text-paper/55'

export function TextField({
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  floatLabel = false,
  className,
  id,
  ref,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    if (error && scope.current) {
      void animate(scope.current, { x: [0, -7, 6, -4, 3, 0] }, { duration: 0.42, ease: 'easeOut' })
    }
  }, [error, animate, scope])

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={scope}
        className={cn(
          'group relative flex items-center rounded-xl border bg-paper/[0.025] transition-[border-color,background-color,box-shadow] duration-200',
          error
            ? 'border-signal/60 shadow-[0_0_0_3px_rgb(255_138_92/0.14)]'
            : 'border-paper/12 focus-within:border-brand/70 focus-within:bg-paper/[0.04] focus-within:ring-3 focus-within:ring-brand/15 hover:border-paper/25',
        )}
      >
        {Icon && (
          <Icon
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-4 size-[18px] transition-colors duration-300',
              error ? 'text-signal/80' : 'text-paper/35 group-focus-within:text-paper/85',
            )}
          />
        )}
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'peer h-14 w-full min-w-0 rounded-xl bg-transparent pt-5 pb-1.5 text-[15px] text-paper outline-none placeholder:text-transparent',
            Icon ? 'pl-11' : 'pl-4',
            trailing ? 'pr-12' : 'pr-4',
          )}
          {...inputProps}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute -translate-y-1/2 truncate text-paper/45 transition-all duration-200 ease-out',
            Icon ? 'left-11' : 'left-4',
            trailing ? 'right-12' : 'right-4',
            floatLabel
              ? floated
              : cn(
                  'top-1/2 text-[15px]',
                  'peer-focus:top-[17px] peer-focus:text-[11px] peer-focus:font-medium peer-focus:tracking-wide peer-focus:text-paper/55',
                  'peer-[:not(:placeholder-shown)]:top-[17px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:tracking-wide',
                ),
          )}
        >
          {label}
        </label>
        {trailing && <div className="absolute right-2 flex items-center">{trailing}</div>}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pt-1.5 pl-1 text-[13px] text-signal"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <div id={hintId} className="pt-1.5 pl-1 text-[13px] text-paper/45">
          {hint}
        </div>
      )}
    </div>
  )
}
