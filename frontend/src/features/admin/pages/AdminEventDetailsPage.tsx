import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { adminArtistPath, eventPath, paths } from '@/config/routes'
import { ArtistAvatar } from '@/features/events/components/ArtistAvatar'
import type { EventSummary, TicketType } from '@/features/events/types'
import { categories } from '@/features/events/utils/categories'
import { formatAddress, formatPrice } from '@/features/events/utils/format'
import { useResource } from '@/hooks/useResource'
import { ApiError } from '@/lib/api-client'
import { adminApi } from '../api/admin.api'
import { EmptyRow, TableShell, Th } from '../components/AdminPage'
import { EventStatusActions } from '../components/EventStatusActions'
import { EventStatusBadge } from '../components/StatusBadge'
import { describeAdminError } from '../utils/errors'

const ease = [0.22, 1, 0.36, 1] as const

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeOnly = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

const tierLabels: Record<TicketType['type'], string> = {
  GENERAL: 'General',
  PREMIUM: 'Premium',
  VIP: 'VIP',
}

export function AdminEventDetailsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const fetchEvent = useCallback(
    (token: string, signal: AbortSignal) => adminApi.getEvent(token, eventId, signal),
    [eventId],
  )
  const event = useResource(fetchEvent)

  const notFound =
    Number.isNaN(eventId) ||
    (event.status === 'error' && event.error instanceof ApiError && event.error.status === 404)

  return (
    <>
      <Link
        to={paths.adminEvents}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-paper/50 transition hover:text-paper"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All events
      </Link>

      {notFound ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-paper/15 px-6 py-24 text-center">
          <p className="font-display text-4xl text-paper">Event not found</p>
          <p className="mt-2 text-sm text-paper/50">It may have been removed.</p>
        </div>
      ) : event.status === 'loading' ? (
        <div className="grid place-items-center py-24 text-paper/40" role="status">
          <Spinner className="size-6" />
        </div>
      ) : event.status === 'error' ? (
        <Alert>{describeAdminError(event.error)}</Alert>
      ) : (
        <EventOverview event={event.data} onUpdated={(updated) => event.setData(() => updated)} />
      )}
    </>
  )
}

function EventOverview({
  event,
  onUpdated,
}: {
  event: EventSummary
  onUpdated: (event: EventSummary) => void
}) {
  const category = categories[event.eventCategory]
  const CategoryIcon = category?.icon
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)
  const valid = !Number.isNaN(start.getTime())

  const totalSeats = event.ticketTypes.reduce((s, t) => s + t.seatCount, 0)
  const totalLeft = event.ticketTypes.reduce((s, t) => s + t.availableSeatCount, 0)

  return (
    <>
      <title>{`${event.name} · Admin · BookMyEvent`}</title>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-1.5 label-mono text-paper/45">
              {CategoryIcon && <CategoryIcon className="size-3.5" aria-hidden />}
              {category?.name ?? event.eventCategory}
            </p>
            <EventStatusBadge status={event.status} />
          </div>
          <h1 className="mt-2 font-display text-[44px] leading-[0.95] text-paper sm:text-[56px]">
            {event.name}
          </h1>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <EventStatusActions event={event} onUpdated={onUpdated} />
          <Link
            to={eventPath(event.id)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-paper/60 transition-colors hover:bg-paper/[0.06] hover:text-paper"
          >
            Public page
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </motion.section>

      {/* Key facts */}
      <dl className="mt-8 grid overflow-hidden rounded-2xl border border-paper/10 sm:grid-cols-2">
        <Fact icon={CalendarDays} label="When">
          {valid ? (
            <>
              {longDate.format(start)}
              <span className="mt-0.5 block text-sm text-paper/50">
                {timeOnly.format(start)}
                {!Number.isNaN(end.getTime()) && ` – ${timeOnly.format(end)}`}
              </span>
            </>
          ) : (
            'Not set'
          )}
        </Fact>
        <Fact icon={MapPin} label="Venue">
          {event.venue ? (
            <>
              {event.venue.name}
              <span className="mt-0.5 block text-sm text-paper/50">
                {event.venue.address && `${formatAddress(event.venue.address)} · `}
                {event.venue.seatCapacity.toLocaleString()} seats
              </span>
            </>
          ) : (
            'Not set'
          )}
        </Fact>
      </dl>

      {/* Tickets */}
      <Section title="Tickets">
        <TableShell>
          <thead>
            <tr>
              <Th>Tier</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Seats</Th>
              <Th className="text-right">Sold</Th>
              <Th className="text-right">Left</Th>
            </tr>
          </thead>
          <tbody>
            {event.ticketTypes.length === 0 && (
              <EmptyRow colSpan={5}>No ticket tiers on this event.</EmptyRow>
            )}
            {event.ticketTypes.map((tier) => (
              <tr key={tier.type} className="border-b border-paper/[0.06]">
                <td className="px-4 py-3.5 font-medium text-paper">{tierLabels[tier.type]}</td>
                <td className="px-4 py-3.5 text-right text-paper/80 tabular-nums">
                  {tier.price === 0 ? 'Free' : formatPrice(tier.price)}
                </td>
                <td className="px-4 py-3.5 text-right text-paper/70 tabular-nums">
                  {tier.seatCount.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right text-paper/70 tabular-nums">
                  {(tier.seatCount - tier.availableSeatCount).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right text-paper/70 tabular-nums">
                  {tier.availableSeatCount.toLocaleString()}
                </td>
              </tr>
            ))}
            {event.ticketTypes.length > 0 && (
              <tr className="font-medium text-paper">
                <td className="px-4 py-3.5">Total</td>
                <td />
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {totalSeats.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {(totalSeats - totalLeft).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {totalLeft.toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </TableShell>
      </Section>

      {/* Lineup */}
      <Section title="Lineup">
        {event.artists.length === 0 ? (
          <p className="text-sm text-paper/45">No artists on this event.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {event.artists.map((artist) => (
              <Link
                key={artist.id}
                to={adminArtistPath(artist.id)}
                className="group flex items-center gap-3 rounded-2xl border border-paper/10 bg-ink-900 p-3 transition-colors hover:border-paper/25 hover:bg-ink-800"
              >
                <ArtistAvatar artist={artist} className="size-11 text-base" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-paper">{artist.stageName}</p>
                  <p className="truncate label-mono text-paper/45">{artist.genre}</p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-paper/30 transition-colors group-hover:text-brand"
                />
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* About */}
      <Section title="About">
        <p className="max-w-3xl text-[15px] leading-relaxed whitespace-pre-line text-paper/70">
          {event.description || 'No description yet.'}
        </p>
      </Section>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-4 font-display text-[28px] leading-none text-paper">
        {title}
        <span aria-hidden className="h-px flex-1 bg-paper/10" />
      </h2>
      {children}
    </section>
  )
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="border-paper/10 bg-ink-900 p-4 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0">
      <dt className="flex items-center gap-1.5 label-mono text-paper/45">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-2 text-[15px] text-paper">{children}</dd>
    </div>
  )
}
