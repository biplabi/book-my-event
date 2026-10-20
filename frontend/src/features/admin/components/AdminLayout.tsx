import { motion } from 'framer-motion'
import { ArrowLeft, Building2, CalendarDays, LogOut, Mic2, Ticket, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { Backdrop } from '@/components/layout/Backdrop'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/cn'

const nav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: paths.adminEvents, label: 'Events', icon: CalendarDays },
  { to: paths.adminVenues, label: 'Venues', icon: Building2 },
  { to: paths.adminArtists, label: 'Artists', icon: Mic2 },
  { to: paths.adminBookings, label: 'Bookings', icon: Ticket },
  { to: paths.adminUsers, label: 'Users', icon: Users },
]

function NavItems({ layoutId, className }: { layoutId: string; className?: string }) {
  return (
    <nav aria-label="Admin" className={className}>
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'relative flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200',
              isActive ? 'text-ink-950' : 'text-paper/60 hover:text-paper',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-xl bg-paper"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <Icon className="relative size-4" aria-hidden />
              <span className="relative">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** Shell for /admin/*: sidebar on desktop, a scrollable tab row on small screens. */
export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <Backdrop />
      <title>Admin · BookMyEvent</title>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-paper/10 px-4 py-5 lg:flex">
        <div className="flex items-center justify-between px-2">
          <Logo />
        </div>
        <p className="mt-8 px-3 label-mono text-paper/35">Admin</p>
        <NavItems layoutId="admin-nav-desktop" className="mt-3 flex flex-col gap-1" />

        <div className="mt-auto space-y-1 border-t border-paper/10 pt-4">
          <NavLink
            to={paths.home}
            className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-paper/60 transition hover:bg-paper/[0.05] hover:text-paper"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to site
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-paper/60 transition hover:bg-paper/[0.05] hover:text-paper"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
          {user && (
            <p className="truncate px-3 pt-2 font-mono text-[11px] text-paper/35">{user.email}</p>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile top bar */}
        <header className="border-b border-paper/10 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3 sm:px-8">
            <Logo />
            <NavLink to={paths.home} className="text-sm text-paper/60 hover:text-paper">
              Back to site
            </NavLink>
          </div>
          <NavItems
            layoutId="admin-nav-mobile"
            className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 pb-3 sm:px-8"
          />
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-screen-2xl px-4 pt-8 pb-16 sm:px-8 lg:px-12 lg:pt-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
