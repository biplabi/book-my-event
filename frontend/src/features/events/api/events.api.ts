import { apiRequest } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api'
import type { EventSummary } from '../types'

// Requests go through the dev-server proxy, which strips `/event-service`.
// The trailing slash matters: event-service maps `/event/`, not `/event`.
const BASE = '/event-service'

export const eventsApi = {
  async list(token: string, signal?: AbortSignal) {
    const res = await apiRequest<ApiResponse<EventSummary[]>>(`${BASE}/event/`, { token, signal })
    return res.data
  },

  async get(token: string, id: number, signal?: AbortSignal) {
    const res = await apiRequest<ApiResponse<EventSummary>>(`${BASE}/event/${id}`, {
      token,
      signal,
    })
    return res.data
  },
}
