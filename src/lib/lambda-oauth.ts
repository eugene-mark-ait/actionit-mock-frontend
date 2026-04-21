/**
 * AWS API Gateway + Lambda OAuth (unchanged contract: /oauth/initiate, /oauth/callback, /oauth/status).
 * `VITE_API_KEY` is bridged to NEXT_PUBLIC_LAMBDA_OAUTH_API_KEY in next.config.
 *
 * ASSUMPTION: Lambda may return optional `access_token` / `refresh_token` / `expires_in` (JWT) in JSON;
 * if absent, the app still stores the user profile and uses an empty bearer (backends that key off userId only).
 */

import { GOOGLE_OAUTH_SCOPES } from '@/lib/google-oauth-scopes'

const DEFAULT_API_BASE = 'https://w4thjbzyeh.execute-api.us-east-1.amazonaws.com/prod'

export function getLambdaOAuthApiBase(): string {
  const fromEnv =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_LAMBDA_OAUTH_API_BASE?.trim() : ''
  return fromEnv || DEFAULT_API_BASE
}

export function getLambdaOAuthApiKey(): string {
  if (typeof process === 'undefined') return ''
  return process.env.NEXT_PUBLIC_LAMBDA_OAUTH_API_KEY?.trim() || ''
}

export interface LambdaOAuthResponse {
  success: boolean
  authUrl?: string
  state?: string
  userId?: string
  userEmail?: string
  userName?: string
  recallCalendarId?: string
  redirectUrl?: string
  message?: string
  error?: string
  access_token?: string
  refresh_token?: string
  expires_in?: number
}

export interface LambdaOAuthStatus {
  status: string
  userId?: string
  email?: string
  name?: string
  oauthStatus?: string
  hasTokens?: boolean
  createdAt?: number
  message?: string
}

export type AuthProviderMode = 'auto' | 'lambda' | 'google'

export function getAuthProviderMode(): AuthProviderMode {
  if (typeof process === 'undefined') return 'auto'
  const v = process.env.NEXT_PUBLIC_AUTH_PROVIDER?.trim().toLowerCase()
  if (v === 'lambda' || v === 'google') return v
  return 'auto'
}

function hasPublicGoogleClientEnv(): boolean {
  return Boolean(
    typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() &&
      process.env.NEXT_PUBLIC_APP_URL?.trim(),
  )
}

export function hasLambdaOAuthCredentials(): boolean {
  if (typeof process === 'undefined') return false
  if (process.env.NEXT_PUBLIC_LAMBDA_OAUTH_ENABLED === 'true') return true
  if (Boolean(process.env.NEXT_PUBLIC_LAMBDA_OAUTH_API_BASE?.trim())) return true
  if (Boolean(process.env.NEXT_PUBLIC_LAMBDA_OAUTH_API_KEY?.trim())) return true
  return false
}

/**
 * Whether the login button should call API Gateway `/oauth/initiate` (vs direct Google URL).
 *
 * ASSUMPTION: `/oauth/initiate` returns a Google URL whose `redirect_uri` is configured on the
 * backend (often production). For local testing, prefer direct Google OAuth using
 * `NEXT_PUBLIC_APP_URL` (e.g. http://localhost:3000/auth/callback) when a public client id is set.
 * Set `NEXT_PUBLIC_FORCE_LAMBDA_OAUTH=true` to still use Lambda from localhost.
 */
export function shouldUseLambdaOAuthSignIn(): boolean {
  if (typeof process === 'undefined') return false
  const mode = getAuthProviderMode()
  if (mode === 'google') return false
  if (mode === 'lambda') return true
  if (process.env.NEXT_PUBLIC_FORCE_LAMBDA_OAUTH === 'true') {
    return hasLambdaOAuthCredentials()
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? ''
  const isLocalOrigin = /localhost|127\.0\.0\.1/.test(appUrl)
  if (isLocalOrigin && canSignInWithPublicGoogleClient()) {
    return false
  }

  return hasLambdaOAuthCredentials()
}

export function requiresRealUserSession(): boolean {
  if (typeof process === 'undefined') return false
  const mode = getAuthProviderMode()
  if (mode === 'lambda' || mode === 'google') return true
  if (process.env.NEXT_PUBLIC_LAMBDA_OAUTH_ENABLED === 'true') return true
  if (hasLambdaOAuthCredentials()) return true
  if (hasPublicGoogleClientEnv()) return true
  if (process.env.NEXT_PUBLIC_DISABLE_DEMO_USER === 'true') return true
  return false
}

const OAUTH_STATE_KEY = 'oauth_state'

export const OAUTH_LOGIN_FLOW_KEY = 'oauth_login_flow'
export type OAuthLoginFlowKind = 'legacy_google' | 'lambda_oauth'

export function setOAuthLoginFlow(kind: OAuthLoginFlowKind): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(OAUTH_LOGIN_FLOW_KEY, kind)
  } catch {
    /* ignore */
  }
}

export function getOAuthLoginFlow(): OAuthLoginFlowKind | null {
  if (typeof window === 'undefined') return null
  try {
    const v = sessionStorage.getItem(OAUTH_LOGIN_FLOW_KEY)
    if (v === 'legacy_google' || v === 'lambda_oauth') return v
    return null
  } catch {
    return null
  }
}

