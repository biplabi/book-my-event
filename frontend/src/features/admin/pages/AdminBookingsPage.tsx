import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router'
import { eventPath } from '@/config/routes'
import type { UserProfile } from '@/features/auth/types'
import type { EventSummary } from '@/features/events/types'
import { formatPrice } from '@/features/events/utils/format'
import { useResource } from '@/hooks/useResource'
import { backTo } from '@/lib/back-link'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, EmptyRow, ResourceView, TableShell, Th } from '../components/AdminPage'
import { BookingStatusBadge } from '../components/StatusBadge'
import type { Booking } from '../types'

const dateTime = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export function AdminBookingsPage() {
  const bookings = useResource(adminApi.listBookings)
  // Bookings only carry ids, so join against events and users for readable rows.
  const events = useResource(adminApi.listEvents)
  const users = useResource(adminApi.listUsers)

  return (
    <>
      <AdminPageHeader
        title="Bookings"
        count={bookings.status === 'success' ? bookings.data.length : undefined}
        description="Every booking across all events, newest first."
      />
      <div className="mt-8">
        <ResourceView resource={bookings}>
          {(list) => (
            <BookingsView
              bookings={list}
              events={events.status === 'success' ? events.data : []}
              users={users.status === 'success' ? users.data : []}
            />
          )}
        </ResourceView>
      </div>
    </>
  )
}

function BookingsView({
  bookings,
  events,
  users,
}: {
  bookings: Booking[]
  events: EventSummary[]
  users: UserProfile[]
}) {
  const location = useLocation()
  const eventName = useMemo(() => new Map(events.map((e) => [e.id, e.name])), [events])
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  const stats = useMemo(() => {
    const paid = bookings.filter((b) => b.status === 'PAYMENT_SUCCESS')
    return [
      { label: 'Bookings', value: bookings.length.toLocaleString() },
      {
        label: 'Revenue',
        value: formatPrice(paid.reduce((s, b) => s + Number(b.totalAmount || 0), 0)),
      },
      {
        label: 'Tickets sold',
        value: paid
          .reduce((s, b) => s + b.tickets.reduce((n, t) => n + t.quantity, 0), 0)
          .toLocaleString(),
      },
      {
        label: 'Failed payments',
        value: bookings.filter((b) => b.status === 'PAYMENT_FAILED').length.toLocaleString(),
      },
    ]
  }, [bookings])

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-paper/10 bg-ink-900 p-4"
          >
            <p className="label-mono text-paper/45">{s.label}</p>
            <p className="mt-2 font-display text-4xl leading-none text-paper tabular-nums">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <TableShell>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Event</Th>
            <Th>Customer</Th>
            <Th>Tickets</Th>
            <Th>Status</Th>
            <Th>Payment ref</Th>
            <Th>Booked</Th>
            <Th className="text-right">Amount</Th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && <EmptyRow colSpan={8}>No bookings yet.</EmptyRow>}
          {bookings.map((b, i) => {
            const user = userById.get(b.userId)
            return (
              <motion.tr
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.03 }}
                className="border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.02]"
              >
                <td className="px-4 py-3.5 font-mono text-xs text-paper/45">{b.id}</td>
                <td className="px-4 py-3.5 font-medium text-paper">
                  <Link
                    to={eventPath(b.eventId)}
                    state={backTo(location, 'Bookings')}
                    className="underline-offset-4 transition-colors hover:text-brand hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {eventName.get(b.eventId) ?? `Event #${b.eventId}`}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  {user ? (
                    <>
                      <p className="text-paper/85">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="font-mono text-[11px] text-paper/40">{user.email}</p>
                    </>
                  ) : (
                    <span className="text-paper/50">User #{b.userId}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-paper/70">
                  {b.tickets.map((t) => `${t.quantity}× ${t.ticketType.toLowerCase()}`).join(', ')}
                </td>
                <td className="px-4 py-3.5">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="max-w-[140px] truncate px-4 py-3.5 font-mono text-[11px] text-paper/45">
                  {b.paymentReference ?? '—'}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-paper/60">
                  {b.createdAt ? dateTime.format(new Date(b.createdAt)) : '—'}
                </td>
                <td className="px-4 py-3.5 text-right font-medium whitespace-nowrap text-paper tabular-nums">
                  {formatPrice(Number(b.totalAmount || 0))}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </TableShell>
    </>
  )
}
