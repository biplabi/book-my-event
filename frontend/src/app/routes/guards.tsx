import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { FullScreenLoader } from '@/components/layout/FullScreenLoader'
import { paths } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'

type LocationState = { from?: string } | null

/** Only signed-in users; others go to /login and come back afterwards. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  return children
}

/** Only signed-out users; signed-in users are sent on to where they were headed. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'authenticated') {
    const from = (location.state as LocationState)?.from
    return <Navigate to={from ?? paths.home} replace />
  }
  return children
}
