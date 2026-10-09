import { env } from '@/config/env'

/** Error raised for any non-2xx response or network failure. `status` is 0 when the request never reached a server. */
export class ApiError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  get isNetworkError() {
    return this.status === 0 || this.status === 502 || this.status === 503 || this.status === 504
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function messageFrom(data: unknown, fallback: string) {
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return fallback
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal } = options
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'Unable to reach the server.')
  }

  const data = await parseBody(res)
  if (!res.ok) {
    throw new ApiError(res.status, messageFrom(data, res.statusText || 'Request failed'), data)
  }
  return data as T
}
