interface JwtPayload {
  sub?: string
  exp?: number
  userId?: number
  roles?: string[]
}

/** Decodes the payload without verifying it — the services do verification. */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/** Milliseconds until the token expires; <= 0 when expired or unreadable. */
export function msUntilExpiry(token: string): number {
  const exp = decodeJwt(token)?.exp
  return exp ? exp * 1000 - Date.now() : 0
}
