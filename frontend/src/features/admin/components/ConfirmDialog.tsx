import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Leave out (with `onConfirm`) for a notice that only has a close button. */
  confirmLabel?: string
  onConfirm?: () => Promise<unknown> | void
}

/**
 * Centered dialog for actions that can't be undone. Cancel gets focus first, so pressing Enter
 * never confirms by accident. Escape and backdrop clicks close it, except while confirming.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const titleId = useId()
  const bodyId = useId()
  const close = () => !busy && onClose()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, busy, onClose])

  const confirm = async () => {
    if (!onConfirm) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            className="relative w-full max-w-md rounded-2xl border border-paper/10 bg-ink-900 p-6"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <h2 id={titleId} className="font-display text-3xl leading-none text-paper">
              {title}
            </h2>
            <div id={bodyId} className="mt-3 text-sm leading-relaxed text-paper/65">
              {children}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={close} disabled={busy} autoFocus size="md">
                {onConfirm ? 'Cancel' : 'OK'}
              </Button>
              {onConfirm && (
                <Button size="md" onClick={confirm} loading={busy}>
                  {confirmLabel ?? 'Confirm'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
