import { useResource } from '@/hooks/useResource'
import { eventsApi } from '../api/events.api'

export function useEvents() {
  const resource = useResource(eventsApi.list)
  const retry = resource.reload
  if (resource.status === 'success') {
    // Admins get every status from the API; the public listing only ever shows live events.
    const events = (resource.data ?? []).filter((e) => e.status === 'PUBLISHED')
    return { status: 'success' as const, events, retry }
  }
  if (resource.status === 'error') return { status: 'error' as const, error: resource.error, retry }
  return { status: 'loading' as const, retry }
}
