import { Guitar, Mic, Music, PartyPopper, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { EventCategory } from '../types'

export interface CategoryMeta {
  /** Plural, for filters and section headings. */
  label: string
  /** Singular, for a single event's badge. */
  name: string
  icon: LucideIcon
}

/** Display order matches the backend enum. */
export const categories: Record<EventCategory, CategoryMeta> = {
  STANDUP: { label: 'Stand-up', name: 'Stand-up', icon: Mic },
  CONCERT: { label: 'Concerts', name: 'Concert', icon: Music },
  WEBINAR: { label: 'Webinars', name: 'Webinar', icon: Video },
  JAMMING: { label: 'Jamming', name: 'Jam session', icon: Guitar },
  FESTIVAL: { label: 'Festivals', name: 'Festival', icon: PartyPopper },
}

export const categoryOrder = Object.keys(categories) as EventCategory[]
