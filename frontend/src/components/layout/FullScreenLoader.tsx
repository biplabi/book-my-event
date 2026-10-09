import { motion } from 'framer-motion'
import { LogoMark } from '@/components/brand/Logo'

export function FullScreenLoader() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-ink-950"
      role="status"
      aria-label="Loading"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LogoMark className="size-14" />
      </motion.div>
    </div>
  )
}
