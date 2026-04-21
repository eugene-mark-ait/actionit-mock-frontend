import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthServerConfig } from '@/lib/server/google-oauth-config'
import { isAllowedRedirectUri } from '@/lib/server/google-redirect-allowlist'
import {
  exchangeAuthorizationCode,
  fetchGoogleUserInfo,
} from '@/lib/server/google-token-exchange'

export async function POST(request: NextRequest) {
  let body: { code?: string; redirect_uri?: string }
  try {
    body = (await request.json()) as { code?: string; redirect_uri?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code.trim() : ''
  const redirectUri =
    typeof body.redirect_uri === 'string' ? body.redirect_uri.trim() : ''

  if (!code || !redirectUri) {
    return NextResponse.json({ error: 'Missing code or redirect_uri' }, { status: 400 })
  }

  let config: Awaited<ReturnType<typeof getGoogleOAuthServerConfig>>
  try {
    config = await getGoogleOAuthServerConfig()
  } catch (e) {
    const hint = e instanceof Error ? e.message : 'OAuth configuration unavailable'
    return NextResponse.json(
      {
        error: 'Google OAuth not configured',
        hint,
      },
      { status: 501 },
    )
  }

  if (!isAllowedRedirectUri(redirectUri, config.redirect_uri)) {
    return NextResponse.json({ error: 'redirect_uri is not allowed' }, { status: 400 })
  }

  try {
    const tokenJson = await exchangeAuthorizationCode(config, code, redirectUri)
    const accessToken = tokenJson.access_token!
    const userRaw = await fetchGoogleUserInfo(accessToken)

    const expiresIn =
      typeof tokenJson.expires_in === 'number' && tokenJson.expires_in > 0
        ? tokenJson.expires_in
        : 3600

    return NextResponse.json({
      user: {
        id: userRaw.id,
        email: userRaw.email,
        name: userRaw.name?.trim() || userRaw.email.split('@')[0] || 'User',
        picture: userRaw.picture,
        verified_email: userRaw.verified_email ?? true,
      },
      expires_in: expiresIn,
      access_token: accessToken,
      refresh_token: tokenJson.refresh_token,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Token exchange failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
