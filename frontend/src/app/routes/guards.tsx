import { Navigate, Outlet, useLocation } from 'react-router'
import { FullScreenLoader } from '@/components/layout/FullScreenLoader'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'

type LocationState = { from?: string } | null

// Layout routes: each guards every route nested under it and renders it through <Outlet />.

/** Only signed-in users; others go to /login and come back afterwards. */
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** Only admins. Signed-out users go to /login; signed-in non-admins go home. */
export function AdminRoute() {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  if (user?.role !== 'ROLE_ADMIN') return <Navigate to={paths.home} replace />
  return <Outlet />
}

/** Only signed-out users; signed-in users are sent on to where they were headed. */
export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'authenticated') {
    const from = (location.state as LocationState)?.from
    return <Navigate to={from ?? paths.home} replace />
  }
  return <Outlet />
}
