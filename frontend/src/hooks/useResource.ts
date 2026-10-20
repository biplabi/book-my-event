import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'

export type ResourceState<T> =
  { status: 'loading' } | { status: 'error'; error: unknown } | { status: 'success'; data: T }

/**
 * Loads an authenticated resource once the user has a token.
 * `fetcher` should be stable (a module-level API function), otherwise it refetches every render.
 * `setData` lets callers patch the cached value after a mutation without refetching.
 */
export function useResource<T>(fetcher: (token: string, signal: AbortSignal) => Promise<T>) {
  const { token } = useAuth()
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    fetcher(token, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({ status: 'error', error })
      })
    return () => controller.abort()
  }, [token, fetcher, attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  const setData = useCallback((update: (current: T) => T) => {
    setState((s) => (s.status === 'success' ? { status: 'success', data: update(s.data) } : s))
  }, [])

  return { ...state, reload, setData }
}
