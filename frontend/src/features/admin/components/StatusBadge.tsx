import { cn } from '@/lib/cn'
import type { BookingStatus, EventStatus } from '../types'

type Tone = 'solid' | 'outline' | 'dashed' | 'warn' | 'bad' | 'muted'

const tones: Record<Tone, string> = {
  solid: 'border-paper bg-paper text-ink-950',
  outline: 'border-paper/25 text-paper/80',
  dashed: 'border-dashed border-paper/30 text-paper/60',
  warn: 'border-amber/35 text-amber',
  bad: 'border-signal/40 text-signal',
  muted: 'border-paper/10 text-paper/40',
}

const eventStatus: Record<EventStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: 'Draft', tone: 'dashed' },
  PUBLISHED: { label: 'Published', tone: 'solid' },
  CANCELLED: { label: 'Cancelled', tone: 'bad' },
  COMPLETED: { label: 'Completed', tone: 'muted' },
}

const bookingStatus: Record<BookingStatus, { label: string; tone: Tone }> = {
  CREATED: { label: 'Created', tone: 'outline' },
  PAYMENT_PENDING: { label: 'Pending', tone: 'warn' },
  PAYMENT_SUCCESS: { label: 'Paid', tone: 'solid' },
  PAYMENT_FAILED: { label: 'Failed', tone: 'bad' },
  CANCELLED: { label: 'Cancelled', tone: 'muted' },
  REFUNDED: { label: 'Refunded', tone: 'muted' },
}

function Badge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border px-2.5 font-mono text-[10.5px] tracking-[0.1em] whitespace-nowrap uppercase',
        tones[tone],
      )}
    >
      {label}
    </span>
  )
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <Badge {...(eventStatus[status] ?? { label: status, tone: 'outline' })} />
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge {...(bookingStatus[status] ?? { label: status, tone: 'outline' })} />
}

export function RoleBadge({ role }: { role: string }) {
  const admin = role === 'ROLE_ADMIN'
  return <Badge label={admin ? 'Admin' : 'User'} tone={admin ? 'solid' : 'outline'} />
}
