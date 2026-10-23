// Mirrors the admin-facing DTOs of event-, booking- and user-service.
import type { EventCategory, EventSummary, TicketTier } from '@/features/events/types'

export type EventStatus = EventSummary['status']

export interface Address {
  street: string
  city: string
  pinCode: string
  country: string
}

export interface Venue {
  id: number
  name: string
  seatCapacity: number
  address: Address | null
  createdAt?: string
}

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

/** Body of PUT /artist/{id}. Every field is replaced; the photo is kept unless changed. */
export interface UpdateArtistRequest extends CreateArtistRequest {
  /** Drop the current photo. Ignored when `imageKey` is set. */
  removeImage?: boolean
}

/** Response of POST /artist/image-upload-url. */
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
