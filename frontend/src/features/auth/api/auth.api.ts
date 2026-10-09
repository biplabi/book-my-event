import { apiRequest } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
} from '../types'

export const authApi = {
  async login(body: LoginRequest) {
    const res = await apiRequest<ApiResponse<LoginResponse>>('/api/auth/login', {
      method: 'POST',
      body,
    })
    return res.data
  },

  async register(body: RegisterRequest) {
    const res = await apiRequest<ApiResponse<RegisterResponse>>('/api/auth/register', {
      method: 'POST',
      body,
    })
    return res.data
  },

  /** `/api/user/me` returns the profile directly, not wrapped in ApiResponse. */
  me(token: string, signal?: AbortSignal) {
    return apiRequest<UserProfile>('/api/user/me', { token, signal })
  },
}
