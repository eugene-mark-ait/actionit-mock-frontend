/**
 * Authenticated fetch for backend APIs (API Gateway).
 *
 * ASSUMPTIONS:
 * - Access token is a JWT or opaque Bearer token stored in auth_session.
 * - Backends may ignore Authorization until authorizers are enabled; user_id query/body stays for compatibility.
 * - Optional x-api-key from NEXT_PUBLIC_API_GATEWAY_KEY or NEXT_PUBLIC_LAMBDA_OAUTH_API_KEY when calling execute-api hosts.
 * - Refresh: POST /api/auth/refresh with { refresh_token } returns new OAuthTokens shape (same as Route Handler).
 */

import {
  patchAuthSessionTokens,
  readAuthSession,
  readAuthSessionIncludingExpired,
  clearAuthSessionStorage,
  clearAuthPresenceCookie,
} from '@/lib/auth-session'

function getOptionalApiGatewayKey(): string | undefined {
  if (typeof process === 'undefined') return undefined
  const k =
    process.env.NEXT_PUBLIC_API_GATEWAY_KEY?.trim() ||
    process.env.NEXT_PUBLIC_LAMBDA_OAUTH_API_KEY?.trim()
  return k || undefined
}

function toUrlString(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url
  return String(input)
}

function shouldAttachApiKey(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname.includes('amazonaws.com')
  } catch {
    return false
  }
}

function bearerAllowed(token: string): boolean {
  const t = token.trim()
  if (!t || t === 'demo-local') return false
  return true
}

async function refreshViaNextRoute(): Promise<boolean> {
  const session = readAuthSessionIncludingExpired()
  if (!session?.refresh_token?.trim()) return false

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })

    const data = (await res.json().catch(() => ({}))) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
    }

    if (!res.ok || !data.access_token) return false

    const ttl =
      typeof data.expires_in === 'number' && data.expires_in > 0
        ? data.expires_in * 1000
        : 3_600_000

    patchAuthSessionTokens(
      data.access_token,
      data.refresh_token ?? session.refresh_token,
      ttl,
    )
    return true
  } catch {
    return false
  }
}

/**
 * Fetch with Authorization + optional API Gateway key. Retries once after refresh on 401.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)

  const session = readAuthSession()
  const token = session?.access_token
  if (token && bearerAllowed(token)) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const key = getOptionalApiGatewayKey()
  const urlStr = toUrlString(input)
  if (key && shouldAttachApiKey(urlStr)) {
    headers.set('x-api-key', key)
  }

  if (!headers.has('Content-Type') && init.body != null && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  let response = await fetch(input, { ...init, headers })

  if (response.status === 401 && session?.refresh_token) {
    const ok = await refreshViaNextRoute()
    if (ok) {
      const h2 = new Headers(init.headers)
      const session2 = readAuthSession()
      const t2 = session2?.access_token
      if (t2 && bearerAllowed(t2)) {
        h2.set('Authorization', `Bearer ${t2}`)
      }
      if (key && shouldAttachApiKey(urlStr)) {
        h2.set('x-api-key', key)
      }
      response = await fetch(input, { ...init, headers: h2 })
    }
  }

  return response
}

/** Clears auth and returns false so callers can redirect to login */
export function forceLogoutClient(): void {
  clearAuthSessionStorage()
  clearAuthPresenceCookie()
}
