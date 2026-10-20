import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { eventPath } from '@/config/routes'
import type { EventSummary } from '../types'
import { categories } from '../utils/categories'
import { formatEventDate, formatPrice, lowestPrice, seatsLeft } from '../utils/format'

/**
 * Poster-style card: category and availability on top, a big date, then title and lineup.
 * Cards pop in (scale + rise on a bouncy spring) each time they scroll into view;
 * `index` staggers them within a row.
 * The hover lift is CSS `translate`, which composes with Motion's `transform` and so
 * doesn't inherit the entrance delay when the pointer leaves.
 * With `linked`, the title's link is stretched over the whole card (arrow included). It sits at
 * z-10 because the hovered arrow gets a transform, which would otherwise paint it above the link.
 */
export function EventCard({
  event,
  index = 0,
  linked = false,
}: {
  event: EventSummary
  index?: number
  linked?: boolean
}) {
  const category = categories[event.eventCategory]
  const CategoryIcon = category.icon
  const when = formatEventDate(event.startDateTime)
  const price = lowestPrice(event)
  const seats = seatsLeft(event)
  const lineup = event.artists.map((a) => a.stageName).join(', ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.25 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 17,
        mass: 0.8,
        delay: Math.min(index, 5) * 0.06,
        opacity: { duration: 0.3, delay: Math.min(index, 5) * 0.06 },
      }}
      className="group relative flex flex-col rounded-2xl border border-paper/10 bg-ink-900 p-4 transition-[translate,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-paper/25 hover:bg-ink-800 hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.8)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand/70"
    >
      <div className="flex items-center justify-between label-mono">
        <span className="inline-flex items-center gap-1.5 text-paper/55">
          <CategoryIcon className="size-3.5" aria-hidden />
          {category.name}
        </span>
        {event.ticketTypes.length > 0 &&
          (seats === 0 ? (
            <span className="text-signal">Sold out</span>
          ) : (
            <span className="text-paper/35 tabular-nums">{seats.toLocaleString()} left</span>
          ))}
      </div>

      {when ? (
        <div className="mt-5 flex items-end gap-2.5">
          <span className="font-display text-[64px] leading-[0.72] tracking-[-0.03em] text-paper">
            {when.day}
          </span>
          <span className="pb-0.5 label-mono leading-relaxed text-paper/55">
            {when.month}
            <br />
            {when.weekday} · {when.time}
          </span>
        </div>
      ) : (
        <p className="mt-5 label-mono text-paper/40">Date to be announced</p>
      )}

      <h3 className="mt-4 line-clamp-2 font-display text-[25px] leading-[1.05] text-paper">
        {linked ? (
          <Link
            to={eventPath(event.id)}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-['']"
          >
            {event.name}
          </Link>
        ) : (
          event.name
        )}
      </h3>
      {lineup && <p className="mt-1 truncate text-sm text-paper/50">with {lineup}</p>}

      {/* mt-auto pins the footer to the bottom; pt-5 keeps a minimum gap above it. */}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-paper/10 pt-3">
          <div className="min-w-0">
            <p className="truncate label-mono text-paper/40">{event.city ?? 'Venue TBA'}</p>
            <p className="mt-0.5 text-base font-semibold tracking-tight text-paper">
              {price === null ? '—' : price === 0 ? 'Free' : `from ${formatPrice(price)}`}
            </p>
          </div>
          <span
            aria-hidden
            className="pointer-events-none grid size-9 shrink-0 place-items-center rounded-full border border-paper/15 text-paper/70 transition-all duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-paper"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-paper/[0.07] bg-ink-900 p-4">
      <div className="h-3 w-24 animate-pulse rounded-full bg-paper/[0.06]" />
      <div className="mt-5 h-12 w-24 animate-pulse rounded-lg bg-paper/[0.06]" />
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded-lg bg-paper/[0.06]" />
      <div className="mt-6 border-t border-paper/[0.07] pt-3">
        <div className="h-4 w-24 animate-pulse rounded-full bg-paper/[0.06]" />
      </div>
    </div>
  )
}
