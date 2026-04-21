'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { patchAuthSessionUser } from '@/lib/auth-session'
import { clearPendingPlanId, setPlanGateComplete } from '@/lib/plan-flow'
import type { PlanCheckoutId } from '@/lib/plan-flow'

type Status = 'processing' | 'success' | 'error'

function planFromQuery(v: string | null): PlanCheckoutId | null {
  if (v === 'free') return 'free'
  if (v === 'professional') return 'professional'
  if (v === 'business' || v === 'team') return 'business'
  return null
}

/**
 * Stripe redirects here after successful checkout.
 * ASSUMPTION: Webhooks finalize billing server-side; we optimistically mark the session as trialing.
 */
export function CheckoutSuccessClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshSession, loading } = useAuth()
  const [status, setStatus] = useState<Status>('processing')

  useEffect(() => {
    if (loading) return
    let inner: ReturnType<typeof setTimeout> | undefined
    const outer = window.setTimeout(() => {
      if (!user?.id) {
        setStatus('error')
        return
      }
      const sessionId = searchParams.get('session_id')
      const plan = planFromQuery(searchParams.get('plan'))

      if (!sessionId) {
        setStatus('error')
        return
      }

      clearPendingPlanId()
      setPlanGateComplete(user.id)

      const tier = plan && plan !== 'free' ? plan : 'professional'
      patchAuthSessionUser({
        subscriptionTier: tier,
        subscriptionStatus: 'trialing',
      })
      void refreshSession()
      setStatus('success')

      inner = window.setTimeout(() => {
        router.replace('/dashboard')
      }, 2200)
    }, 0)
    return () => {
      window.clearTimeout(outer)
      if (inner) window.clearTimeout(inner)
    }
  }, [loading, user, searchParams, refreshSession, router])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl">
        {status === 'processing' && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-cyan" aria-hidden />
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-brand-navy">
              Confirming subscription…
            </h1>
            <p className="mt-2 text-sm text-zinc-600">Almost done — taking you to the dashboard.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden />
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-green-700">
              Trial started
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Your 7-day trial is active. You will be redirected to the dashboard.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" aria-hidden />
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-brand-navy">
              Could not confirm checkout
            </h1>
            <p className="mt-2 text-sm text-zinc-600">Try again from plans or contact support.</p>
            <Link
              href="/plans"
              className="mt-6 inline-flex text-sm font-medium text-brand-cyan underline-offset-2 hover:underline"
            >
              Back to plans
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
