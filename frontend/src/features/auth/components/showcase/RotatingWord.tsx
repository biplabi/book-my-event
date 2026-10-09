import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RotatingWordProps {
  words: readonly string[]
  intervalMs?: number
}

export function RotatingWord({ words, intervalMs = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs)
    return () => window.clearInterval(id)
  }, [words.length, intervalMs])

  return (
    <span className="relative inline-grid overflow-hidden pb-[0.12em] align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: '70%', opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 animate-gradient-pan text-gradient pr-[0.08em] font-display italic"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
