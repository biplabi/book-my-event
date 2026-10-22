import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowUpRight, ImagePlus, Plus, X } from 'lucide-react'
import { useCallback, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { TextField } from '@/components/ui/TextField'
import { adminArtistPath } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ArtistAvatar } from '@/features/events/components/ArtistAvatar'
import type { Artist } from '@/features/events/types'
import { useResource } from '@/hooks/useResource'
import { cn } from '@/lib/cn'
import { adminApi, StorageUploadError } from '../api/admin.api'
import { AdminPageHeader, ResourceView } from '../components/AdminPage'
import { describeAdminError } from '../utils/errors'
import { Sheet } from '../components/Sheet'
import {
  artistImageTypes,
  artistSchema,
  validateArtistImage,
  type ArtistFormValues,
} from '../schemas/admin.schemas'

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
          onCreated={(artist) => {
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

function ArtistForm({ onCreated }: { onCreated: (artist: Artist) => void }) {
  const { token } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  // `preview` is a temporary browser URL for the picked file, shown before it's uploaded.
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    mode: 'onTouched',
    defaultValues: { stageName: '', genre: '', country: '', bio: '' },
  })

  const pickImage = (file: File | null) => {
    if (image) URL.revokeObjectURL(image.preview)
    const problem = file && validateArtistImage(file)
    setImageError(problem)
    setImage(file && !problem ? { file, preview: URL.createObjectURL(file) } : null)
  }

  const onSubmit = handleSubmit(async (v) => {
    if (!token) return
    setFormError(null)
    try {
      // Upload first so the artist is only created once the photo is safely stored.
      const imageKey = image ? await adminApi.uploadArtistImage(token, image.file) : undefined
      const artist = await adminApi.createArtist(token, {
        stageName: v.stageName.trim(),
        genre: v.genre.trim(),
        country: v.country || undefined,
        imageKey,
        bio: v.bio || undefined,
      })
      toast.success(`${artist.stageName} added.`)
      onCreated(artist)
    } catch (err) {
      setFormError(err instanceof StorageUploadError ? err.message : describeAdminError(err))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError && <Alert>{formError}</Alert>}
      <TextField
        label="Stage name"
        autoFocus
        error={errors.stageName?.message}
        {...register('stageName')}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Genre" error={errors.genre?.message} {...register('genre')} />
        <TextField
          label="Country (optional)"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>
      <PhotoPicker
        file={image?.file ?? null}
        preview={image?.preview ?? null}
        error={imageError}
        onChange={pickImage}
      />
      <TextAreaField label="Bio (optional)" error={errors.bio?.message} {...register('bio')} />
      <Button type="submit" loading={isSubmitting} loadingText="Saving…" className="w-full">
        Add artist
      </Button>
    </form>
  )
}

/** Optional photo field with a round preview of the picked file. */
function PhotoPicker({
  file,
  preview,
  error,
  onChange,
}: {
  file: File | null
  preview: string | null
  error: string | null
  onChange: (file: File | null) => void
}) {
  const inputId = useId()

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-4 rounded-xl border bg-paper/[0.025] p-3 transition-colors duration-200 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand/70',
          error ? 'border-signal/60' : 'border-paper/12 hover:border-paper/25',
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="size-14 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden
            className="grid size-14 shrink-0 place-items-center rounded-full border border-dashed border-paper/20 text-paper/40"
          >
            <ImagePlus className="size-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <label
            htmlFor={inputId}
            className="cursor-pointer text-[15px] text-paper transition-colors hover:text-brand"
          >
            {file ? 'Change photo' : 'Add photo (optional)'}
          </label>
          <p className="truncate text-[13px] text-paper/45">
            {file ? file.name : 'JPEG, PNG or WebP, up to 5 MB'}
          </p>
        </div>
        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove photo"
            className="rounded-lg p-2 text-paper/45 transition-colors hover:bg-paper/5 hover:text-paper"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
        <input
          id={inputId}
          type="file"
          accept={artistImageTypes.join(',')}
          className="sr-only"
          onChange={(e) => {
            onChange(e.target.files?.[0] ?? null)
            // Reset so picking the same file again still fires onChange.
            e.target.value = ''
          }}
        />
      </div>
      {error && (
        <p role="alert" className="pt-1.5 pl-1 text-[13px] text-signal">
          {error}
        </p>
      )}
    </div>
  )
}
