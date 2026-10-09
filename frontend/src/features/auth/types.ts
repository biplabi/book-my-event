// Mirrors user-service DTOs (com.bookmyevent.user_service.requestDto / responseDto).

export interface LoginRequest {
  email: string
  password: string
}

/** user-service currently only fills `token`; the other fields are null and omitted. */
export interface LoginResponse {
  token: string
  id?: number
  firstName?: string
  email?: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  phoneNumber: number
  email: string
  password: string
  /** ISO date, `YYYY-MM-DD`. */
  dateOfBirth: string
}

export interface RegisterResponse {
  id: number
  firstName: string
  email: string
}

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  phoneNumber: number
  email: string
  dateOfBirth: string
  role: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
}
