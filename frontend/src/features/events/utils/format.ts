import type { EventSummary } from '../types'

const dayFormat = new Intl.DateTimeFormat(undefined, { day: '2-digit' })
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const priceFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Backend sends local date-times without an offset, which `Date` parses as local time. */
export function formatEventDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return {
    day: dayFormat.format(d),
    month: monthFormat.format(d),
    weekday: weekdayFormat.format(d),
    time: timeFormat.format(d),
  }
}

export function formatPrice(amount: number) {
  return priceFormat.format(amount)
}

export function lowestPrice(event: EventSummary) {
  const prices = event.ticketTypes.map((t) => Number(t.price)).filter(Number.isFinite)
  return prices.length ? Math.min(...prices) : null
}

export function seatsLeft(event: EventSummary) {
  return event.ticketTypes.reduce((sum, t) => sum + (t.availableSeatCount ?? 0), 0)
}

export function byStartDate(a: EventSummary, b: EventSummary) {
  return a.startDateTime.localeCompare(b.startDateTime)
}
