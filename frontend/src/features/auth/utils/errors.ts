import { ApiError } from '@/lib/api-client'

export type AuthErrorCode =
  'NOT_REGISTERED' | 'BAD_CREDENTIALS' | 'ALREADY_EXISTS' | 'INVALID' | 'UNREACHABLE' | 'UNKNOWN'

export interface AuthErrorInfo {
  code: AuthErrorCode
  message: string
}

const unreachable: AuthErrorInfo = {
  code: 'UNREACHABLE',
  message: "We can't reach our servers right now. Please try again in a moment.",
}

const unknown: AuthErrorInfo = {
  code: 'UNKNOWN',
  message: 'Something went wrong on our side. Please try again.',
}

// Status mapping reflects how user-service actually responds today:
//  - unknown email          -> 404 "User is not registered!"
//  - wrong password         -> 403 (BadCredentialsException hits the default entry point)
//  - duplicate registration -> 404 "User already exists!"
//  - bean-validation errors -> 403 (forwarded to /error, which requires auth)

export function describeLoginError(err: unknown): AuthErrorInfo {
  if (!(err instanceof ApiError)) return unknown
  if (err.isNetworkError) return unreachable
  if (err.status === 404) {
    return { code: 'NOT_REGISTERED', message: "We couldn't find an account with that email." }
  }
  if (err.status === 401 || err.status === 403) {
    return { code: 'BAD_CREDENTIALS', message: 'That password is incorrect. Please try again.' }
  }
  return unknown
}

export function describeRegisterError(err: unknown): AuthErrorInfo {
  if (!(err instanceof ApiError)) return unknown
  if (err.isNetworkError) return unreachable
  if (err.status === 409 || (err.status === 404 && /already exists/i.test(err.message))) {
    return { code: 'ALREADY_EXISTS', message: 'An account with this email already exists.' }
  }
  if (err.status === 400 || err.status === 403) {
    return {
      code: 'INVALID',
      message: 'Some details were rejected. Please review them and try again.',
    }
  }
  return unknown
}
