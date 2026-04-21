/**
 * Optional email/password auth against an external API Gateway / Lambda.
 *
 * ASSUMPTION (adjust when backend is fixed): POST /login returns JSON:
 * { access_token: string, refresh_token?: string, expires_in?: number, user: { id, email, name, ... } }
 */

export interface PasswordLoginResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  user: {
    id: string
    email: string
    name: string
    picture?: string
  }
}

export async function loginWithPasswordApi(
  email: string,
  password: string,
): Promise<PasswordLoginResponse> {
  const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AUTH_API_BASE?.trim() : ''
  if (!base) {
    throw new Error(
      'Password login is not configured. Set NEXT_PUBLIC_AUTH_API_BASE to your auth API origin.',
    )
  }

  const url = `${base.replace(/\/$/, '')}/login`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = (await res.json().catch(() => ({}))) as PasswordLoginResponse & { error?: string }

  if (!res.ok) {
    throw new Error(data.error || `Login failed (${res.status})`)
  }

  if (!data.access_token || !data.user?.id) {
    throw new Error('Invalid login response from server')
  }

  return data
}

export async function signUpWithPasswordApi(
  email: string,
  password: string,
): Promise<void> {
  const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AUTH_API_BASE?.trim() : ''
  if (!base) {
    throw new Error('Sign-up API not configured (NEXT_PUBLIC_AUTH_API_BASE).')
  }

  const url = `${base.replace(/\/$/, '')}/signup`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) {
    throw new Error(data.error || `Sign-up failed (${res.status})`)
  }
}
