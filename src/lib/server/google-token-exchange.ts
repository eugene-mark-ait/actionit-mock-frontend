import type { GoogleOAuthServerConfig } from '@/lib/server/google-oauth-config'

export type GoogleTokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
}

export async function exchangeAuthorizationCode(
  config: GoogleOAuthServerConfig,
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uri: redirectUri,
  })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const tokenJson = (await tokenRes.json().catch(() => ({}))) as GoogleTokenResponse

  if (!tokenRes.ok || !tokenJson.access_token) {
    const msg =
      tokenJson.error_description ||
      tokenJson.error ||
      `Google token endpoint error (${tokenRes.status})`
    throw new Error(msg)
  }

  return tokenJson
}

export async function refreshAccessTokenRequest(
  config: GoogleOAuthServerConfig,
  refreshToken: string,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.client_id,
    client_secret: config.client_secret,
  })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const tokenJson = (await tokenRes.json().catch(() => ({}))) as GoogleTokenResponse

  if (!tokenRes.ok || !tokenJson.access_token) {
    const msg =
      tokenJson.error_description ||
      tokenJson.error ||
      `Google token refresh error (${tokenRes.status})`
    throw new Error(msg)
  }

  return tokenJson
}

export type GoogleUserInfoV2 = {
  id: string
  email: string
  name?: string
  picture?: string
  verified_email?: boolean
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfoV2> {
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const userJson = (await userRes.json().catch(() => ({}))) as Partial<GoogleUserInfoV2>
  if (!userRes.ok || !userJson.id || !userJson.email) {
    throw new Error('Could not load Google user profile')
  }
  return {
    id: userJson.id,
    email: userJson.email,
    name: userJson.name,
    picture: userJson.picture,
    verified_email: userJson.verified_email,
  }
}
