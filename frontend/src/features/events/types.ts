// Mirrors event-service DTOs (com.bookmyevent.event_service.responseDto).

export type EventCategory = 'STANDUP' | 'CONCERT' | 'WEBINAR' | 'JAMMING' | 'FESTIVAL'

export type TicketTier = 'VIP' | 'PREMIUM' | 'GENERAL'

export interface Artist {
  id: number
  stageName: string
  genre: string
  bio?: string
  imageUrl?: string
  country?: string
}

export interface TicketType {
  type: TicketTier
  price: number
  seatCount: number
  availableSeatCount: number
}

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

export interface EventSummary {
  id: number
  name: string
  artists: Artist[]
  ticketTypes: TicketType[]
  eventCategory: EventCategory
  venue: Venue | null
  /** Same as `venue.address.city`; null when the venue has no address. */
  city: string | null
  /** Local date-time without offset, e.g. `2026-11-14T19:30:00`. */
  startDateTime: string
  endDateTime: string
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED'
  organizerId?: number
  description: string
  createdAt?: string
}
