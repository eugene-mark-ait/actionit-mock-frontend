/**
 * Client-side auth session (JWT access + optional refresh).
 *
 * Stored in localStorage (browser-only app). HttpOnly cookies would require a BFF;
 * we mirror a short-lived cookie `actionit_auth` for optional middleware / UX only.
 */

import type { DashboardUser } from '@/types/user'

export const AUTH_SESSION_KEY = 'auth_session'

/** Cookie name checked optionally by middleware (must stay in sync with logout). */
export const AUTH_PRESENCE_COOKIE = 'actionit_auth'

export interface AuthSessionPayload {
  user: DashboardUser
  /** JWT or opaque bearer token from Lambda / auth API */
  access_token: string
  refresh_token?: string
  expires_at: number
}

export function readAuthSession(): AuthSessionPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as AuthSessionPayload
    if (!data?.user?.id || !data.expires_at) {
      return null
    }
    if (data.expires_at <= Date.now()) {
      clearAuthSessionStorage()
      clearAuthPresenceCookie()
      return null
    }
    return data
  } catch {
    return null
  }
}

/**
 * Same stored session but does **not** clear storage when past `expires_at`.
 * Used for token refresh so `refresh_token` remains readable after access token expiry.
 */
export function readAuthSessionIncludingExpired(): AuthSessionPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as AuthSessionPayload
    if (!data?.user?.id || !data.expires_at) {
      return null
    }
    return data
  } catch {
    return null
  }
}

/** Non-httpOnly cookie so middleware can hint “logged in” without reading localStorage. */
export function setAuthPresenceCookie(maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_PRESENCE_COOKIE}=1; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

export function clearAuthPresenceCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_PRESENCE_COOKIE}=; path=/; max-age=0`
}

export function writeAuthSession(
  session: {
    user: DashboardUser
    access_token: string
    refresh_token?: string
    expires_at?: number
  },
  ttlMsFallback = 3_600_000,
): void {
  if (typeof window === 'undefined') return
  const expires_at = session.expires_at ?? Date.now() + ttlMsFallback
  const full: AuthSessionPayload = {
    user: session.user,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at,
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(full))
  const maxAge = Math.max(60, Math.floor((expires_at - Date.now()) / 1000))
  setAuthPresenceCookie(maxAge)
}

/** Merge fields onto the stored user without rotating tokens. */
export function patchAuthSessionUser(updates: Partial<DashboardUser>): void {
  const cur = readAuthSession()
  if (!cur?.user) return
  const ttlMs = Math.max(60_000, cur.expires_at - Date.now())
  writeAuthSession(
    {
      user: { ...cur.user, ...updates },
      access_token: cur.access_token,
      refresh_token: cur.refresh_token,
      expires_at: cur.expires_at,
    },
    ttlMs,
  )
}

export function patchAuthSessionTokens(access_token: string, refresh_token?: string, ttlMs = 3_600_000): void {
  const cur = readAuthSessionIncludingExpired()
  if (!cur?.user) return
  writeAuthSession({
    user: cur.user,
    access_token,
    refresh_token: refresh_token ?? cur.refresh_token,
    expires_at: Date.now() + ttlMs,
  })
}

/** Re-set presence cookie after reload when session lives in localStorage only. */
export function syncPresenceCookieFromSession(): void {
  const s = readAuthSession()
  if (!s) return
  const maxAge = Math.max(60, Math.floor((s.expires_at - Date.now()) / 1000))
  setAuthPresenceCookie(maxAge)
}

export function clearAuthSessionStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(AUTH_SESSION_KEY)
  } catch {
    /* ignore */
  }
  clearAuthPresenceCookie()
}

export function getDemoDashboardUser(): DashboardUser {
  return {
    id: 'local-demo-user',
    email: 'demo@actionit.ai',
    name: 'Demo user',
    verified_email: true,
    recallCalendarStatus: 'disconnected',
    createdAt: '2025-01-15T12:00:00.000Z',
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
  }
}

export function buildUserFromLambdaSuccess(params: {
  userId: string
  userEmail: string
  userName?: string | null
  recallCalendarId?: string | null
}): DashboardUser {
  const { userId, userEmail, userName, recallCalendarId } = params
  return {
    id: userId,
    email: userEmail,
    name: userName?.trim() || userEmail.split('@')[0] || 'User',
    verified_email: true,
    recallCalendarId: recallCalendarId ?? undefined,
    recallCalendarStatus: recallCalendarId ? 'connected' : undefined,
  }
}
