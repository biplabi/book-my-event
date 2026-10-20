import { useEffect, useState, type ReactNode } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'

interface ConfirmButtonProps {
  children: ReactNode
  /** Label shown after the first click; the second click runs `onConfirm`. */
  confirmLabel?: string
  onConfirm: () => Promise<unknown> | void
  tone?: 'default' | 'danger'
  /** Skip the confirmation step for low-risk actions. */
  instant?: boolean
}

/** Small table action. Destructive ones need two clicks; the armed state resets after 3s. */
export function ConfirmButton({
  children,
  confirmLabel = 'Confirm?',
  onConfirm,
  tone = 'default',
  instant = false,
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setArmed(false), 3000)
    return () => window.clearTimeout(t)
  }, [armed])

  const run = async () => {
    if (!instant && !armed) return setArmed(true)
    setArmed(false)
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      onBlur={() => setArmed(false)}
      disabled={busy}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-60',
        armed
          ? 'border-brand bg-brand text-paper'
          : tone === 'danger'
            ? 'border-paper/15 text-paper/70 hover:border-signal/50 hover:text-signal'
            : 'border-paper/15 text-paper/80 hover:border-paper/40 hover:text-paper',
      )}
    >
      {busy && <Spinner className="size-3.5" />}
      {armed ? confirmLabel : children}
    </button>
  )
}
