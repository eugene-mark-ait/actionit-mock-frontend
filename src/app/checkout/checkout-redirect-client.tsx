'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { buildStripeCheckoutUrl } from '@/lib/billing-api'
import type { PlanCheckoutId } from '@/lib/plan-flow'

/** Query may use legacy `team`; Lambda expects `business`. */
function normalizePaidPlanFromQuery(v: string | null): Exclude<PlanCheckoutId, 'free'> | null {
  if (v === 'professional') return 'professional'
  if (v === 'business' || v === 'team') return 'business'
  return null
}

export function CheckoutRedirectClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return
    const t = window.setTimeout(() => {
      if (!user?.id) {
        setError('You need to be signed in to continue to checkout.')
        return
      }
      const plan = normalizePaidPlanFromQuery(searchParams.get('plan'))
      if (!plan) {
        setError('Missing or invalid plan. Choose a paid plan first.')
        return
      }
      try {
        const url = buildStripeCheckoutUrl(user.id, plan)
        window.location.href = url
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Checkout is not available.')
      }
    }, 0)
    return () => window.clearTimeout(t)
  }, [loading, user, searchParams])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl">
        {error ? (
          <>
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" aria-hidden />
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-brand-navy">Checkout</h1>
            <p className="mt-2 text-sm text-zinc-600">{error}</p>
            <Link
              href="/plans"
              className="mt-6 inline-flex text-sm font-medium text-brand-cyan underline-offset-2 hover:underline"
            >
              Back to plans
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-cyan" aria-hidden />
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-brand-navy">
              Redirecting to Stripe…
            </h1>
            <p className="mt-2 text-sm text-zinc-600">Secure checkout will open in this window.</p>
            <button
              type="button"
              onClick={() => router.push('/plans')}
              className="mt-6 text-sm font-medium text-brand-cyan underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
