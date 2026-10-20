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
  /** Stock the ticket is "printed" on. */
  tone: 'paper' | 'brand' | 'ink'
}

const tones: Record<ShowcaseTicket['tone'], string> = {
  paper: 'bg-paper text-ink-950',
  brand: 'bg-brand text-paper',
  ink: 'bg-ink-800 text-paper shadow-[inset_0_0_0_1px_rgb(242_237_228/0.12)]',
}

const barcode = {
  backgroundImage:
    'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px, currentColor 8px 11px, transparent 11px 13px)',
}

/** Purely decorative ticket used on the auth showcase. Height is fixed so the notches line up with the perforation. */
export function TicketCard({ ticket, className }: { ticket: ShowcaseTicket; className?: string }) {
  return (
    <div className={cn('drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]', className)}>
      <div
        className={cn(
          'relative flex h-[330px] w-[290px] flex-col overflow-hidden rounded-[18px] ticket-mask',
          tones[ticket.tone],
        )}
      >
        {/* Masthead */}
        <div className="relative h-[148px] p-5">
          <div className="flex items-start justify-between label-mono text-[10px]">
            <span>{ticket.category}</span>
            <span className="rounded-full border border-current px-2 py-0.5">{ticket.tier}</span>
          </div>
          <p className="absolute right-5 bottom-3 left-5 font-display text-[34px] leading-[0.98]">
            {ticket.title}
          </p>
        </div>

        {/* Details */}
        <div className="mx-5 grid h-[83px] grid-cols-3 gap-2 border-t border-current/20 pt-3.5">
          <Detail icon={CalendarDays} label="Date" value={ticket.date} />
          <Detail icon={Clock3} label="Doors" value={ticket.time} />
          <Detail icon={MapPin} label="Venue" value={ticket.venue} />
        </div>

        {/* Stub */}
        <div className="mx-5 flex h-[99px] items-center justify-between border-t border-dashed border-current/30">
          <div>
            <p className="label-mono text-[10px] opacity-60">Seat {ticket.seat}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">{ticket.price}</p>
          </div>
          <div className="h-11 w-24 opacity-80" style={barcode} />
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
      <p className="flex items-center gap-1 label-mono text-[9.5px] opacity-60">
        <Icon className="size-3" aria-hidden />
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-medium">{value}</p>
    </div>
  )
}
