export const paths = {
  root: '/',
  login: '/login',
  register: '/register',
  home: '/home',
  event: '/events/:id',
  admin: '/admin',
  adminEvents: '/admin/events',
  adminNewEvent: '/admin/events/new',
  adminVenues: '/admin/venues',
  adminArtists: '/admin/artists',
  adminArtist: '/admin/artists/:id',
  adminBookings: '/admin/bookings',
  adminUsers: '/admin/users',
} as const

export const eventPath = (id: number | string) => `/events/${id}`
export const adminArtistPath = (id: number | string) => `/admin/artists/${id}`
