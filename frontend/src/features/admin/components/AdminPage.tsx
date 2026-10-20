import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { ResourceState } from '@/hooks/useResource'
import { ApiError } from '@/lib/api-client'
import { describeAdminError } from '../utils/errors'

/** Page title row: serif heading, mono count, and optional actions on the right. */
export function AdminPageHeader({
  title,
  count,
  description,
  actions,
}: {
  title: string
  count?: number
  description?: string
  actions?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="flex items-baseline gap-3 font-display text-[44px] leading-none text-paper">
          {title}
          {count !== undefined && (
            <span className="font-mono text-sm text-paper/35 tabular-nums">{count}</span>
          )}
        </h1>
        {description && <p className="mt-2 text-sm text-paper/50">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  )
}

/** Renders loading / error states for a `useResource` result, children once loaded. */
export function ResourceView<T>({
  resource,
  children,
}: {
  resource: ResourceState<T> & { reload?: () => void }
  children: (data: T) => ReactNode
}) {
  if (resource.status === 'loading') {
    return (
      <div className="grid place-items-center py-24 text-paper/40" role="status">
        <Spinner className="size-6" />
      </div>
    )
  }
  if (resource.status === 'error') {
    return (
      <Alert
        tone={
          resource.error instanceof ApiError && resource.error.isNetworkError ? 'offline' : 'error'
        }
        action={
          resource.reload && (
            <Button variant="secondary" onClick={resource.reload} className="h-9 px-3 text-sm">
              <RefreshCw className="size-4" aria-hidden />
              Try again
            </Button>
          )
        }
      >
        {describeAdminError(resource.error)}
      </Alert>
    )
  }
  return <>{children(resource.data)}</>
}

/** Bordered, horizontally scrollable shell for admin tables. */
export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-paper/10 bg-ink-900">
      <table className="w-full min-w-[760px] text-left text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={`border-b border-paper/10 px-4 py-3 font-mono text-[10.5px] font-normal tracking-[0.12em] text-paper/40 uppercase ${className ?? ''}`}
    >
      {children}
    </th>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center text-paper/45">
        {children}
      </td>
    </tr>
  )
}
