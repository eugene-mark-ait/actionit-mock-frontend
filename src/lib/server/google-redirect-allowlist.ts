const DEFAULT_ALLOWLIST = [
  'http://localhost:3000/auth/callback',
  'http://127.0.0.1:3000/auth/callback',
]

export function getAllowedRedirectUris(): string[] {
  const extra = process.env.GOOGLE_OAUTH_REDIRECT_URI_ALLOWLIST?.split(',') ?? []
  const trimmed = extra.map((s) => s.trim()).filter(Boolean)
  const fromEnv = process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim()
  const base = [...DEFAULT_ALLOWLIST, ...trimmed]
  if (fromEnv && !base.includes(fromEnv)) base.push(fromEnv)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (appUrl) {
    const normalized = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`
    try {
      const candidate = `${new URL(normalized).origin}/auth/callback`
      if (!base.includes(candidate)) base.push(candidate)
    } catch {
      /* ignore */
    }
  }

  return base
}

export function isAllowedRedirectUri(redirectUri: string, trustExact?: string): boolean {
  if (trustExact && redirectUri === trustExact) return true
  let parsed: URL
  try {
    parsed = new URL(redirectUri)
  } catch {
    return false
  }
  if (parsed.pathname !== '/auth/callback') return false
  const allowed = getAllowedRedirectUris()
  return allowed.some((u) => {
    try {
      const a = new URL(u)
      return a.origin === parsed.origin && a.pathname === parsed.pathname
    } catch {
      return false
    }
  })
}
