/**
 * Browser helpers for Google OAuth via Next.js Route Handlers (not third-party backends).
 */

const USERINFO = 'https://www.googleapis.com/oauth2/v2/userinfo'
const REVOKE = 'https://oauth2.googleapis.com/revoke'

export interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
}

export async function generateGoogleAuthUrl(state?: string): Promise<string> {
  const qs = state ? `?state=${encodeURIComponent(state)}` : ''
  const response = await fetch(`/api/auth/google${qs}`)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OAuth config failed (${response.status}): ${text}`)
  }
  const data = (await response.json()) as { authUrl?: string; error?: string }
  if (!data.authUrl) throw new Error(data.error || 'No authUrl')
  return data.authUrl
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri?: string,
): Promise<OAuthTokens> {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      ...(redirectUri ? { redirect_uri: redirectUri } : {}),
    }),
  })

  const data = (await response.json().catch(() => ({}))) as OAuthTokens & {
    error?: string
    details?: string
  }

  if (!response.ok) {
    throw new Error(data.details || data.error || `Token exchange failed (${response.status})`)
  }

  if (!data.access_token || data.expires_in == null) {
    throw new Error('Invalid token response')
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type,
    scope: data.scope,
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  const data = (await response.json().catch(() => ({}))) as OAuthTokens & {
    error?: string
    details?: string
  }

  if (!response.ok) {
    throw new Error(data.details || data.error || `Refresh failed (${response.status})`)
  }

  if (!data.access_token) throw new Error('Invalid refresh response')

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in ?? 3600,
    token_type: data.token_type,
    scope: data.scope,
  }
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(USERINFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const userInfo = (await response.json().catch(() => ({}))) as Partial<GoogleUserInfo> & {
    error?: string
    error_description?: string
  }

  if (!response.ok) {
    throw new Error(userInfo.error_description || userInfo.error || 'User info failed')
  }

  if (!userInfo.id || !userInfo.email) {
    throw new Error('Invalid user info response')
  }

  return {
    id: userInfo.id,
    email: userInfo.email,
    verified_email: userInfo.verified_email ?? true,
    name: userInfo.name ?? userInfo.email.split('@')[0] ?? 'User',
    given_name: userInfo.given_name,
    family_name: userInfo.family_name,
    picture: userInfo.picture,
    locale: userInfo.locale,
  }
}

export async function revokeToken(token: string): Promise<void> {
  const response = await fetch(REVOKE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token }),
  })
  if (!response.ok) throw new Error('Failed to revoke token')
}

const GOOGLE_OAUTH_SESSION_KEY = 'google_oauth_session'

export function clearGoogleOAuthStorage(): void {
  try {
    localStorage.removeItem(GOOGLE_OAUTH_SESSION_KEY)
  } catch {
    /* ignore */
  }
}
