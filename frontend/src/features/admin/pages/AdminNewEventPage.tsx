import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Building2, Check, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/SelectField'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { TextField } from '@/components/ui/TextField'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { EventCard } from '@/features/events/components/EventCard'
import type { Artist, EventCategory, EventSummary } from '@/features/events/types'
import { categories, categoryOrder } from '@/features/events/utils/categories'
import { useResource } from '@/hooks/useResource'
import { cn } from '@/lib/cn'
import { adminApi } from '../api/admin.api'
import { AdminPageHeader, ResourceView } from '../components/AdminPage'
import { describeAdminError } from '../utils/errors'
import { eventSchema, ticketTiers, type EventFormValues } from '../schemas/admin.schemas'
import type { Venue } from '../types'

const tierLabels: Record<(typeof ticketTiers)[number], string> = {
  GENERAL: 'General',
  PREMIUM: 'Premium',
  VIP: 'VIP',
}

export function AdminNewEventPage() {
  const venues = useResource(adminApi.listVenues)
  const artists = useResource(adminApi.listArtists)

  return (
    <>
      <Link
        to={paths.adminEvents}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-paper/50 transition hover:text-paper"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All events
      </Link>
      <AdminPageHeader
        title="New event"
        description="Events start as drafts. Publish to make them visible and bookable."
      />
      <div className="mt-8">
        <ResourceView resource={venues}>
          {(venueList) => (
            <ResourceView resource={artists}>
              {(artistList) => <EventForm venues={venueList} artists={artistList} />}
            </ResourceView>
          )}
        </ResourceView>
      </div>
    </>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-paper/10 bg-ink-900 p-5 sm:p-6">
      <h2 className="font-display text-2xl leading-none text-paper">{title}</h2>
      {hint && <p className="mt-1.5 text-sm text-paper/45">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function EventForm({ venues, artists }: { venues: Venue[]; artists: Artist[] }) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      eventCategory: '',
      description: '',
      venueId: '',
      artistIds: [],
      startDateTime: '',
      endDateTime: '',
      ticketTypes: [{ type: 'GENERAL', price: '', seatCount: '' }],
      publishNow: false,
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'ticketTypes' })
  const values = useWatch({ control })

  const venue = venues.find((v) => String(v.id) === values.venueId)
  const totalSeats = (values.ticketTypes ?? []).reduce((s, t) => s + (Number(t?.seatCount) || 0), 0)
  const overCapacity = venue ? totalSeats > venue.seatCapacity : false
  const unusedTiers = ticketTiers.filter((t) => !values.ticketTypes?.some((x) => x?.type === t))

  // Live preview: the same card users will see, built from the current form values.
  const preview = useMemo<EventSummary>(
    () => ({
      id: 0,
      name: values.name?.trim() || 'Untitled event',
      eventCategory: (values.eventCategory || 'CONCERT') as EventCategory,
      city: venue?.address?.city ?? null,
      startDateTime: values.startDateTime ?? '',
      endDateTime: values.endDateTime ?? '',
      status: 'DRAFT',
      description: values.description ?? '',
      artists: artists.filter((a) => values.artistIds?.includes(a.id)),
      // Only rows with seats filled in, so an empty form doesn't preview as "sold out".
      ticketTypes: (values.ticketTypes ?? [])
        .filter((t) => Number(t?.seatCount) > 0)
        .map((t) => ({
          type: t?.type ?? 'GENERAL',
          price: Number(t?.price) || 0,
          seatCount: Number(t?.seatCount) || 0,
          availableSeatCount: Number(t?.seatCount) || 0,
        })),
    }),
    [values, venue, artists],
  )

  const toggleArtist = (id: number) => {
    const current = values.artistIds ?? []
    setValue(
      'artistIds',
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      { shouldDirty: true },
    )
  }

  const onSubmit = handleSubmit(async (v) => {
    if (!token) return
    if (overCapacity) {
      setFormError(
        `Total seats (${totalSeats}) exceed ${venue?.name}'s capacity of ${venue?.seatCapacity}.`,
      )
      return
    }
    setFormError(null)
    try {
      let created = await adminApi.createEvent(token, {
        name: v.name.trim(),
        eventCategory: v.eventCategory as EventCategory,
        description: v.description.trim(),
        venueId: Number(v.venueId),
        artistIds: v.artistIds,
        startDateTime: v.startDateTime,
        endDateTime: v.endDateTime,
        ticketTypes: v.ticketTypes.map((t) => ({
          type: t.type,
          price: Number(t.price),
          seatCount: Number(t.seatCount),
        })),
      })
      if (v.publishNow) created = await adminApi.updateEventStatus(token, created.id, 'PUBLISHED')
      toast.success(v.publishNow ? `${created.name} is live.` : `${created.name} saved as a draft.`)
      navigate(paths.adminEvents)
    } catch (err) {
      setFormError(describeAdminError(err))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {formError && <Alert key="err">{formError}</Alert>}
        </AnimatePresence>

        <Section title="Basics">
          <TextField label="Event name" error={errors.name?.message} {...register('name')} />
          <Controller
            control={control}
            name="eventCategory"
            render={({ field, fieldState }) => (
              <SelectField
                label="Category"
                placeholder="Choose a category"
                options={categoryOrder.map((c) => ({
                  value: c,
                  label: categories[c].name,
                  icon: categories[c].icon,
                }))}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <TextAreaField
            label="Description"
            error={errors.description?.message}
            {...register('description')}
          />
        </Section>

        <Section title="Where & who">
          {venues.length === 0 ? (
            <p className="text-sm text-paper/60">
              No venues yet.{' '}
              <Link to={paths.adminVenues} className="text-paper underline underline-offset-4">
                Add a venue
              </Link>{' '}
              first.
            </p>
          ) : (
            <Controller
              control={control}
              name="venueId"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Venue"
                  placeholder="Choose a venue"
                  options={venues.map((v) => ({
                    value: String(v.id),
                    label: v.name,
                    hint: [v.address?.city, `${v.seatCapacity.toLocaleString()} seats`]
                      .filter(Boolean)
                      .join(' · '),
                    icon: Building2,
                  }))}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          )}
          <div>
            <p className="mb-2 label-mono text-paper/45">Lineup (optional)</p>
            {artists.length === 0 ? (
              <p className="text-sm text-paper/50">
                No artists yet.{' '}
                <Link to={paths.adminArtists} className="text-paper underline underline-offset-4">
                  Add artists
                </Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {artists.map((a) => {
                  const on = values.artistIds?.includes(a.id) ?? false
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleArtist(a.id)}
                      className={cn(
                        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors',
                        on
                          ? 'border-paper bg-paper text-ink-950'
                          : 'border-paper/15 text-paper/70 hover:border-paper/35 hover:text-paper',
                      )}
                    >
                      {on && <Check className="size-3.5" aria-hidden />}
                      {a.stageName}
                      <span
                        className={cn(
                          'font-mono text-[11px]',
                          on ? 'text-ink-950/50' : 'text-paper/35',
                        )}
                      >
                        {a.genre}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </Section>

        <Section title="When">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Starts"
              type="datetime-local"
              floatLabel
              error={errors.startDateTime?.message}
              {...register('startDateTime')}
            />
            <TextField
              label="Ends"
              type="datetime-local"
              floatLabel
              error={errors.endDateTime?.message}
              {...register('endDateTime')}
            />
          </div>
        </Section>

        <Section
          title="Tickets"
          hint="Up to one row per tier. Seats across all tiers must fit the venue."
        >
          <AnimatePresence initial={false}>
            {fields.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-3">
                  <Controller
                    control={control}
                    name={`ticketTypes.${i}.type`}
                    render={({ field, fieldState }) => (
                      <SelectField
                        label="Tier"
                        options={ticketTiers.map((t) => ({ value: t, label: tierLabels[t] }))}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                  <TextField
                    label="Price (₹)"
                    inputMode="decimal"
                    error={errors.ticketTypes?.[i]?.price?.message}
                    {...register(`ticketTypes.${i}.price`)}
                  />
                  <TextField
                    label="Seats"
                    inputMode="numeric"
                    error={errors.ticketTypes?.[i]?.seatCount?.message}
                    {...register(`ticketTypes.${i}.seatCount`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
                    aria-label="Remove ticket tier"
                    className="mt-2.5 grid size-9 place-items-center rounded-full border border-paper/15 text-paper/50 transition hover:border-signal/50 hover:text-signal disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {errors.ticketTypes?.root?.message && (
            <p className="text-[13px] text-signal">{errors.ticketTypes.root.message}</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
            <Button
              variant="secondary"
              className="h-9 px-3 text-sm"
              disabled={unusedTiers.length === 0}
              onClick={() => append({ type: unusedTiers[0]!, price: '', seatCount: '' })}
            >
              <Plus className="size-4" aria-hidden />
              Add tier
            </Button>
            <p
              className={cn(
                'font-mono text-xs tabular-nums',
                overCapacity ? 'text-signal' : 'text-paper/50',
              )}
            >
              {totalSeats.toLocaleString()} seats
              {venue && ` / ${venue.seatCapacity.toLocaleString()} capacity`}
            </p>
          </div>
        </Section>
      </div>

      {/* Preview + submit */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <p className="label-mono text-paper/45">Preview</p>
        <EventCard event={preview} />
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-paper/10 bg-ink-900 px-4 py-3.5 text-sm text-paper/80">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-brand)]"
            {...register('publishNow')}
          />
          Publish immediately
        </label>
        <Button type="submit" loading={isSubmitting} loadingText="Creating…" className="w-full">
          {values.publishNow ? 'Create & publish' : 'Create draft'}
        </Button>
      </aside>
    </form>
  )
}
