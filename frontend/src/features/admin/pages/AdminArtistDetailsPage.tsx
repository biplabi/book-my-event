import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Pencil } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { eventPath, paths } from '@/config/routes'
import { ArtistAvatar } from '@/features/events/components/ArtistAvatar'
import type { Artist, EventSummary } from '@/features/events/types'
import { categories } from '@/features/events/utils/categories'
import { formatEventDate } from '@/features/events/utils/format'
import { useResource } from '@/hooks/useResource'
import { ApiError } from '@/lib/api-client'
import { backTo } from '@/lib/back-link'
import { adminApi } from '../api/admin.api'
import { EmptyRow, TableShell, Th } from '../components/AdminPage'
import { ArtistForm } from '../components/ArtistForm'
import { Sheet } from '../components/Sheet'
import { EventStatusBadge } from '../components/StatusBadge'
import { describeAdminError } from '../utils/errors'

const ease = [0.22, 1, 0.36, 1] as const

export function AdminArtistDetailsPage() {
  const { id } = useParams()
  const artistId = Number(id)
  const fetchArtist = useCallback(
    (token: string, signal: AbortSignal) => adminApi.getArtist(token, artistId, signal),
    [artistId],
  )
  const artist = useResource(fetchArtist)
  // The API has no "events by artist" endpoint, so filter the full list client-side.
  const events = useResource(adminApi.listEvents)
  const [editing, setEditing] = useState(false)
  const closeEditor = useCallback(() => setEditing(false), [])

  const notFound =
    Number.isNaN(artistId) ||
    (artist.status === 'error' && artist.error instanceof ApiError && artist.error.status === 404)

  return (
    <>
      <Link
        to={paths.adminArtists}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-paper/50 transition hover:text-paper"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All artists
      </Link>

      {notFound ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-paper/15 px-6 py-24 text-center">
          <p className="font-display text-4xl text-paper">Artist not found</p>
          <p className="mt-2 text-sm text-paper/50">It may have been removed.</p>
        </div>
      ) : artist.status === 'loading' ? (
        <div className="grid place-items-center py-24 text-paper/40" role="status">
          <Spinner className="size-6" />
        </div>
      ) : artist.status === 'error' ? (
        <Alert>{describeAdminError(artist.error)}</Alert>
      ) : (
        <>
          <ArtistProfile
            artist={artist.data}
            events={events.status === 'success' ? events.data : null}
            onEdit={() => setEditing(true)}
          />
          <Sheet
            open={editing}
            onClose={closeEditor}
            title="Edit artist"
            description={artist.data.stageName}
          >
            <ArtistForm
              artist={artist.data}
              onSaved={(updated) => {
                artist.setData(() => updated)
                closeEditor()
              }}
            />
          </Sheet>
        </>
      )}
    </>
  )
}

function ArtistProfile({
  artist,
  events,
  onEdit,
}: {
  artist: Artist
  events: EventSummary[] | null
  onEdit: () => void
}) {
  const location = useLocation()
  const theirs = useMemo(
    () =>
      (events ?? [])
        .filter((e) => e.artists.some((a) => a.id === artist.id))
        .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)),
    [events, artist.id],
  )
  // Captured once so render stays pure; event times are local, so compare real dates.
  const [now] = useState(() => Date.now())
  const stats = [
    { label: 'Events', value: theirs.length },
    {
      label: 'Upcoming',
      value: theirs.filter(
        (e) => e.status === 'PUBLISHED' && new Date(e.startDateTime).getTime() > now,
      ).length,
    },
    { label: 'Cities', value: new Set(theirs.map((e) => e.city).filter(Boolean)).size },
  ]

  return (
    <>
      <title>{`${artist.stageName} · Admin · BookMyEvent`}</title>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col gap-6 sm:flex-row sm:items-center"
      >
        <ArtistAvatar artist={artist} className="size-28 text-4xl" />
        <div className="min-w-0">
          <p className="label-mono text-paper/45">
            {artist.genre}
            {artist.country && ` · ${artist.country}`}
          </p>
          <h1 className="mt-2 font-display text-[48px] leading-[0.95] text-paper sm:text-[64px]">
            {artist.stageName}
          </h1>
        </div>
        <Button
          variant="secondary"
          onClick={onEdit}
          className="h-10 self-start px-4 text-sm sm:ml-auto sm:self-center"
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </Button>
      </motion.section>

      {artist.bio && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mt-6 max-w-3xl text-[17px] leading-relaxed whitespace-pre-line text-paper/70"
        >
          {artist.bio}
        </motion.p>
      )}

      {/* Stats */}
      <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 + i * 0.05, ease }}
            className="rounded-2xl border border-paper/10 bg-ink-900 p-4"
          >
            <p className="label-mono text-paper/45">{s.label}</p>
            <p className="mt-2 font-display text-4xl leading-none text-paper tabular-nums">
              {events ? s.value : '—'}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Events */}
      <section className="mt-12">
        <h2 className="mb-4 flex items-center gap-4 font-display text-[28px] leading-none text-paper">
          Events
          <span aria-hidden className="h-px flex-1 bg-paper/10" />
        </h2>
        {events === null ? (
          <div className="grid place-items-center py-12 text-paper/40" role="status">
            <Spinner className="size-5" />
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>When</Th>
                <Th>City</Th>
                <Th>Status</Th>
                <Th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {theirs.length === 0 && (
                <EmptyRow colSpan={5}>{artist.stageName} isn&apos;t on any event yet.</EmptyRow>
              )}
              {theirs.map((event, i) => {
                const when = formatEventDate(event.startDateTime)
                const category = categories[event.eventCategory]
                return (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.04 }}
                    className="group relative border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.03]"
                  >
                    <td className="px-4 py-3.5">
                      {/* Stretched link: the whole row opens the event page. */}
                      <Link
                        to={eventPath(event.id)}
                        state={backTo(location, artist.stageName)}
                        className="font-medium text-paper outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
                      >
                        {event.name}
                      </Link>
                      <p className="mt-0.5 label-mono text-paper/40">{category?.name}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-paper/70">
                      {when ? `${when.weekday} ${when.day} ${when.month} · ${when.time}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-paper/70">{event.city ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <EventStatusBadge status={event.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ArrowUpRight
                        aria-hidden
                        className="ml-auto size-4 text-paper/30 transition-colors group-hover:text-brand"
                      />
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </TableShell>
        )}
      </section>
    </>
  )
}
