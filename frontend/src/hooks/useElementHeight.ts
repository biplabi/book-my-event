import { useLayoutEffect, useRef, useState } from 'react'

/** Observes an element's rendered height so a parent can animate to it. */
export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry?.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, height] as const
}
