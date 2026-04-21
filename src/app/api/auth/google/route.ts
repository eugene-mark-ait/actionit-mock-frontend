import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthServerConfig } from '@/lib/server/google-oauth-config'
import { GOOGLE_OAUTH_SCOPES } from '@/lib/google-oauth-scopes'

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'

export async function GET(request: NextRequest) {
  let config: Awaited<ReturnType<typeof getGoogleOAuthServerConfig>>
  try {
    config = await getGoogleOAuthServerConfig()
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth configuration unavailable'
    return NextResponse.json({ error: message }, { status: 503 })
  }

  const state = request.nextUrl.searchParams.get('state')?.trim()

  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_SCOPES,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
  })
  if (state) params.set('state', state)

  const authUrl = `${AUTH_ENDPOINT}?${params.toString()}`
  return NextResponse.json({ authUrl })
}
