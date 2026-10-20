import { createBrowserRouter, Navigate } from 'react-router'
import { paths } from '@/config/routes'
import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { AdminArtistDetailsPage } from '@/features/admin/pages/AdminArtistDetailsPage'
import { AdminArtistsPage } from '@/features/admin/pages/AdminArtistsPage'
import { AdminBookingsPage } from '@/features/admin/pages/AdminBookingsPage'
import { AdminEventsPage } from '@/features/admin/pages/AdminEventsPage'
import { AdminNewEventPage } from '@/features/admin/pages/AdminNewEventPage'
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage'
import { AdminVenuesPage } from '@/features/admin/pages/AdminVenuesPage'
import { AuthPage } from '@/pages/AuthPage'
import { EventDetailsPage } from '@/pages/EventDetailsPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './routes/guards'

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
  {
    path: paths.event,
    element: (
      <ProtectedRoute>
        <EventDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.admin,
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to={paths.adminEvents} replace /> },
      { path: paths.adminEvents, element: <AdminEventsPage /> },
      { path: paths.adminNewEvent, element: <AdminNewEventPage /> },
      { path: paths.adminVenues, element: <AdminVenuesPage /> },
      { path: paths.adminArtists, element: <AdminArtistsPage /> },
      { path: paths.adminArtist, element: <AdminArtistDetailsPage /> },
      { path: paths.adminBookings, element: <AdminBookingsPage /> },
      { path: paths.adminUsers, element: <AdminUsersPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
