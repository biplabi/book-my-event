import { motion } from 'framer-motion'
import { CalendarDays, LogOut, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Temporary landing page after sign-in, until the event catalogue is built. */
export function HomePage() {
  const { user, logout } = useAuth()
  if (!user) return null

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
  const details: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Mobile', value: String(user.phoneNumber) },
    { icon: CalendarDays, label: 'Date of birth', value: formatDate(user.dateOfBirth) },
    { icon: ShieldCheck, label: 'Role', value: user.role.replace(/^ROLE_/, '').toLowerCase() },
  ]

  return (
    <div className="relative min-h-dvh">
      <AuroraBackground />
      <title>Home · BookMyEvent</title>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand-gradient text-sm font-semibold">
            {initials}
          </span>
          <Button variant="ghost" onClick={logout} className="h-10 px-3 text-sm">
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16">
        <motion.p
          {...fade()}
          className="text-sm font-medium tracking-[0.2em] text-white/40 uppercase"
        >
          You&apos;re signed in
        </motion.p>
        <motion.h1
          {...fade(0.05)}
          className="mt-3 text-5xl font-semibold tracking-[-0.045em] sm:text-7xl"
        >
          Hey {user.firstName},{' '}
          <span className="animate-gradient-pan text-gradient font-display font-normal italic">
            welcome in.
          </span>
        </motion.h1>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <motion.section
            {...fade(0.15)}
            className="glow-border rounded-[28px] bg-ink-900/70 p-7 backdrop-blur-2xl"
          >
            <h2 className="text-lg font-semibold tracking-tight">Your profile</h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-white/10">
                    <Icon className="size-4 text-white/70" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs tracking-wide text-white/40 uppercase">{label}</dt>
                    <dd className="mt-0.5 truncate font-medium text-white/90 capitalize first-letter:uppercase">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </motion.section>

          <motion.section
            {...fade(0.25)}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-7"
          >
            <div className="absolute -top-20 -right-16 size-56 rounded-full bg-violet/30 blur-3xl" />
            <Sparkles className="relative size-6 text-amber" aria-hidden />
            <h2 className="relative mt-4 text-lg font-semibold tracking-tight">
              Events are on the way
            </h2>
            <p className="relative mt-2 text-sm leading-relaxed text-white/55">
              Browsing concerts, stand-up and festivals, and booking seats, is the next thing
              we&apos;re building.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
