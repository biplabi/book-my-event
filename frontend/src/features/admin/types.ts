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
  imageUrl?: string
  country?: string
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