export function clearOAuthLoginFlow(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(OAUTH_LOGIN_FLOW_KEY)
  } catch {
    /* ignore */
  }
}

export function clearOAuthStateStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(OAUTH_STATE_KEY)
  } catch {
    /* ignore */
  }
}

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? '' : ''
const NEXT_PUBLIC_APP_URL =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_APP_URL?.trim() ?? '' : ''

export function canSignInWithPublicGoogleClient(): boolean {
  return Boolean(NEXT_PUBLIC_GOOGLE_CLIENT_ID && NEXT_PUBLIC_APP_URL)
}

export function buildPublicClientIdGoogleAuthorizeUrl(): string | null {
  if (typeof window === 'undefined') return null
  if (!NEXT_PUBLIC_GOOGLE_CLIENT_ID || !NEXT_PUBLIC_APP_URL) return null
  const normalized = NEXT_PUBLIC_APP_URL.startsWith('http')
    ? NEXT_PUBLIC_APP_URL
    : `https://${NEXT_PUBLIC_APP_URL}`
  let redirectUri: string
  try {
    redirectUri = `${new URL(normalized).origin}/auth/callback`
  } catch {
    return null
  }

  const state =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  try {
    localStorage.setItem(OAUTH_STATE_KEY, state)
  } catch {
    /* ignore */
  }
  setOAuthLoginFlow('legacy_google')

  const params = new URLSearchParams({
    client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_SCOPES,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    state,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function buildLegacyGoogleAuthorizeUrl(authorizeBaseUrl: string): string {
  const state =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  try {
    localStorage.setItem(OAUTH_STATE_KEY, state)
  } catch {
    /* ignore */
  }
  setOAuthLoginFlow('legacy_google')
  const u = new URL(authorizeBaseUrl)
  u.searchParams.set('state', state)
  return u.toString()
}

export async function initiateLambdaOAuth(): Promise<LambdaOAuthResponse> {
  const API_BASE_URL = getLambdaOAuthApiBase()
  const API_KEY = getLambdaOAuthApiKey()

  const response = await fetch(`${API_BASE_URL}/oauth/initiate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OAuth initiate failed (${response.status}): ${errorText}`)
  }

  return (await response.json()) as LambdaOAuthResponse
}

export async function handleLambdaOAuthCallback(
  code: string,
  state: string,
): Promise<LambdaOAuthResponse> {
  const API_BASE_URL = getLambdaOAuthApiBase()
  const API_KEY = getLambdaOAuthApiKey()

  const params = new URLSearchParams({ code, state })
  const response = await fetch(`${API_BASE_URL}/oauth/callback?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OAuth callback failed (${response.status}): ${errorText}`)
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const data = (await response.json()) as LambdaOAuthResponse
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl
      return data
    }
    return data
  }

  const htmlText = await response.text()
  const redirectMatch = htmlText.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/)
  if (redirectMatch?.[1]) {
    window.location.href = redirectMatch[1]
    return { success: true, redirectUrl: redirectMatch[1] }
  }

  throw new Error('Unexpected response format from OAuth callback')
}

export async function getLambdaOAuthStatus(userId: string): Promise<LambdaOAuthStatus> {
  const API_BASE_URL = getLambdaOAuthApiBase()
  const API_KEY = getLambdaOAuthApiKey()

  const params = new URLSearchParams({ userId })
  const response = await fetch(`${API_BASE_URL}/oauth/status?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OAuth status failed (${response.status}): ${errorText}`)
  }

  return (await response.json()) as LambdaOAuthStatus
}

export async function completeLambdaOAuthFlow(): Promise<string> {
  const result = await initiateLambdaOAuth()

  if (!result.authUrl) {
    throw new Error('No auth URL received from Lambda')
  }

  if (result.state) {
    try {
      localStorage.setItem(OAUTH_STATE_KEY, result.state)
    } catch {
      /* ignore */
    }
  }

  setOAuthLoginFlow('lambda_oauth')
  return result.authUrl
}

export function validateAndConsumeOAuthStateFromUrl(pageUrl: string): void {
  const urlObj = new URL(pageUrl)
  const state = urlObj.searchParams.get('state')
  if (!state) return

  let storedState: string | null = null
  try {
    storedState = localStorage.getItem(OAUTH_STATE_KEY)
  } catch {
    /* ignore */
  }

  if (storedState !== state) {
    throw new Error('Invalid state parameter')
  }

  try {
    localStorage.removeItem(OAUTH_STATE_KEY)
  } catch {
    /* ignore */
  }
}

export async function processLambdaOAuthCallback(pageUrl: string): Promise<LambdaOAuthResponse> {
  const urlObj = new URL(pageUrl)
  const code = urlObj.searchParams.get('code')
  const state = urlObj.searchParams.get('state')
  const error = urlObj.searchParams.get('error')

  if (error) {
    throw new Error(`OAuth error: ${error}`)
  }

  if (!code) {
    throw new Error('Missing authorization code')
  }

  validateAndConsumeOAuthStateFromUrl(pageUrl)

  const result = await handleLambdaOAuthCallback(code, state ?? '')

  if (!result.success) {
    throw new Error(result.error || 'OAuth callback failed')
  }

  return result
}
