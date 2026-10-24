import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { EventSummary } from '@/features/events/types'
import { cn } from '@/lib/cn'
import { adminApi } from '../api/admin.api'
import type { EventStatus } from '../types'
import { describeAdminError } from '../utils/errors'
import { ConfirmButton } from './ConfirmButton'

/**
 * Publish / Unpublish / Cancel for one event, whichever its status allows.
 * Completed and cancelled events can't change, so they get no buttons.
 */
export function EventStatusActions({
  event,
  onUpdated,
  className,
}: {
  event: EventSummary
  onUpdated: (event: EventSummary) => void
  className?: string
}) {
  const { token } = useAuth()

  const setStatus = async (status: EventStatus, verb: string) => {
    if (!token) return
    try {
      onUpdated(await adminApi.updateEventStatus(token, event.id, status))
      toast.success(`${event.name} ${verb}.`)
    } catch (err) {
      toast.error(describeAdminError(err))
    }
  }

  return (
    <div className={cn('flex gap-1.5', className)}>
      {event.status === 'DRAFT' && (
        <ConfirmButton instant onConfirm={() => setStatus('PUBLISHED', 'is live')}>
          Publish
        </ConfirmButton>
      )}
      {event.status === 'PUBLISHED' && (
        <ConfirmButton
          confirmLabel="Unpublish?"
          onConfirm={() => setStatus('DRAFT', 'moved back to drafts')}
        >
          Unpublish
        </ConfirmButton>
      )}
      {(event.status === 'DRAFT' || event.status === 'PUBLISHED') && (
        <ConfirmButton
          tone="danger"
          confirmLabel="Cancel event?"
          onConfirm={() => setStatus('CANCELLED', 'was cancelled')}
        >
          Cancel
        </ConfirmButton>
      )}
    </div>
  )
}
