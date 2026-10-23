import { motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { adminArtistPath } from '@/config/routes'
import { ArtistAvatar } from '@/features/events/components/ArtistAvatar'
import type { Artist } from '@/features/events/types'
import { useResource } from '@/hooks/useResource'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, ResourceView } from '../components/AdminPage'
import { ArtistForm } from '../components/ArtistForm'
import { Sheet } from '../components/Sheet'

export function AdminArtistsPage() {
  const artists = useResource(adminApi.listArtists)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <AdminPageHeader
        title="Artists"
        count={artists.status === 'success' ? artists.data.length : undefined}
        description="Performers you can add to an event's lineup."
        actions={
          <Button className="h-10 px-4 text-sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden />
            New artist
          </Button>
        }
      />
      <div className="mt-8">
        <ResourceView resource={artists}>
          {(list) =>
            list.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-paper/15 py-16 text-center text-paper/45">
                No artists yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((a, i) => (
                  <ArtistCard key={a.id} artist={a} index={i} />
                ))}
              </div>
            )
          }
        </ResourceView>
      </div>

      <Sheet open={open} onClose={close} title="New artist" description="Who's performing?">
        <ArtistForm
          onSaved={(artist) => {
            artists.setData((all) => [...all, artist])
            close()
          }}
        />
      </Sheet>
    </>
  )
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: Math.min(index, 8) * 0.04 }}
      className="group relative flex gap-4 rounded-2xl border border-paper/10 bg-ink-900 p-4 transition-[translate,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-paper/25 hover:bg-ink-800 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand/70"
    >
      <ArtistAvatar artist={artist} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-2xl leading-tight text-paper">
          {/* Stretched link: the whole card opens the artist page. */}
          <Link
            to={adminArtistPath(artist.id)}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-['']"
          >
            {artist.stageName}
          </Link>
        </h3>
        <p className="label-mono text-paper/45">
          {artist.genre}
          {artist.country && ` · ${artist.country}`}
        </p>
        {artist.bio && <p className="mt-2 line-clamp-2 text-sm text-paper/55">{artist.bio}</p>}
      </div>
      <ArrowUpRight
        aria-hidden
        className="pointer-events-none size-4 shrink-0 text-paper/30 transition-colors duration-300 group-hover:text-brand"
      />
    </motion.article>
  )
}
