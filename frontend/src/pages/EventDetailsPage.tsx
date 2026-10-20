import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock3, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Backdrop } from '@/components/layout/Backdrop'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { paths } from '@/config/routes'
import { EventStatusBadge } from '@/features/admin/components/StatusBadge'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { eventsApi } from '@/features/events/api/events.api'
import { ArtistAvatar } from '@/features/events/components/ArtistAvatar'
import type { Artist, EventSummary, TicketType } from '@/features/events/types'
import { categories } from '@/features/events/utils/categories'
import { formatPrice, lowestPrice, seatsLeft } from '@/features/events/utils/format'
import { useResource } from '@/hooks/useResource'
import { ApiError } from '@/lib/api-client'
import { cn } from '@/lib/cn'

const ease = [0.22, 1, 0.36, 1] as const

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeOnly = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const dayNumber = new Intl.DateTimeFormat(undefined, { day: '2-digit' })
const monthShort = new Intl.DateTimeFormat(undefined, { month: 'short' })

const tierLabels: Record<TicketType['type'], string> = {
  GENERAL: 'General',
  PREMIUM: 'Premium',
  VIP: 'VIP',
}

function duration(start: Date, end: Date) {
  const minutes = Math.round((end.getTime() - start.getTime()) / 60000)
  if (!Number.isFinite(minutes) || minutes <= 0) return null
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  return [days && `${days}d`, hours && `${hours}h`, mins && `${mins}m`].filter(Boolean).join(' ')
}

export function EventDetailsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const { user } = useAuth()
  const fetchEvent = useCallback(
    (token: string, signal: AbortSignal) => eventsApi.get(token, eventId, signal),
    [eventId],
  )
  const event = useResource(fetchEvent)

  // Block body on purpose: scrollTo can return a Promise, and an effect must only return a cleanup.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [eventId])

  const isAdmin = user?.role === 'ROLE_ADMIN'
  // Customers only ever see published events; admins can preview drafts here too.
  const hidden = event.status === 'success' && event.data.status !== 'PUBLISHED' && !isAdmin
  const notFound =
    Number.isNaN(eventId) ||
    hidden ||
    (event.status === 'error' && event.error instanceof ApiError && event.error.status === 404)

  return (
    <div className="relative min-h-dvh">
      <Backdrop />
      <title>
        {event.status === 'success' && !hidden
          ? `${event.data.name} · BookMyEvent`
          : 'Event · BookMyEvent'}
      </title>
      <SiteHeader />

      <main className="mx-auto max-w-screen-2xl px-4 pt-6 pb-20 sm:px-8 lg:px-12 xl:px-16">
        <Link
          to={paths.home}
          className="inline-flex items-center gap-1.5 text-sm text-paper/50 transition hover:text-paper"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All events
        </Link>

        <div className="mt-6">
          {notFound ? (
            <NotAvailable />
          ) : event.status === 'loading' ? (
            <div className="grid place-items-center py-32 text-paper/40" role="status">
              <Spinner className="size-6" />
            </div>
          ) : event.status === 'error' ? (
            <Alert>We couldn&apos;t load this event. Please try again.</Alert>
          ) : (
            <EventDetails event={event.data} showStatus={isAdmin} />
          )}
        </div>
      </main>
    </div>
  )
}

