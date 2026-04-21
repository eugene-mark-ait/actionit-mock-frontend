'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { DashboardUser } from '@/types/user'
import {
  readAuthSession,
  readAuthSessionIncludingExpired,
  patchAuthSessionTokens,
  writeAuthSession,
  clearAuthSessionStorage,
  syncPresenceCookieFromSession,
  getDemoDashboardUser,
  type AuthSessionPayload,
} from '@/lib/auth-session'
import {
  completeLambdaOAuthFlow,
  buildLegacyGoogleAuthorizeUrl,
  buildPublicClientIdGoogleAuthorizeUrl,
  shouldUseLambdaOAuthSignIn,
  refreshLambdaOAuthTokens,
  clearOAuthLoginFlow,
  clearOAuthStateStorage,
  canSignInWithPublicGoogleClient,
} from '@/lib/lambda-oauth'
import { revokeToken, refreshAccessToken } from '@/lib/google-oauth'
import { clearGoogleOAuthStorage } from '@/lib/google-oauth'
import { loginWithPasswordApi, signUpWithPasswordApi } from '@/lib/auth-api'
import { resolvePostAuthDestination } from '@/lib/post-auth-plan-navigation'
import { discardStalePaidPendingWithoutLoginQueryMarker, setPlanGateComplete } from '@/lib/plan-flow'

export type { DashboardUser } from '@/types/user'

interface AuthContextType {
  user: DashboardUser | null
  session: AuthSessionPayload | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/** When true, disable demo seed user until the user completes real sign-in. */
function requiresStrictAuth(useLambda: boolean): boolean {
  if (typeof process === 'undefined') return false
  if (process.env.NEXT_PUBLIC_DISABLE_DEMO_USER === 'true') return true
  if (useLambda) return true
  if (canSignInWithPublicGoogleClient()) return true
  if (process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_URL?.trim()) return true
  return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<AuthSessionPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const lambdaOAuthSignIn = shouldUseLambdaOAuthSignIn()

  /** Re-hydrate from localStorage on route changes (e.g. OAuth callback wrote session then `router.replace`). */
  useEffect(() => {
    syncPresenceCookieFromSession()
    const stored = readAuthSession()
    if (stored?.user) {
      setSession(stored)
    }
  }, [pathname])

  useEffect(() => {
    syncPresenceCookieFromSession()
    const stored = readAuthSession()
    if (stored?.user) {
      setSession(stored)
      setLoading(false)
      return
    }

    /**
     * ASSUMPTION: Until real login, non-production-style apps can auto-seed a demo user.
     * Set NEXT_PUBLIC_DISABLE_DEMO_USER=true or configure OAuth env to require explicit sign-in.
     */
    if (!requiresStrictAuth(lambdaOAuthSignIn)) {
      const demoUser = getDemoDashboardUser()
      writeAuthSession({
        user: demoUser,
        access_token: 'demo-local',
        expires_at: Date.now() + 86_400_000,
      })
      setPlanGateComplete(demoUser.id)
      setSession(readAuthSession())
    }

    setLoading(false)
  }, [lambdaOAuthSignIn])

  const refreshSession = useCallback(async () => {
    const forceLambdaRefresh =
      typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_LAMBDA_OAUTH === 'true'

    /** Near-expiry or expired access token — refresh flow may run (Lambda and/or `/api/auth/refresh`). */
    const sessionNeedsTokenRefresh = (raw: AuthSessionPayload): boolean => {
      if (!raw.access_token?.trim()) return true
      return raw.expires_at <= Date.now() + 120_000
    }

    if (forceLambdaRefresh) {
      const raw = readAuthSessionIncludingExpired()
      if (
        raw?.user?.id &&
        raw.access_token !== 'demo-local' &&
        sessionNeedsTokenRefresh(raw)
      ) {
        try {
          const refreshed = await refreshLambdaOAuthTokens({
            userId: raw.user.id,
            refreshToken: raw.refresh_token,
          })
          const access = refreshed.access_token?.trim()
          if (access) {
            const ttlMs =
              typeof refreshed.expires_in === 'number' && refreshed.expires_in > 0
                ? refreshed.expires_in * 1000
                : 3_600_000
            patchAuthSessionTokens(
              access,
              refreshed.refresh_token ?? raw.refresh_token,
              ttlMs,
            )
            setSession(readAuthSession())
            return
          }
        } catch {
          /* try Next route refresh below when refresh_token exists */
        }

        if (raw.refresh_token?.trim()) {
          try {
            const tokens = await refreshAccessToken(raw.refresh_token)
            const ttlMs =
              typeof tokens.expires_in === 'number' && tokens.expires_in > 0
                ? tokens.expires_in * 1000
                : 3_600_000
            patchAuthSessionTokens(
              tokens.access_token,
              tokens.refresh_token ?? raw.refresh_token,
              ttlMs,
            )
            setSession(readAuthSession())
            return
          } catch {
            /* fall through — readAuthSession may clear expired session */
          }
        }
      }
    }

    const s = readAuthSession()
    setSession(s)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await loginWithPasswordApi(email, password)
      const user: DashboardUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        verified_email: true,
      }
      const ttlMs =
        typeof data.expires_in === 'number' && data.expires_in > 0
          ? data.expires_in * 1000
          : 3_600_000
      writeAuthSession(
        {
          user,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: Date.now() + ttlMs,
        },
        ttlMs,
      )
      setSession(readAuthSession())
      discardStalePaidPendingWithoutLoginQueryMarker()
      const u = readAuthSession()?.user
      const dest = u ? await resolvePostAuthDestination(u) : '/dashboard'
      router.replace(dest)
    } finally {
      setLoading(false)
    }
  }, [router])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      await signUpWithPasswordApi(email, password)
    } finally {
      setLoading(false)
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const googleSignInUrl = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_URL?.trim() ?? ''

    if (lambdaOAuthSignIn) {
      const authUrl = await completeLambdaOAuthFlow()
      window.location.href = authUrl
      return
    }

    if (googleSignInUrl) {
      window.location.href = buildLegacyGoogleAuthorizeUrl(googleSignInUrl)
      return
    }

    if (canSignInWithPublicGoogleClient()) {
      const url = buildPublicClientIdGoogleAuthorizeUrl()
      if (url) window.location.href = url
      return
    }

    throw new Error(
      'Google sign-in is not configured. Set Lambda env (VITE_API_KEY), or NEXT_PUBLIC_GOOGLE_SIGNIN_URL, or NEXT_PUBLIC_GOOGLE_CLIENT_ID + NEXT_PUBLIC_APP_URL.',
    )
  }, [lambdaOAuthSignIn])

  const loginWithMicrosoft = useCallback(async () => {
    throw new Error('Microsoft sign-in is not configured for this deployment.')
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      const s = readAuthSession()
      if (s?.access_token && s.access_token !== 'demo-local') {
        try {
          await revokeToken(s.access_token)
        } catch {
          /* non-fatal */
        }
      }
      clearGoogleOAuthStorage()
      clearAuthSessionStorage()
      clearOAuthStateStorage()
      clearOAuthLoginFlow()
      setSession(null)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const user = session?.user ?? null

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      loading,
      login,
      signUp,
      loginWithGoogle,
      loginWithMicrosoft,
      logout,
      isAuthenticated: !!user,
      refreshSession,
    }),
    [
      user,
      session,
      loading,
      login,
      signUp,
      loginWithGoogle,
      loginWithMicrosoft,
      logout,
      refreshSession,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
