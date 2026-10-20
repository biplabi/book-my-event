import { useId, type Ref, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  ref?: Ref<HTMLTextAreaElement>
}

/** Multi-line counterpart to TextField, with the label always raised. */
export function TextAreaField({ label, error, className, id, ref, ...props }: TextAreaFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative rounded-xl border bg-paper/[0.025] transition-[border-color,background-color,box-shadow] duration-200',
          error
            ? 'border-signal/60'
            : 'border-paper/12 focus-within:border-brand/70 focus-within:bg-paper/[0.04] focus-within:ring-3 focus-within:ring-brand/15 hover:border-paper/25',
        )}
      >
        <label
          htmlFor={fieldId}
          className="pointer-events-none absolute top-2.5 left-4 text-[11px] font-medium tracking-wide text-paper/55"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          rows={4}
          className="block w-full resize-y rounded-xl bg-transparent px-4 pt-7 pb-3 text-[15px] leading-relaxed text-paper outline-none"
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="pt-1.5 pl-1 text-[13px] text-signal">
          {error}
        </p>
      )}
    </div>
  )
}
