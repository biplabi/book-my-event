import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ShowcaseTicket {
  category: string
  title: string
  date: string
  time: string
  venue: string
  tier: 'VIP' | 'PREMIUM' | 'GENERAL'
  price: string
  seat: string
  art: string
}

const tierStyles: Record<ShowcaseTicket['tier'], string> = {
  VIP: 'bg-amber/90 text-ink-950',
  PREMIUM: 'bg-white/90 text-ink-950',
  GENERAL: 'bg-ink-950/60 text-white ring-1 ring-white/25',
}

const barcode = {
  backgroundImage:
    'repeating-linear-gradient(90deg, #fff 0 2px, transparent 2px 4px, #fff 4px 5px, transparent 5px 8px, #fff 8px 11px, transparent 11px 13px)',
}

/** Purely decorative ticket used on the auth showcase. Height is fixed so the notches line up with the perforation. */
export function TicketCard({ ticket, className }: { ticket: ShowcaseTicket; className?: string }) {
  return (
    <div className={cn('drop-shadow-[0_30px_50px_rgb(0_0_0/0.55)]', className)}>
      <div className="relative h-[330px] w-[290px] overflow-hidden rounded-[22px] bg-ink-800 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] ticket-mask">
        {/* Art */}
        <div className={cn('relative h-[148px] overflow-hidden bg-gradient-to-br p-4', ticket.art)}>
          <div className="absolute -top-10 -right-8 size-40 rounded-full bg-white/25 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 size-44 rounded-full bg-black/30 blur-2xl" />
          <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
          <div className="relative flex items-start justify-between">
            <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white backdrop-blur">
              {ticket.category}
            </span>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.14em]',
                tierStyles[ticket.tier],
              )}
            >
              {ticket.tier}
            </span>
          </div>
          <p className="absolute right-4 bottom-3 left-4 font-display text-[30px] leading-[1.02] text-white italic drop-shadow">
            {ticket.title}
          </p>
        </div>

        {/* Details */}
        <div className="grid h-[83px] grid-cols-3 gap-2 px-4 pt-4 text-[11px] text-white/50">
          <Detail icon={CalendarDays} label="Date" value={ticket.date} />
          <Detail icon={Clock3} label="Doors" value={ticket.time} />
          <Detail icon={MapPin} label="Venue" value={ticket.venue} />
        </div>

        {/* Stub */}
        <div className="mx-4 flex h-[99px] items-center justify-between border-t border-dashed border-white/15">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-white/40 uppercase">
              Seat {ticket.seat}
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-white">{ticket.price}</p>
          </div>
          <div className="h-11 w-24 opacity-70" style={barcode} />
        </div>
      </div>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 tracking-wide uppercase">
        <Icon className="size-3" aria-hidden />
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-medium text-white/90">{value}</p>
    </div>
  )
}
