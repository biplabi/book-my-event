import type { UserProfile } from '@/features/auth/types'
import type { Artist, EventSummary } from '@/features/events/types'
import { apiRequest } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api'
import type {
  Booking,
  CreateArtistRequest,
  CreateEventRequest,
  CreateVenueRequest,
  EventStatus,
  Venue,
} from '../types'

// Paths go through the dev-server proxies (see vite.config.ts). event-service maps its
// collections with a trailing slash (`/event/`), booking-service without (`/booking`).
const EVENTS = '/event-service'
const BOOKINGS = '/booking-service'

async function unwrap<T>(request: Promise<ApiResponse<T>>) {
  return (await request).data
}

// Each function is module-level so it's a stable `useResource` fetcher.
export const adminApi = {
  /** For admins, event-service returns events of every status. */
  listEvents: (token: string, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<EventSummary[]>>(`${EVENTS}/event/`, { token, signal })),

  createEvent: (token: string, body: CreateEventRequest) =>
    unwrap(
      apiRequest<ApiResponse<EventSummary>>(`${EVENTS}/event/`, { method: 'POST', token, body }),
    ),

  updateEventStatus: (token: string, id: number, status: EventStatus) =>
    unwrap(
      apiRequest<ApiResponse<EventSummary>>(`${EVENTS}/event/${id}/status`, {
        method: 'PATCH',
        token,
        body: { status },
      }),
    ),

  listVenues: (token: string, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<Venue[]>>(`${EVENTS}/venue/`, { token, signal })),

  createVenue: (token: string, body: CreateVenueRequest) =>
    unwrap(apiRequest<ApiResponse<Venue>>(`${EVENTS}/venue/`, { method: 'POST', token, body })),

  listArtists: (token: string, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<Artist[]>>(`${EVENTS}/artist/`, { token, signal })),

  getArtist: (token: string, id: number, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<Artist>>(`${EVENTS}/artist/${id}`, { token, signal })),

  createArtist: (token: string, body: CreateArtistRequest) =>
    unwrap(apiRequest<ApiResponse<Artist>>(`${EVENTS}/artist/`, { method: 'POST', token, body })),

  listBookings: (token: string, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<Booking[]>>(`${BOOKINGS}/booking`, { token, signal })),

  listUsers: (token: string, signal?: AbortSignal) =>
    unwrap(apiRequest<ApiResponse<UserProfile[]>>('/api/admin/users', { token, signal })),
}
