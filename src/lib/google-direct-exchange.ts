import type { DashboardUser } from '@/types/user'

export interface GoogleDirectExchangeResult {
  user: DashboardUser
  expires_in: number
  access_token?: string
  refresh_token?: string
}

/** Server-side Google code exchange via Next Route Handler (client secret never exposed). */
export async function exchangeGoogleAuthorizationCode(
  code: string,
  redirectUri: string,
): Promise<GoogleDirectExchangeResult> {
  const res = await fetch('/api/auth/google-exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  })

  const data = (await res.json().catch(() => ({}))) as GoogleDirectExchangeResult & {
    error?: string
    hint?: string
  }

  if (!res.ok) {
    throw new Error(data.hint || data.error || `Token exchange failed (${res.status})`)
  }

  if (!data.user?.id || !data.user?.email) {
    throw new Error('Sign-in succeeded but user details were missing.')
  }

  return {
    user: data.user,
    expires_in: typeof data.expires_in === 'number' ? data.expires_in : 3600,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  }
}
