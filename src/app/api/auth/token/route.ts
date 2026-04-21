import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthServerConfig } from '@/lib/server/google-oauth-config'
import { isAllowedRedirectUri } from '@/lib/server/google-redirect-allowlist'
import { exchangeAuthorizationCode } from '@/lib/server/google-token-exchange'

export async function POST(request: NextRequest) {
  let body: { code?: string; redirect_uri?: string }
  try {
    body = (await request.json()) as { code?: string; redirect_uri?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code.trim() : ''
  if (!code) {
    return NextResponse.json({ error: 'Missing code', details: 'code required' }, { status: 400 })
  }

  let config: Awaited<ReturnType<typeof getGoogleOAuthServerConfig>>
  try {
    config = await getGoogleOAuthServerConfig()
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth configuration unavailable'
    return NextResponse.json({ error: message, details: message }, { status: 503 })
  }

  const redirectUri =
    typeof body.redirect_uri === 'string' && body.redirect_uri.trim()
      ? body.redirect_uri.trim()
      : config.redirect_uri

  if (!isAllowedRedirectUri(redirectUri, config.redirect_uri)) {
    return NextResponse.json(
      { error: 'redirect_uri is not allowed', details: redirectUri },
      { status: 400 },
    )
  }

  try {
    const tokens = await exchangeAuthorizationCode(config, code, redirectUri)
    if (!tokens.access_token) {
      return NextResponse.json(
        { error: 'Invalid token response', details: 'missing access_token' },
        { status: 502 },
      )
    }

    const expiresIn =
      typeof tokens.expires_in === 'number' && tokens.expires_in > 0 ? tokens.expires_in : 3600

    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: expiresIn,
      token_type: tokens.token_type ?? 'Bearer',
      scope: tokens.scope ?? '',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Token exchange failed'
    return NextResponse.json({ error: message, details: message }, { status: 400 })
  }
}
