// Mirrors the admin-facing DTOs of event-, booking- and user-service.
import type {
  Address,
  EventCategory,
  EventSummary,
  TicketTier,
  Venue,
} from '@/features/events/types'

export type EventStatus = EventSummary['status']

// Venues come back inside events too, so their types live with the events feature.
export type { Address, Venue }

export interface CreateVenueRequest {
  name: string
  seatCapacity: number
  /** event-service names this field `addressDto`. */
  addressDto: Address
}

export interface CreateArtistRequest {
  stageName: string
  genre: string
  bio?: string
  /** Key returned by `uploadArtistImage`, e.g. `artists/<uuid>.png`. */
  imageKey?: string
  country?: string
}

/**
 * Body of PUT /admin/artists/{id}. Fields left out keep their current value;
 * send `''` for `bio` or `country` to clear it.
 */
export interface UpdateArtistRequest extends Partial<CreateArtistRequest> {
  /** Drop the current photo. Ignored when `imageKey` is set. */
  removeImage?: boolean
}

/** Response of POST /admin/artists/image-upload-url. */
export interface ImageUploadTicket {
  /** Signed MinIO link; PUT the file here within a few minutes. */
  uploadUrl: string
  imageKey: string
  imageUrl: string
}

export interface CreateEventRequest {
  name: string
  eventCategory: EventCategory
  venueId: number
  artistIds: number[]
  /** Local date-time, `YYYY-MM-DDTHH:mm`. */
  startDateTime: string
  endDateTime: string
  description: string
  ticketTypes: { type: TicketTier; price: number; seatCount: number }[]
}

export type BookingStatus =
  'CREATED' | 'PAYMENT_PENDING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'CANCELLED' | 'REFUNDED'

export interface Booking {
  id: number
  userId: number
  eventId: number
  tickets: { ticketType: TicketTier; quantity: number; price: number | null }[]
  status: BookingStatus
  totalAmount: number
  paymentReference: string | null
  createdAt: string
}
