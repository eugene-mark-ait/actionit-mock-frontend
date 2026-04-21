/**
 * Server-only OAuth client credentials for Next.js Route Handlers.
 *
 * ASSUMPTION: Prefer env vars locally. Production can set GOOGLE_OAUTH_SECRET_NAME + AWS SDK later;
 * this module only reads plain env today to avoid coupling the browser bundle to AWS.
 */

export interface GoogleOAuthServerConfig {
  client_id: string
  client_secret: string
  redirect_uri: string
}

function defaultRedirectUri(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    'http://localhost:3000'
  const origin = base.startsWith('http') ? base : `https://${base}`
  return `${origin.replace(/\/$/, '')}/auth/callback`
}

function resolveGoogleOAuthClientId(): string | undefined {
  return (
    process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()
  )
}

/** Must never be exposed via NEXT_PUBLIC_* — token exchange requires a confidential client secret. */
function resolveGoogleOAuthClientSecret(): string | undefined {
  return (
    process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim()
  )
}

export async function getGoogleOAuthServerConfig(): Promise<GoogleOAuthServerConfig> {
  const client_id = resolveGoogleOAuthClientId()
  const client_secret = resolveGoogleOAuthClientSecret()
  const redirect_uri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim() || defaultRedirectUri()

  if (!client_id) {
    throw new Error(
      'Missing OAuth client id: set GOOGLE_OAUTH_CLIENT_ID or NEXT_PUBLIC_GOOGLE_CLIENT_ID.',
    )
  }
  if (!client_secret) {
    throw new Error(
      'Missing OAuth client secret: add GOOGLE_OAUTH_CLIENT_SECRET to .env (Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client → Client secret). Must match the same client id you use for sign-in.',
    )
  }

  return { client_id, client_secret, redirect_uri }
}
