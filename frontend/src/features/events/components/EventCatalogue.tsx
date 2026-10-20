import { AnimatePresence, motion } from 'framer-motion'
import { CalendarX2, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/lib/api-client'
import { useEvents } from '../hooks/useEvents'
import type { EventCategory, EventSummary } from '../types'
import { categories, categoryOrder } from '../utils/categories'
import { byStartDate } from '../utils/format'
import { CategoryFilter, type CategorySelection } from './CategoryFilter'
import { EventCard, EventCardSkeleton } from './EventCard'

const gridClass = 'grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.isNetworkError) {
    return "We can't reach the events service right now. Please try again in a moment."
  }
  return "We couldn't load events. Please try again."
}

/** Signed-in event listing: category chips on top, then events grouped by category. */
export function EventCatalogue() {
  const result = useEvents()
  const [selected, setSelected] = useState<CategorySelection>('ALL')

  const events = useMemo(
    () => (result.status === 'success' ? [...result.events].sort(byStartDate) : []),
    [result],
  )

  const grouped = useMemo(() => {
    const groups = Object.fromEntries(categoryOrder.map((c) => [c, []])) as unknown as Record<
      EventCategory,
      EventSummary[]
    >
    for (const event of events) groups[event.eventCategory]?.push(event)
    return groups
  }, [events])

  const counts = useMemo(
    () =>
      ({
        ALL: events.length,
        ...Object.fromEntries(categoryOrder.map((c) => [c, grouped[c].length])),
      }) as Record<CategorySelection, number>,
    [events, grouped],
  )

  const visibleCategories =
    selected === 'ALL' ? categoryOrder.filter((c) => grouped[c].length > 0) : [selected]

  return (
    <section aria-labelledby="events-heading">
      <h2 id="events-heading" className="label-mono text-paper/45">
        Browse by category
      </h2>

      <div className="mt-3">
        <CategoryFilter value={selected} onChange={setSelected} counts={counts} />
      </div>

      <div className="mt-8">
        {result.status === 'loading' && (
          <div className={gridClass} role="status" aria-label="Loading events">
            {Array.from({ length: 6 }, (_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {result.status === 'error' && (
          <Alert
            tone={
              result.error instanceof ApiError && result.error.isNetworkError ? 'offline' : 'error'
            }
            action={
              <Button variant="secondary" onClick={result.retry} className="h-9 px-3 text-sm">
                <RefreshCw className="size-4" aria-hidden />
                Try again
              </Button>
            }
          >
            {errorMessage(result.error)}
          </Alert>
        )}

        {result.status === 'success' && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {visibleCategories.every((c) => grouped[c].length === 0) ? (
                <EmptyState category={selected === 'ALL' ? null : selected} />
              ) : (
                visibleCategories.map((c, i) => (
                  <CategorySection
                    key={c}
                    index={i + 1}
                    category={c}
                    events={grouped[c]}
                    showHeading={selected === 'ALL'}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

function CategorySection({
  index,
  category,
  events,
  showHeading,
}: {
  index: number
  category: EventCategory
  events: EventSummary[]
  showHeading: boolean
}) {
  const { label } = categories[category]
  return (
    <section aria-label={label}>
      {showHeading && (
        <h3 className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-xs text-brand tabular-nums">
            {String(index).padStart(2, '0')}
          </span>
          <span className="font-display text-[26px] leading-none text-paper">{label}</span>
          <motion.span
            aria-hidden
            className="h-px flex-1 origin-left translate-y-[-0.35em] bg-paper/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="label-mono text-paper/40 tabular-nums">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        </h3>
      )}
      <div className={gridClass}>
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} linked />
        ))}
      </div>
    </section>
  )
}

function EmptyState({ category }: { category: EventCategory | null }) {
  const label = category ? categories[category].label.toLowerCase() : 'events'
  return (
    <div className="grid place-items-center rounded-[20px] border border-dashed border-paper/15 px-6 py-14 text-center">
      <CalendarX2 className="size-7 text-paper/30" aria-hidden />
      <p className="mt-5 font-display text-3xl text-paper">No {label} on the lineup yet</p>
      <p className="mt-2 text-sm text-paper/45">
        Check back soon, new shows are added all the time.
      </p>
    </div>
  )
}
