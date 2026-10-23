import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { Artist } from '@/features/events/types'
import { cn } from '@/lib/cn'
import { adminApi, StorageUploadError } from '../api/admin.api'
import {
  artistImageTypes,
  artistSchema,
  validateArtistImage,
  type ArtistFormValues,
} from '../schemas/admin.schemas'
import { describeAdminError } from '../utils/errors'

interface ArtistFormProps {
  /** Artist to edit. Leave out to create a new one. */
  artist?: Artist
  onSaved: (artist: Artist) => void
}

/** Create or edit an artist, including the optional photo. */
export function ArtistForm({ artist, onSaved }: ArtistFormProps) {
  const { token } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  // A newly picked file; `preview` is a temporary browser URL shown before it's uploaded.
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  // Editing only: the admin removed the artist's current photo.
  const [removeCurrent, setRemoveCurrent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    mode: 'onTouched',
    defaultValues: {
      stageName: artist?.stageName ?? '',
      genre: artist?.genre ?? '',
      country: artist?.country ?? '',
      bio: artist?.bio ?? '',
    },
  })

  const currentPhoto = removeCurrent ? undefined : artist?.imageUrl
  const preview = image?.preview ?? currentPhoto ?? null

  /** `null` means the admin clicked remove. */
  const pickImage = (file: File | null) => {
    if (image) URL.revokeObjectURL(image.preview)
    if (!file) {
      setImage(null)
      setImageError(null)
      setRemoveCurrent(true)
      return
    }
    const problem = validateArtistImage(file)
    setImageError(problem)
    setImage(problem ? null : { file, preview: URL.createObjectURL(file) })
  }

  const onSubmit = handleSubmit(async (v) => {
    if (!token) return
    setFormError(null)
    try {
      // Upload first so the artist is only saved once the photo is safely stored.
      const imageKey = image ? await adminApi.uploadArtistImage(token, image.file) : undefined
      const details = {
        stageName: v.stageName.trim(),
        genre: v.genre.trim(),
        country: v.country || undefined,
        bio: v.bio || undefined,
        imageKey,
      }
      const saved = artist
        ? await adminApi.updateArtist(token, artist.id, { ...details, removeImage: removeCurrent })
        : await adminApi.createArtist(token, details)
      toast.success(artist ? `${saved.stageName} updated.` : `${saved.stageName} added.`)
      onSaved(saved)
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
        preview={preview}
        caption={image ? image.file.name : currentPhoto ? 'Current photo' : null}
        error={imageError}
        onChange={pickImage}
      />
      <TextAreaField label="Bio (optional)" error={errors.bio?.message} {...register('bio')} />
      <Button type="submit" loading={isSubmitting} loadingText="Saving…" className="w-full">
        {artist ? 'Save changes' : 'Add artist'}
      </Button>
    </form>
  )
}

/** Optional photo field with a round preview. */
function PhotoPicker({
  preview,
  caption,
  error,
  onChange,
}: {
  preview: string | null
  /** Line under the label, e.g. the picked file's name. Falls back to the format hint. */
  caption: string | null
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
            {preview ? 'Change photo' : 'Add photo (optional)'}
          </label>
          <p className="truncate text-[13px] text-paper/45">
            {caption ?? 'JPEG, PNG or WebP, up to 5 MB'}
          </p>
        </div>
        {preview && (
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
            const file = e.target.files?.[0]
            if (file) onChange(file)
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
