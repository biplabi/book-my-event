import { apiRequest } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api'
import type { EventSummary } from '../types'

// Requests go through the dev-server proxy, which strips `/event-service`.
// These public endpoints only return published events.
const BASE = '/event-service'

export const eventsApi = {
  async list(token: string, signal?: AbortSignal) {
    const res = await apiRequest<ApiResponse<EventSummary[]>>(`${BASE}/events`, { token, signal })
    return res.data
  },

  async get(token: string, id: number, signal?: AbortSignal) {
    const res = await apiRequest<ApiResponse<EventSummary>>(`${BASE}/events/${id}`, {
      token,
      signal,
    })
    return res.data
  },
}
