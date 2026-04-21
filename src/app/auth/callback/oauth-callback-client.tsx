'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import {
  clearOAuthLoginFlow,
  getOAuthLoginFlow,
  processLambdaOAuthCallback,
  shouldUseLambdaOAuthSignIn,
  validateAndConsumeOAuthStateFromUrl,
} from '@/lib/lambda-oauth'
import { exchangeGoogleAuthorizationCode } from '@/lib/google-direct-exchange'
import { writeAuthSession, buildUserFromLambdaSuccess, readAuthSession } from '@/lib/auth-session'
import { useAuth } from '@/context/AuthContext'
import { resolvePostAuthDestination } from '@/lib/post-auth-plan-navigation'
import { discardStalePaidPendingWithoutLoginQueryMarker } from '@/lib/plan-flow'

type Status = 'processing' | 'success' | 'error'

export function OAuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshSession } = useAuth()
  const [status, setStatus] = useState<Status>('processing')
  const [message, setMessage] = useState('Completing sign-in…')
  const processed = useRef(false)
  const lambdaOAuthSignIn = shouldUseLambdaOAuthSignIn()

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const run = async () => {
      try {
        const flow = getOAuthLoginFlow()
        const useLegacyGoogleExchange =
          flow === 'legacy_google' || (flow === null && !lambdaOAuthSignIn)

        const success = searchParams.get('success')
        const userId = searchParams.get('userId')
        const userEmail = searchParams.get('userEmail')
        const userName = searchParams.get('userName')
        const recallCalendarId = searchParams.get('recallCalendarId')

        if (success === 'true' && userId && userEmail) {
          const user = buildUserFromLambdaSuccess({
            userId,
            userEmail,
            userName,
            recallCalendarId,
          })
          const ttlMs = 3_600_000
          writeAuthSession(
            {
              user,
              access_token: '',
              expires_at: Date.now() + ttlMs,
            },
            ttlMs,
          )
          await refreshSession()
          const u = readAuthSession()?.user
          const dest = u ? await resolvePostAuthDestination(u) : '/dashboard'
          setStatus('success')
          setMessage('Signed in successfully.')
          router.replace(dest)
          return
        }

        const code = searchParams.get('code')
        const oauthError = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (oauthError) {
          throw new Error(errorDescription || oauthError || 'OAuth was denied or failed')
        }

        if (!code) {
          throw new Error('Missing authorization code. Try signing in again from the login page.')
        }

        setMessage('Exchanging authorization code…')

        if (useLegacyGoogleExchange) {
          validateAndConsumeOAuthStateFromUrl(window.location.href)
          const redirectUri = `${window.location.origin}/auth/callback`
          const result = await exchangeGoogleAuthorizationCode(code, redirectUri)
          const ttlMs = Math.max(60_000, Math.min(result.expires_in * 1000, 24 * 60 * 60 * 1000))
          writeAuthSession(
            {
              user: result.user,
              access_token: result.access_token ?? '',
              refresh_token: result.refresh_token,
              expires_at: Date.now() + ttlMs,
            },
            ttlMs,
          )
        } else {
          const result = await processLambdaOAuthCallback(window.location.href)

          if (result.redirectUrl) {
            return
          }

          if (!result.success) {
            throw new Error(result.error || 'OAuth callback failed')
          }

          if (!result.userId || !result.userEmail) {
            throw new Error(result.error || 'Sign-in succeeded but user details were missing.')
          }

          const user = buildUserFromLambdaSuccess({
            userId: result.userId,
            userEmail: result.userEmail,
            userName: result.userName ?? null,
            recallCalendarId: result.recallCalendarId ?? null,
          })

          const ttlMs =
            typeof result.expires_in === 'number' && result.expires_in > 0
              ? result.expires_in * 1000
              : 3_600_000

          writeAuthSession(
            {
              user,
              access_token: result.access_token ?? '',
              refresh_token: result.refresh_token,
              expires_at: Date.now() + ttlMs,
            },
            ttlMs,
          )
        }

        setStatus('success')
        setMessage('Signed in successfully.')
        await refreshSession()
        discardStalePaidPendingWithoutLoginQueryMarker()
        const u = readAuthSession()?.user
        const dest = u ? await resolvePostAuthDestination(u) : '/dashboard'
        router.replace(dest)
      } catch (e) {
        const err = e instanceof Error ? e.message : 'Something went wrong'
        setStatus('error')
        setMessage(err)
      } finally {
        clearOAuthLoginFlow()
      }
    }

    void run()
  }, [router, searchParams, lambdaOAuthSignIn, refreshSession])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {status === 'processing' ? (
            <Loader2 className="h-7 w-7 animate-spin text-brand-cyan" aria-hidden />
          ) : status === 'success' ? (
            <CheckCircle className="h-7 w-7 text-green-600" aria-hidden />
          ) : (
            <AlertCircle className="h-7 w-7 text-destructive" aria-hidden />
          )}
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy">
          {status === 'processing' ? 'Signing you in' : status === 'success' ? 'Welcome' : 'Sign-in issue'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{message}</p>
        {status === 'error' && (
          <Link
            href="/login"
            className="mt-6 inline-flex text-sm font-medium text-brand-cyan underline-offset-2 hover:underline"
          >
            Back to sign in
          </Link>
        )}
      </div>
    </div>
  )
}
