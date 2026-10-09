import { motion, useMotionValue } from 'framer-motion'
import { ShieldCheck, Sparkles, Ticket } from 'lucide-react'
import type { PointerEvent } from 'react'
import { Logo } from '@/components/brand/Logo'
import { RotatingWord } from './RotatingWord'
import { TicketStack } from './TicketStack'

// Mirrors event-service's EventCategory enum.
const categories = ['concert', 'stand-up', 'festival', 'jam session', 'webinar'] as const

const highlights = [
  { icon: Ticket, label: 'Instant e-tickets' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: Sparkles, label: 'Curated lineups' },
]

const marqueeItems = ['Concerts', 'Stand-up', 'Festivals', 'Jam sessions', 'Webinars']

export function AuthShowcase() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative top-4 hidden h-[calc(100dvh-2rem)] min-h-[640px] flex-col self-start overflow-hidden rounded-[32px] border border-white/[0.07] bg-white/[0.02] p-10 backdrop-blur-sm lg:sticky lg:flex xl:p-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(255_77_141/0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(139_92_246/0.16),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Logo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 max-w-xl [@media(max-height:820px)]:mt-6"
      >
        <h2 className="text-[52px] leading-[1.02] font-semibold tracking-[-0.045em] text-white xl:text-[64px] [@media(max-height:820px)]:text-[44px]">
          Every great night
          <br />
          starts with a <RotatingWord words={categories} />
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/55 [@media(max-height:820px)]:mt-3">
          Discover live events near you, lock in the best seats and keep every ticket in one place.
        </p>
      </motion.div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="scale-90 xl:scale-100 [@media(max-height:760px)]:scale-[0.62] [@media(max-height:900px)]:scale-[0.78]">
          <TicketStack pointerX={pointerX} pointerY={pointerY} />
        </div>
      </div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60"
      >
        {highlights.map(({ icon: Icon, label }) => (
          <li key={label} className="inline-flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
              <Icon className="size-3.5 text-white/80" aria-hidden />
            </span>
            {label}
          </li>
        ))}
      </motion.ul>

      <div
        aria-hidden
        className="relative -mx-10 mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)] xl:-mx-12"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 pr-10 text-4xl font-semibold tracking-tight text-outline"
            >
              {item}
              <span className="size-2 rounded-full bg-white/15" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
