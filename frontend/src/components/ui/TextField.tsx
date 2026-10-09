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

const floated = 'top-[17px] text-[11px] font-medium tracking-wide text-white/55'

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
          'group relative flex items-center rounded-2xl border bg-white/[0.03] transition-[border-color,background-color,box-shadow] duration-300',
          error
            ? 'border-rose/60 shadow-[0_0_0_4px_rgb(255_77_141/0.12)]'
            : 'border-white/10 focus-within:border-violet/70 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_0_4px_rgb(139_92_246/0.16)] hover:border-white/20',
        )}
      >
        {Icon && (
          <Icon
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-4 size-[18px] transition-colors duration-300',
              error ? 'text-rose/80' : 'text-white/35 group-focus-within:text-white/85',
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
            'peer h-14 w-full min-w-0 rounded-2xl bg-transparent pt-5 pb-1.5 text-[15px] text-white outline-none placeholder:text-transparent',
            Icon ? 'pl-11' : 'pl-4',
            trailing ? 'pr-12' : 'pr-4',
          )}
          {...inputProps}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute -translate-y-1/2 truncate text-[15px] text-white/45 transition-all duration-200 ease-out',
            Icon ? 'left-11' : 'left-4',
            trailing ? 'right-12' : 'right-4',
            floatLabel
              ? floated
              : cn(
                  'top-1/2',
                  'peer-focus:top-[17px] peer-focus:text-[11px] peer-focus:font-medium peer-focus:tracking-wide peer-focus:text-white/55',
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
            className="overflow-hidden pt-1.5 pl-1 text-[13px] text-rose"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <div id={hintId} className="pt-1.5 pl-1 text-[13px] text-white/45">
          {hint}
        </div>
      )}
    </div>
  )
}
