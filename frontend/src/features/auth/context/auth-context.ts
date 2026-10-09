import { createContext } from 'react'
import type { LoginRequest, RegisterRequest, RegisterResponse, UserProfile } from '../types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  status: AuthStatus
  user: UserProfile | null
  token: string | null
  login: (credentials: LoginRequest) => Promise<UserProfile>
  register: (details: RegisterRequest) => Promise<RegisterResponse>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
