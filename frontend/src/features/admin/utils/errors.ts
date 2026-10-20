import { ApiError } from '@/lib/api-client'

/** User-facing message for a failed admin API call. */
export function describeAdminError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return "Can't reach the server. Is the backend running?"
    if (error.status === 401 || error.status === 403) {
      return "You don't have admin access. If you were just made an admin, sign out and back in."
    }
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
