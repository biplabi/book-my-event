import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { Artist } from '@/features/events/types'
import { cn } from '@/lib/cn'
import { adminApi } from '../api/admin.api'
import { describeAdminError } from '../utils/errors'
import { ConfirmDialog } from './ConfirmDialog'

/**
 * Deletes the artist after a confirmation, then returns to the artist list. event-service refuses
 * while any event lists the artist, so in that case the dialog explains why instead.
 */
export function DeleteArtistButton({
  artist,
  eventCount,
  className,
}: {
  artist: Artist
  /** Events that list this artist; null while they're still loading. */
  eventCount: number | null
  className?: string
}) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const inUse = eventCount !== null && eventCount > 0

  const remove = async () => {
    if (!token) return
    try {
      await adminApi.deleteArtist(token, artist.id)
      toast.success(`${artist.stageName} deleted.`)
      // Replace, so Back doesn't return to a page for an artist that no longer exists.
      navigate(paths.adminArtists, { replace: true })
    } catch (err) {
      // e.g. 409 if an event added this artist after the page loaded
      toast.error(describeAdminError(err))
      setOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setOpen(true)}
        disabled={eventCount === null}
        className={cn('h-10 px-4 text-sm', className)}
      >
        <Trash2 className="size-4" aria-hidden />
        Delete
      </Button>
      {inUse ? (
        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title={`Can't delete ${artist.stageName}`}
        >
          {artist.stageName} is part of {eventCount} {eventCount === 1 ? 'event' : 'events'}, and
          events keep their lineup, past ones included. Only artists who aren&apos;t in any event
          can be deleted.
        </ConfirmDialog>
      ) : (
        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title={`Delete ${artist.stageName}?`}
          confirmLabel="Delete artist"
          onConfirm={remove}
        >
          This removes the artist and their photo. It can&apos;t be undone.
        </ConfirmDialog>
      )}
    </>
  )
}
