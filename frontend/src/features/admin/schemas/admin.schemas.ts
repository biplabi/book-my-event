import { z } from 'zod'

// Number inputs stay strings in the form (so they can be empty) and are converted on submit.
// Rules mirror the event-service request DTOs so most mistakes are caught before a round trip.

const required = (label: string) => z.string().trim().min(1, `${label} is required`)

const wholeNumber = (label: string) =>
  required(label).refine(
    (v) => /^\d+$/.test(v) && Number(v) > 0,
    `${label} must be a whole number above 0`,
  )

const money = required('Price').refine(
  (v) => /^\d+(\.\d{1,2})?$/.test(v),
  'Enter a price like 499 or 499.50',
)

export const ticketTiers = ['GENERAL', 'PREMIUM', 'VIP'] as const

export const eventSchema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(120),
    eventCategory: required('Category'),
    description: z.string().trim().min(10, 'Add a short description (10+ characters)'),
    venueId: required('Venue'),
    artistIds: z.array(z.number()),
    startDateTime: required('Start').refine(
      (v) => new Date(v) > new Date(),
      'Start must be in the future',
    ),
    endDateTime: required('End'),
    ticketTypes: z
      .array(z.object({ type: z.enum(ticketTiers), price: money, seatCount: wholeNumber('Seats') }))
      .min(1, 'Add at least one ticket type'),
    publishNow: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.startDateTime && v.endDateTime && v.endDateTime <= v.startDateTime) {
      ctx.addIssue({ code: 'custom', path: ['endDateTime'], message: 'End must be after start' })
    }
    const seen = new Set<string>()
    v.ticketTypes.forEach((t, i) => {
      if (seen.has(t.type)) {
        ctx.addIssue({
          code: 'custom',
          path: ['ticketTypes', i, 'type'],
          message: 'Each ticket type can only be used once',
        })
      }
      seen.add(t.type)
    })
  })
export type EventFormValues = z.infer<typeof eventSchema>

export const venueSchema = z.object({
  name: required('Name'),
  seatCapacity: wholeNumber('Capacity'),
  street: required('Street'),
  city: required('City'),
  pinCode: required('PIN code').regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  country: required('Country'),
})
export type VenueFormValues = z.infer<typeof venueSchema>

// Limits match the artists table: bio varchar(1000), the rest varchar(255).
// The photo is a File picked outside the form, checked by validateArtistImage.
export const artistSchema = z.object({
  stageName: required('Stage name').max(255, 'Stage name must be at most 255 characters'),
  genre: required('Genre').max(255, 'Genre must be at most 255 characters'),
  country: z.string().trim().max(255, 'Country must be at most 255 characters'),
  bio: z.string().trim().max(1000, 'Keep the bio under 1000 characters'),
})
export type ArtistFormValues = z.infer<typeof artistSchema>

// Mirror ImageUploadRequestDto in event-service.
export const artistImageTypes = ['image/jpeg', 'image/png', 'image/webp']
export const artistImageMaxBytes = 5 * 1024 * 1024

/** Error message for an unacceptable photo, or null when it's fine. */
export function validateArtistImage(file: File) {
  if (!artistImageTypes.includes(file.type)) return 'Choose a JPEG, PNG or WebP image'
  if (file.size > artistImageMaxBytes) return 'Image must be at most 5 MB'
  return null
}
