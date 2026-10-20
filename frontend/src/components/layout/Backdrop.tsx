import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

/** Full-viewport animated backdrop: drifting colour blobs, grid, grain and a cursor spotlight. */
export function AuroraBackground() {
  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)
  const x = useSpring(rawX, { stiffness: 120, damping: 25, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 120, damping: 25, mass: 0.6 })
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${x}px ${y}px, rgb(139 92 246 / 0.13), transparent 65%)`

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute -top-[20%] -left-[10%] size-[60vmax] animate-drift-a rounded-full bg-rose/25 blur-[120px]" />
      <div className="absolute top-[10%] -right-[15%] size-[55vmax] animate-drift-b rounded-full bg-violet/30 blur-[130px]" />
      <div className="absolute -bottom-[25%] left-[20%] size-[50vmax] animate-drift-c rounded-full bg-amber/15 blur-[140px]" />

      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_100%)]" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(7_6_11/0.85)_100%)]" />
    </div>
  )
}
