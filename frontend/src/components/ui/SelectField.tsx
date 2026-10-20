import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
  /** Secondary line under the label, e.g. a venue's city and capacity. */
  hint?: string
  icon?: LucideIcon
}

export interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  /** Shown in the trigger while nothing is chosen. */
  placeholder?: string
  error?: string
  name?: string
  disabled?: boolean
  className?: string
  /** Forwarded to the trigger so react-hook-form can focus it on error. */
  ref?: Ref<HTMLButtonElement>
}

const MENU_GAP = 6
const MENU_MAX_HEIGHT = 288

/**
 * Themed replacement for a native select: a button that opens a listbox.
 * The menu is portalled and fixed-positioned so parents with overflow-hidden can't clip it,
 * and it flips above the trigger when there isn't room below.
 */
export function SelectField({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Select…',
  error,
  name,
  disabled,
  className,
  ref,
}: SelectFieldProps) {
  const id = useId()
  const listId = `${id}-list`
  const errorId = `${id}-error`
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [rect, setRect] = useState<{ top: number; left: number; width: number; above: boolean }>()

  const selected = options.find((o) => o.value === value)
  const SelectedIcon = selected?.icon

  const setTriggerRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const place = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect()
    if (!r) return
    const menuHeight = Math.min(MENU_MAX_HEIGHT, options.length * 52 + 12)
    const above = r.bottom + MENU_GAP + menuHeight > window.innerHeight && r.top > menuHeight
    setRect({
      top: above ? r.top - MENU_GAP - menuHeight : r.bottom + MENU_GAP,
      left: r.left,
      width: r.width,
      above,
    })
  }, [options.length])

  const openMenu = () => {
    if (disabled) return
    const index = options.findIndex((o) => o.value === value)
    setActive(index >= 0 ? index : 0)
    place()
    setOpen(true)
  }

  const close = useCallback(
    (refocus = true) => {
      setOpen(false)
      onBlur?.()
      if (refocus) triggerRef.current?.focus()
    },
    [onBlur],
  )

  const choose = (index: number) => {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    close()
  }

  // Keep the menu glued to the trigger while open; close on outside click.
  useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) close(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, place, close])

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openMenu()
    }
  }

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => Math.min(i + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Tab':
        close(false)
        break
      default:
        // Type-ahead: jump to the next option starting with the typed letter.
        if (e.key.length === 1) {
          const key = e.key.toLowerCase()
          const order = [...options.slice(active + 1), ...options.slice(0, active + 1)]
          const match = order.find((o) => o.label.toLowerCase().startsWith(key))
          if (match) setActive(options.indexOf(match))
        }
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <button
        ref={setTriggerRef}
        type="button"
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'group relative flex h-14 w-full items-center gap-2.5 rounded-xl border bg-paper/[0.025] pt-5 pr-10 pb-1.5 pl-4 text-left text-[15px] transition-[border-color,background-color,box-shadow] duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-signal/60'
            : open
              ? 'border-brand/70 bg-paper/[0.04] ring-3 ring-brand/15'
              : 'border-paper/12 hover:border-paper/25 focus-visible:border-brand/70 focus-visible:ring-3 focus-visible:ring-brand/15',
        )}
      >
        <span className="pointer-events-none absolute top-[17px] left-4 -translate-y-1/2 text-[11px] font-medium tracking-wide text-paper/55">
          {label}
        </span>
        {SelectedIcon && <SelectedIcon className="size-4 shrink-0 text-paper/60" aria-hidden />}
        <span className={cn('truncate', selected ? 'text-paper' : 'text-paper/40')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-paper/40 transition-transform duration-200',
            open && 'rotate-180 text-paper/70',
          )}
        />
      </button>

      {error && (
        <p id={errorId} role="alert" className="pt-1.5 pl-1 text-[13px] text-signal">
          {error}
        </p>
      )}

      {createPortal(
        <AnimatePresence>
          {open && rect && (
            <motion.ul
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-label={label}
              aria-activedescendant={`${id}-opt-${active}`}
              onKeyDown={onListKeyDown}
              initial={{ opacity: 0, y: rect.above ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: rect.above ? 4 : -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                maxHeight: MENU_MAX_HEIGHT,
                transformOrigin: rect.above ? 'bottom' : 'top',
              }}
              className="fixed z-[60] overflow-y-auto rounded-xl border border-paper/12 bg-ink-800 p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] outline-none"
            >
              {options.map((option, i) => {
                const isSelected = option.value === value
                const Icon = option.icon
                return (
                  <li
                    key={option.value}
                    id={`${id}-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    onPointerMove={() => setActive(i)}
                    onClick={() => choose(i)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-100',
                      i === active ? 'bg-paper/[0.07]' : '',
                    )}
                  >
                    {Icon && (
                      <span
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-lg border',
                          isSelected
                            ? 'border-brand/40 text-brand'
                            : 'border-paper/10 text-paper/60',
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-sm',
                          isSelected ? 'text-paper' : 'text-paper/80',
                        )}
                      >
                        {option.label}
                      </span>
                      {option.hint && (
                        <span className="mt-0.5 block truncate font-mono text-[11px] text-paper/40">
                          {option.hint}
                        </span>
                      )}
                    </span>
                    {isSelected && <Check className="size-4 shrink-0 text-brand" aria-hidden />}
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