function EventDetails({ event, showStatus }: { event: EventSummary; showStatus: boolean }) {
  const category = categories[event.eventCategory]
  const CategoryIcon = category.icon
  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)
  const valid = !Number.isNaN(start.getTime())
  const length = valid ? duration(start, end) : null
  const lineup = event.artists.map((a) => a.stageName).join(', ')

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12 xl:grid-cols-[1fr_400px]">
      <div className="min-w-0">
        {/* Hero */}
        <motion.div {...rise()} className="flex items-center gap-3 label-mono text-paper/55">
          <span className="inline-flex items-center gap-1.5">
            <CategoryIcon className="size-3.5" aria-hidden />
            {category.name}
          </span>
          {showStatus && event.status !== 'PUBLISHED' && <EventStatusBadge status={event.status} />}
        </motion.div>

        <div className="mt-5 flex items-start gap-5 sm:gap-7">
          {valid && (
            <motion.div
              {...rise(0.05)}
              className="hidden shrink-0 border-r border-paper/10 pr-5 text-center sm:block sm:pr-7"
            >
              <p className="font-display text-[88px] leading-[0.8] text-brand">
                {dayNumber.format(start)}
              </p>
              <p className="mt-2 label-mono text-paper/55">{monthShort.format(start)}</p>
            </motion.div>
          )}
          <div className="min-w-0">
            <motion.h1
              {...rise(0.1)}
              className="font-display text-[44px] leading-[0.95] tracking-[-0.02em] text-paper sm:text-[64px]"
            >
              {event.name}
            </motion.h1>
            {lineup && (
              <motion.p {...rise(0.15)} className="mt-3 text-base text-paper/55">
                with <span className="text-paper/85">{lineup}</span>
              </motion.p>
            )}
          </div>
        </div>

        {/* Key facts */}
        <motion.dl
          {...rise(0.2)}
          className="mt-10 grid overflow-hidden rounded-2xl border border-paper/10 sm:grid-cols-3"
        >
          <Fact icon={CalendarDays} label="Date">
            {valid ? longDate.format(start) : 'To be announced'}
          </Fact>
          <Fact icon={Clock3} label="Time">
            {valid ? (
              <>
                {timeOnly.format(start)}
                {!Number.isNaN(end.getTime()) && ` – ${timeOnly.format(end)}`}
                {length && <span className="ml-2 font-mono text-xs text-paper/40">{length}</span>}
              </>
            ) : (
              'To be announced'
            )}
          </Fact>
          <Fact icon={MapPin} label="City">
            {event.city ?? 'Venue to be announced'}
          </Fact>
        </motion.dl>

        {/* About */}
        <motion.section {...rise(0.25)} className="mt-12">
          <SectionHeading>About</SectionHeading>
          <p className="max-w-3xl text-[17px] leading-relaxed whitespace-pre-line text-paper/75">
            {event.description || 'No description yet.'}
          </p>
        </motion.section>

        {/* Lineup */}
        {event.artists.length > 0 && (
          <motion.section {...rise(0.3)} className="mt-12">
            <SectionHeading>Lineup</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {event.artists.map((artist) => (
                <ArtistRow key={artist.id} artist={artist} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Tickets */}
      <motion.aside {...rise(0.2)} className="lg:sticky lg:top-6 lg:self-start">
        <TicketsPanel event={event} />
      </motion.aside>
    </div>
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

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-4 font-display text-[28px] leading-none text-paper">
      {children}
      <span aria-hidden className="h-px flex-1 bg-paper/10" />
    </h2>
  )
}

function ArtistRow({ artist }: { artist: Artist }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-paper/10 bg-ink-900 p-4">
      <ArtistAvatar artist={artist} />
      <div className="min-w-0">
        <p className="truncate font-display text-2xl leading-tight text-paper">
          {artist.stageName}
        </p>
        <p className="label-mono text-paper/45">
          {artist.genre}
          {artist.country && ` · ${artist.country}`}
        </p>
        {artist.bio && <p className="mt-2 text-sm leading-relaxed text-paper/60">{artist.bio}</p>}
      </div>
    </div>
  )
}

function TicketsPanel({ event }: { event: EventSummary }) {
  const tiers = [...event.ticketTypes].sort((a, b) => Number(a.price) - Number(b.price))
  const price = lowestPrice(event)
  const seats = seatsLeft(event)

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-900 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[28px] leading-none text-paper">Tickets</h2>
        {tiers.length > 0 && (
          <p className="text-sm text-paper/55">
            {price === 0 ? 'Free' : price !== null && `from ${formatPrice(price)}`}
          </p>
        )}
      </div>

      {tiers.length === 0 ? (
        <p className="mt-4 text-sm text-paper/50">Tickets haven&apos;t been released yet.</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {tiers.map((tier, i) => {
            const left = tier.availableSeatCount ?? 0
            const soldOut = left === 0
            const pct = tier.seatCount ? (left / tier.seatCount) * 100 : 0
            return (
              <motion.li
                key={tier.type}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07, ease }}
                className={cn(
                  'rounded-xl border p-4',
                  soldOut ? 'border-paper/[0.06] opacity-60' : 'border-paper/10 bg-paper/[0.02]',
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium text-paper">{tierLabels[tier.type] ?? tier.type}</p>
                  <p className="text-lg font-semibold tracking-tight text-paper tabular-nums">
                    {Number(tier.price) === 0 ? 'Free' : formatPrice(Number(tier.price))}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper/10">
                    <motion.div
                      className={cn('h-full rounded-full', pct < 20 ? 'bg-brand' : 'bg-paper/60')}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease }}
                    />
                  </div>
                  <p
                    className={cn(
                      'font-mono text-[11px] whitespace-nowrap tabular-nums',
                      soldOut ? 'text-signal' : 'text-paper/45',
                    )}
                  >
                    {soldOut
                      ? 'Sold out'
                      : `${left.toLocaleString()} of ${tier.seatCount.toLocaleString()} left`}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}

      {tiers.length > 0 && (
        <p className="mt-5 border-t border-paper/10 pt-4 label-mono text-paper/40">
          {seats === 0 ? 'This event is sold out' : `${seats.toLocaleString()} seats left in total`}
        </p>
      )}
    </div>
  )
}

function NotAvailable() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-paper/15 px-6 py-24 text-center">
      <p className="font-display text-4xl text-paper">This event isn&apos;t available</p>
      <p className="mt-2 text-sm text-paper/50">
        It may have been removed, or it isn&apos;t on sale yet.
      </p>
      <Link
        to={paths.home}
        className="mt-6 inline-flex h-10 items-center rounded-xl border border-paper/15 px-4 text-sm text-paper/80 transition hover:border-paper/35 hover:text-paper"
      >
        Browse events
      </Link>
    </div>
  )
}
