import { LayoutDashboard, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'

/** Top bar for signed-in customer pages: logo home link, admin shortcut, initials and sign out. */
export function SiteHeader() {
  const { user, logout } = useAuth()
  if (!user) return null

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  return (
    <header className="border-b border-paper/10">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12 xl:px-16">
        <Link to={paths.home} aria-label="BookMyEvent home" className="rounded-lg">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {user.role === 'ROLE_ADMIN' && (
            <Link
              to={paths.adminEvents}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-paper/15 px-3.5 text-sm text-paper/80 transition hover:border-paper/35 hover:text-paper"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <span
            className="grid size-9 place-items-center rounded-full border border-paper/20 font-mono text-xs text-paper/80"
            title={`${user.firstName} ${user.lastName}`}
          >
            {initials}
          </span>
          <Button variant="ghost" onClick={logout} className="h-9 px-3 text-sm">
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
