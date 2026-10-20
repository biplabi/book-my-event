import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Backdrop } from '@/components/layout/Backdrop'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { EventCatalogue } from '@/features/events/components/EventCatalogue'

const ease = [0.22, 1, 0.36, 1] as const

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

/** Slides a word up from behind a mask. The padding gives italic descenders room. */
function RevealWord({ children, index }: { children: ReactNode; index: number }) {
  return (
    <span className="-mb-[0.14em] inline-block overflow-hidden pr-[0.06em] pb-[0.14em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.05 + index * 0.09, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function HomePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="relative min-h-dvh">
      <Backdrop />
      <title>Events · BookMyEvent</title>

      <SiteHeader />

      <main className="mx-auto max-w-screen-2xl px-4 pt-8 pb-16 sm:px-8 sm:pt-10 lg:px-12 xl:px-16">
        <h1 className="font-display text-[44px] leading-none tracking-[-0.02em] text-paper sm:text-[64px]">
          <RevealWord index={0}>What&apos;s</RevealWord> <RevealWord index={1}>on,</RevealWord>{' '}
          <RevealWord index={2}>
            <span className="text-brand italic">{user.firstName}</span>.
          </RevealWord>
        </h1>

        <motion.div {...fade(0.3)} className="mt-8">
          <EventCatalogue />
        </motion.div>
      </main>
    </div>
  )
}
