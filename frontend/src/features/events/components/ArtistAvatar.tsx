import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { Artist } from '../types'

/** Round artist photo, falling back to serif initials when there's no image or it fails to load. */
export function ArtistAvatar({
  artist,
  className = 'size-14 text-xl',
}: {
  artist: Pick<Artist, 'stageName' | 'imageUrl'>
  /** Size and initials font size, e.g. `size-14 text-xl`. */
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const initials = artist.stageName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return artist.imageUrl && !failed ? (
    <img
      src={artist.imageUrl}
      alt=""
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full object-cover', className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full border border-paper/15 font-display text-paper/80',
        className,
      )}
    >
      {initials}
    </span>
  )
}
