import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { TicketCard, type ShowcaseTicket } from './TicketCard'

const tickets: ShowcaseTicket[] = [
  {
    category: 'FESTIVAL',
    title: 'Monsoon Beats Festival',
    date: 'Sat, 12 Dec',
    time: '4:00 PM',
    venue: 'Riverside',
    tier: 'GENERAL',
    price: '₹1,499',
    seat: 'GA',
    tone: 'ink',
  },
  {
    category: 'STANDUP',
    title: 'Late Night Laughs',
    date: 'Fri, 20 Nov',
    time: '9:30 PM',
    venue: 'The Loft',
    tier: 'PREMIUM',
    price: '₹899',
    seat: 'C-07',
    tone: 'brand',
  },
  {
    category: 'CONCERT',
    title: 'Neon Skyline Live',
    date: 'Sat, 14 Nov',
    time: '8:00 PM',
    venue: 'Arena One',
    tier: 'VIP',
    price: '₹4,999',
    seat: 'A-12',
    tone: 'paper',
  },
]

// Back-to-front placement. `z` drives the parallax when the stack tilts.
const layout = [
  { x: -86, y: 26, rotate: -11, z: -60, bob: 7.5 },
  { x: 74, y: 8, rotate: 9, z: -20, bob: 6.5 },
  { x: -4, y: -14, rotate: -2, z: 40, bob: 5.8 },
]

interface TicketStackProps {
  /** Pointer position over the parent, normalised to [-0.5, 0.5]. */
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
}

export function TicketStack({ pointerX, pointerY }: TicketStackProps) {
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 90,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), {
    stiffness: 90,
    damping: 18,
  })

  return (
    <div className="relative h-[400px] w-[460px] [perspective:1400px]" aria-hidden>
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        {tickets.map((ticket, i) => {
          const pos = layout[i]!
          return (
            <motion.div
              key={ticket.title}
              className="absolute top-1/2 left-1/2 -mt-[165px] -ml-[145px] [transform-style:preserve-3d]"
              initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.9 }}
              animate={{ opacity: 1, y: pos.y, x: pos.x, rotate: pos.rotate, scale: 1, z: pos.z }}
              transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 70, damping: 14 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: pos.bob,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.8,
                }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
