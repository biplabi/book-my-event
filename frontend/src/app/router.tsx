import { createBrowserRouter, Navigate } from 'react-router'
import { paths } from '@/config/routes'
import { AuthPage } from '@/pages/AuthPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedRoute, PublicOnlyRoute } from './routes/guards'

export const router = createBrowserRouter([
  { path: paths.root, element: <Navigate to={paths.login} replace /> },
  {
    // One layout route for both modes so switching animates instead of remounting.
    element: (
      <PublicOnlyRoute>
        <AuthPage />
      </PublicOnlyRoute>
    ),
    children: [{ path: paths.login }, { path: paths.register }],
  },
  {
    path: paths.home,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])
