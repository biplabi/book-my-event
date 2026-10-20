import { AnimatePresence, motion } from 'framer-motion'
import { ArrowBigUpDash, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { TextField, type TextFieldProps } from './TextField'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing' | 'icon'>

export function PasswordField({ onKeyDown, onKeyUp, onBlur, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const trackCaps = (e: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(e.getModifierState('CapsLock'))

  return (
    <div className="relative">
      <TextField
        {...props}
        type={visible ? 'text' : 'password'}
        icon={LockKeyhole}
        onKeyDown={(e) => {
          trackCaps(e)
          onKeyDown?.(e)
        }}
        onKeyUp={(e) => {
          trackCaps(e)
          onKeyUp?.(e)
        }}
        onBlur={(e) => {
          setCapsLock(false)
          onBlur?.(e)
        }}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="grid size-10 place-items-center rounded-lg text-paper/45 transition-colors hover:bg-paper/[0.06] hover:text-paper focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={visible ? 'hide' : 'show'}
                initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
                transition={{ duration: 0.15 }}
              >
                {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </motion.span>
            </AnimatePresence>
          </button>
        }
      />
      <AnimatePresence>
        {capsLock && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="pointer-events-none absolute -top-3 right-3 inline-flex items-center gap-1 rounded-full border border-amber/30 bg-ink-900 px-2 py-0.5 text-[11px] font-medium text-amber"
            role="status"
          >
            <ArrowBigUpDash className="size-3.5" /> Caps Lock is on
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
