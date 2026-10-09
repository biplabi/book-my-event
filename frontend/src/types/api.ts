/** Envelope every Spring service wraps successful responses in. */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/** Body of errors handled by a service's GlobalExceptionHandler. */
export interface ApiErrorBody {
  statusCode: number
  success: false
  message: string
  apiPath: string
}
