import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthServerConfig } from '@/lib/server/google-oauth-config'
import { refreshAccessTokenRequest } from '@/lib/server/google-token-exchange'

export async function POST(request: NextRequest) {
  let body: { refresh_token?: string }
  try {
    body = (await request.json()) as { refresh_token?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const refreshToken =
    typeof body.refresh_token === 'string' ? body.refresh_token.trim() : ''
  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Missing refresh_token', details: 'refresh_token required' },
      { status: 400 },
    )
  }

  let config: Awaited<ReturnType<typeof getGoogleOAuthServerConfig>>
  try {
    config = await getGoogleOAuthServerConfig()
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth configuration unavailable'
    return NextResponse.json({ error: message, details: message }, { status: 503 })
  }

  try {
    const tokens = await refreshAccessTokenRequest(config, refreshToken)
    if (!tokens.access_token) {
      return NextResponse.json(
        { error: 'Invalid refresh response', details: 'missing access_token' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in ?? 3600,
      token_type: tokens.token_type ?? 'Bearer',
      scope: tokens.scope ?? '',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Token refresh failed'
    return NextResponse.json({ error: message, details: message }, { status: 400 })
  }
}
