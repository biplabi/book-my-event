import { createBrowserRouter, Navigate } from 'react-router'
import { FullScreenLoader } from '@/components/layout/FullScreenLoader'
import { paths } from '@/config/routes'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './routes/guards'

// Each page is its own chunk, downloaded the first time its route is visited, so customers
// never load the admin pages. The guards stay in the main bundle and run before any download.
export const router = createBrowserRouter([
  {
    // Shown while the first page's chunk downloads.
    hydrateFallbackElement: <FullScreenLoader />,
    children: [
      { path: paths.root, element: <Navigate to={paths.login} replace /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            // One layout route for both modes so switching animates instead of remounting.
            lazy: () => import('@/pages/AuthPage').then((m) => ({ Component: m.AuthPage })),
            children: [{ path: paths.login }, { path: paths.register }],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: paths.home,
            lazy: () => import('@/pages/HomePage').then((m) => ({ Component: m.HomePage })),
          },
          {
            path: paths.event,
            lazy: () =>
              import('@/pages/EventDetailsPage').then((m) => ({ Component: m.EventDetailsPage })),
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: paths.admin,
            lazy: () =>
              import('@/features/admin/components/AdminLayout').then((m) => ({
                Component: m.AdminLayout,
              })),
            children: [
              { index: true, element: <Navigate to={paths.adminEvents} replace /> },
              {
                path: paths.adminEvents,
                lazy: () =>
                  import('@/features/admin/pages/AdminEventsPage').then((m) => ({
                    Component: m.AdminEventsPage,
                  })),
              },
              {
                path: paths.adminNewEvent,
                lazy: () =>
                  import('@/features/admin/pages/AdminNewEventPage').then((m) => ({
                    Component: m.AdminNewEventPage,
                  })),
              },
              {
                path: paths.adminEvent,
                lazy: () =>
                  import('@/features/admin/pages/AdminEventDetailsPage').then((m) => ({
                    Component: m.AdminEventDetailsPage,
                  })),
              },
              {
                path: paths.adminVenues,
                lazy: () =>
                  import('@/features/admin/pages/AdminVenuesPage').then((m) => ({
                    Component: m.AdminVenuesPage,
                  })),
              },
              {
                path: paths.adminArtists,
                lazy: () =>
                  import('@/features/admin/pages/AdminArtistsPage').then((m) => ({
                    Component: m.AdminArtistsPage,
                  })),
              },
              {
                path: paths.adminArtist,
                lazy: () =>
                  import('@/features/admin/pages/AdminArtistDetailsPage').then((m) => ({
                    Component: m.AdminArtistDetailsPage,
                  })),
              },
              {
                path: paths.adminBookings,
                lazy: () =>
                  import('@/features/admin/pages/AdminBookingsPage').then((m) => ({
                    Component: m.AdminBookingsPage,
                  })),
              },
              {
                path: paths.adminUsers,
                lazy: () =>
                  import('@/features/admin/pages/AdminUsersPage').then((m) => ({
                    Component: m.AdminUsersPage,
                  })),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
