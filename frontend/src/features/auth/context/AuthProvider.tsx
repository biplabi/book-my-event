import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { storage } from '@/lib/storage'
import { authApi } from '../api/auth.api'
import type { LoginRequest, RegisterRequest, UserProfile } from '../types'
import { msUntilExpiry } from '../utils/jwt'
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

const TOKEN_KEY = 'bme.token'

function readStoredToken() {
  const token = storage.get(TOKEN_KEY)
  if (token && msUntilExpiry(token) > 0) return token
  if (token) storage.remove(TOKEN_KEY)
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>(token ? 'loading' : 'unauthenticated')

  const logout = useCallback(() => {
    storage.remove(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  // Restore the session from a stored token on first load.
  useEffect(() => {
    if (!token || user) return
    const controller = new AbortController()
    authApi
      .me(token, controller.signal)
      .then((profile) => {
        setUser(profile)
        setStatus('authenticated')
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        logout()
      })
    return () => controller.abort()
  }, [token, user, logout])

  // Sign out the moment the JWT expires.
  useEffect(() => {
    if (!token) return
    const timer = window.setTimeout(logout, Math.max(msUntilExpiry(token), 0))
    return () => window.clearTimeout(timer)
  }, [token, logout])

  const login = useCallback(async (credentials: LoginRequest) => {
    const { token: newToken } = await authApi.login(credentials)
    const profile = await authApi.me(newToken)
    storage.set(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(profile)
    setStatus('authenticated')
    return profile
  }, [])

  const register = useCallback((details: RegisterRequest) => authApi.register(details), [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, token, login, register, logout }),
    [status, user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
