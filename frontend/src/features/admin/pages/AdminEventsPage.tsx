import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { toast } from 'sonner'
import { eventPath, paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { EventSummary } from '@/features/events/types'
import { categories } from '@/features/events/utils/categories'
import { formatEventDate, formatPrice, lowestPrice } from '@/features/events/utils/format'
import { useResource } from '@/hooks/useResource'
import { backTo } from '@/lib/back-link'
import { cn } from '@/lib/cn'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, EmptyRow, ResourceView, TableShell, Th } from '../components/AdminPage'
import { describeAdminError } from '../utils/errors'
import { ConfirmButton } from '../components/ConfirmButton'
import { EventStatusBadge } from '../components/StatusBadge'
import type { EventStatus } from '../types'

type Filter = EventStatus | 'ALL'
const filters: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Drafts' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'COMPLETED', label: 'Completed' },
]

export function AdminEventsPage() {
  const events = useResource(adminApi.listEvents)
  const [filter, setFilter] = useState<Filter>('ALL')

  return (
    <>
      <AdminPageHeader
        title="Events"
        count={events.status === 'success' ? events.data.length : undefined}
        description="Create events, then publish them to make them visible and bookable."
        actions={
          <Link
            to={paths.adminNewEvent}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-paper transition-colors hover:bg-brand-hover"
          >
            <Plus className="size-4" aria-hidden />
            New event
          </Link>
        }
      />
      <div className="mt-8">
        <ResourceView resource={events}>
          {(list) => (
            <EventsTable
              events={list}
              filter={filter}
              onFilter={setFilter}
              onUpdated={(updated) =>
                events.setData((all) => all.map((e) => (e.id === updated.id ? updated : e)))
              }
            />
          )}
        </ResourceView>
      </div>
    </>
  )
}

function EventsTable({
  events,
  filter,
  onFilter,
  onUpdated,
}: {
  events: EventSummary[]
  filter: Filter
  onFilter: (f: Filter) => void
  onUpdated: (e: EventSummary) => void
}) {
  const { token } = useAuth()
  const location = useLocation()

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      ALL: events.length,
      DRAFT: 0,
      PUBLISHED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    }
    for (const e of events) c[e.status] += 1
    return c
  }, [events])

  const rows = useMemo(
    () =>
      events
        .filter((e) => filter === 'ALL' || e.status === filter)
        .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)),
    [events, filter],
  )

  const setStatus = async (event: EventSummary, status: EventStatus, verb: string) => {
    if (!token) return
    try {
      onUpdated(await adminApi.updateEventStatus(token, event.id, status))
      toast.success(`${event.name} ${verb}.`)
    } catch (err) {
      toast.error(describeAdminError(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => onFilter(key)}
            className={cn(
              'relative inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors',
              filter === key ? 'text-ink-950' : 'text-paper/60 hover:text-paper',
            )}
          >
            {filter === key && (
              <motion.span
                layoutId="event-status-filter"
                className="absolute inset-0 rounded-full bg-paper"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{label}</span>
            <span className="relative font-mono opacity-50">{counts[key]}</span>
          </button>
        ))}
      </div>

      <TableShell>
        <thead>
          <tr>
            <Th>Event</Th>
            <Th>When</Th>
            <Th>City</Th>
            <Th>Status</Th>
            <Th>Seats sold</Th>
            <Th>From</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <EmptyRow colSpan={7}>
              {filter === 'ALL' ? 'No events yet. Create the first one.' : 'Nothing here.'}
            </EmptyRow>
          )}
          {rows.map((event, i) => {
            const when = formatEventDate(event.startDateTime)
            const price = lowestPrice(event)
            const total = event.ticketTypes.reduce((s, t) => s + t.seatCount, 0)
            const sold = total - event.ticketTypes.reduce((s, t) => s + t.availableSeatCount, 0)
            const Icon = categories[event.eventCategory]?.icon
            return (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.03 }}
                className="group relative border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.03]"
              >
                <td className="px-4 py-3.5">
                  {/* Stretched link: the whole row opens the event page. */}
                  <Link
                    to={eventPath(event.id)}
                    state={backTo(location, 'Admin events')}
                    className="font-medium text-paper outline-none group-hover:text-brand after:absolute after:inset-0 after:content-[''] focus-visible:underline"
                  >
                    {event.name}
                  </Link>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 label-mono text-paper/40">
                    {Icon && <Icon className="size-3" aria-hidden />}
                    {categories[event.eventCategory]?.name ?? event.eventCategory}
                  </p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-paper/70">
                  {when ? `${when.day} ${when.month} · ${when.time}` : '—'}
                </td>
                <td className="px-4 py-3.5 text-paper/70">{event.city ?? '—'}</td>
                <td className="px-4 py-3.5">
                  <EventStatusBadge status={event.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-paper/10">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: total ? `${(sold / total) * 100}%` : 0 }}
                      />
                    </div>
                    <span className="font-mono text-xs text-paper/50 tabular-nums">
                      {sold}/{total}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-paper/80">
                  {price === null ? '—' : price === 0 ? 'Free' : formatPrice(price)}
                </td>
                <td className="px-4 py-3.5">
                  {/* Above the row link so the buttons still get their own clicks. */}
                  <div className="relative z-10 flex justify-end gap-1.5">
                    {event.status === 'DRAFT' && (
                      <ConfirmButton
                        instant
                        onConfirm={() => setStatus(event, 'PUBLISHED', 'is live')}
                      >
                        Publish
                      </ConfirmButton>
                    )}
                    {event.status === 'PUBLISHED' && (
                      <ConfirmButton
                        confirmLabel="Unpublish?"
                        onConfirm={() => setStatus(event, 'DRAFT', 'moved back to drafts')}
                      >
                        Unpublish
                      </ConfirmButton>
                    )}
                    {(event.status === 'DRAFT' || event.status === 'PUBLISHED') && (
                      <ConfirmButton
                        tone="danger"
                        confirmLabel="Cancel event?"
                        onConfirm={() => setStatus(event, 'CANCELLED', 'was cancelled')}
                      >
                        Cancel
                      </ConfirmButton>
                    )}
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </TableShell>
    </>
  )
}
