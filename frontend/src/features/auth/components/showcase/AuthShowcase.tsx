import { motion, useMotionValue } from 'framer-motion'
import type { PointerEvent } from 'react'
import { Logo } from '@/components/brand/Logo'
import { RotatingWord } from './RotatingWord'
import { TicketStack } from './TicketStack'

// Mirrors event-service's EventCategory enum.
const categories = ['concert', 'stand-up', 'festival', 'jam session', 'webinar'] as const

const highlights = ['Instant e-tickets', 'Secure checkout', 'Curated lineups']

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
      className="relative top-4 hidden h-[calc(100dvh-2rem)] min-h-[640px] flex-col self-start overflow-hidden rounded-[24px] border border-paper/10 bg-ink-900 p-10 lg:sticky lg:flex xl:p-12"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center justify-between"
      >
        <Logo />
        <span className="label-mono text-paper/40">Live events · India</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-12 max-w-xl [@media(max-height:820px)]:mt-6"
      >
        <h2 className="font-display text-[64px] leading-[0.95] tracking-[-0.02em] text-paper xl:text-[80px] [@media(max-height:820px)]:text-[52px]">
          Every great night
          <br />
          starts with a <RotatingWord words={categories} />
        </h2>
        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-paper/55 [@media(max-height:820px)]:mt-3">
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
        className="relative flex flex-wrap items-center gap-x-3 gap-y-2 label-mono text-paper/50"
      >
        {highlights.map((label, i) => (
          <li key={label} className="inline-flex items-center gap-3">
            {i > 0 && <span className="text-paper/20">/</span>}
            {label}
          </li>
        ))}
      </motion.ul>

      <div
        aria-hidden
        className="relative -mx-10 mt-6 overflow-hidden border-t border-paper/10 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)] pt-5 xl:-mx-12"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 pr-10 font-display text-5xl text-outline italic"
            >
              {item}
              <span className="size-1.5 rounded-full bg-brand/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
