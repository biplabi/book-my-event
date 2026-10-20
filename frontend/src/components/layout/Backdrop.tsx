/** Full-viewport backdrop: flat ink with a film-grain overlay and a soft vignette. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(242_237_228/0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay" />
    </div>
  )
}
