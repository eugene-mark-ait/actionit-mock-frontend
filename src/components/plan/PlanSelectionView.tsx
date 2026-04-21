'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { PLAN_TIERS, type PlanCheckoutId } from '@/data/planTiers'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/cn'
import {
  clearPendingPlanId,
  paidPlanCheckoutIdFromSubscriptionTier,
  readPendingPlanId,
  setPendingPlanId,
  setPlanGateComplete,
} from '@/lib/plan-flow'
import { buildStripeCheckoutUrl, redeemPromoCode } from '@/lib/billing-api'
import { patchAuthSessionUser } from '@/lib/auth-session'
import { useState } from 'react'

const btnBase =
  'inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2'

type PlanMode = 'default' | 'upgrade'

export interface PlanSelectionViewProps {
  /** `upgrade` hides free tier — dashboard users upgrading via Stripe. */
  mode?: PlanMode
  className?: string
  onDone?: () => void
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function PlanSelectionView({ mode = 'default', className, onDone }: PlanSelectionViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user, refreshSession } = useAuth()
  const [busyId, setBusyId] = useState<PlanCheckoutId | null>(null)

  const tiers = mode === 'upgrade' ? PLAN_TIERS.filter((t) => t.id !== 'free') : PLAN_TIERS

  const activateFreeTierAndDashboard = async () => {
    if (!user?.id) return
    try {
      try {
        await redeemPromoCode({
          promoCode: 'FREE',
          userId: user.id,
          email: user.email,
          name: user.name,
        })
      } catch {
        /* optional gateway */
      }
      patchAuthSessionUser({ subscriptionTier: 'free', subscriptionStatus: 'active' })
      clearPendingPlanId()
      setPlanGateComplete(user.id)
      await refreshSession()
      toast({ title: 'Free plan active', description: 'Welcome to your workspace.' })
      router.replace('/dashboard')
      onDone?.()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    }
  }

  const redirectToStripeCheckout = (plan: Exclude<PlanCheckoutId, 'free'>) => {
    if (!user?.id) {
      toast({ title: 'Sign in required', description: 'Please sign in to continue to checkout.', variant: 'destructive' })
      return
    }
    try {
      const url = buildStripeCheckoutUrl(user.id, plan)
      setPendingPlanId(plan)
      window.location.href = url
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Checkout is unavailable.'
      toast({ title: 'Checkout', description: msg, variant: 'destructive' })
    }
  }

  const handleFree = async () => {
    if (!isAuthenticated || !user) {
      setPendingPlanId('free')
      router.push('/login?plan=free')
      onDone?.()
      return
    }
    setBusyId('free')
    try {
      await activateFreeTierAndDashboard()
    } finally {
      setBusyId(null)
    }
  }

  const handlePaidSelect = async (plan: Exclude<PlanCheckoutId, 'free'>) => {
    if (!isAuthenticated || !user) {
      setPendingPlanId(plan)
      router.push(`/login?plan=${plan}`)
      onDone?.()
      return
    }
    setBusyId(plan)
    try {
      if (mode === 'upgrade') {
        redirectToStripeCheckout(plan)
        return
      }
      setPendingPlanId(plan)
      router.push(`/checkout?plan=${plan}`)
      onDone?.()
    } finally {
      setBusyId(null)
    }
  }

  const handleSkip = () => {
    if (!user) {
      router.push('/login')
      onDone?.()
      return
    }
    setPlanGateComplete(user.id)
    patchAuthSessionUser({ subscriptionTier: 'free', subscriptionStatus: 'none' })
    void refreshSession()
    router.replace('/dashboard')
    onDone?.()
  }

  const isUpgrade = mode === 'upgrade'
  const linkedPaidPlan = isUpgrade ? paidPlanCheckoutIdFromSubscriptionTier(user?.subscriptionTier) : null

  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      <div className={cn('mx-auto text-center', isUpgrade ? 'max-w-2xl' : 'max-w-2xl')}>
        <h1 className="font-heading-recoleta text-3xl font-bold text-brand-navy sm:text-4xl">
          {isUpgrade ? 'Upgrade your plan' : 'Choose your plan'}
        </h1>
        <p className="mt-3 text-base text-neutral-600 sm:text-lg">
          {isUpgrade ? (
            <>
              Paid plans include a <span className="font-semibold text-brand-navy">7-day free trial</span>. You will be
              redirected to secure Stripe checkout.
            </>
          ) : (
            <>
              Paid plans include a <span className="font-semibold text-brand-navy">7-day free trial</span>; your card is
              charged after the trial unless you cancel in the Stripe customer portal (configured on the backend).
            </>
          )}
        </p>
        {readPendingPlanId() && !isAuthenticated && (
          <p className="mt-2 text-sm text-brand-cyan">You have a plan selected — sign in next to continue.</p>
        )}
      </div>

      <div
        className={cn(
          'grid gap-8',
          isUpgrade
            ? 'mx-auto mt-10 w-full max-w-4xl grid-cols-1 justify-items-stretch sm:grid-cols-2 sm:gap-8 lg:max-w-5xl'
            : 'mt-12 grid-cols-1 lg:grid-cols-3 lg:items-stretch lg:gap-6',
        )}
      >
        {tiers.map((tier) => {
          const popular = tier.highlight === 'popular'
          const loading = busyId === tier.id
          const isCurrentPlan = linkedPaidPlan !== null && tier.id === linkedPaidPlan
          return (
            <div
              key={tier.id}
              className={cn(
                'relative flex w-full max-w-md flex-col justify-self-center rounded-2xl border bg-surface p-6 shadow-sm transition duration-300 sm:p-8',
                isUpgrade && 'max-w-md',
                isCurrentPlan && 'border-emerald-200/90 bg-neutral-50/80 shadow-sm',
                !isCurrentPlan &&
                  (popular
                    ? 'border-brand-cyan/50 shadow-[0_8px_40px_-12px_rgba(0,180,216,0.35)] lg:z-10 lg:shadow-xl'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'),
              )}
            >
              {isCurrentPlan ? (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                  Current plan
                </div>
              ) : (
                popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-cyan px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                    Most popular
                  </div>
                )
              )}
              <div className={cn('mb-6 text-center', popular && 'pt-2')}>
                <h2 className="font-heading-recoleta text-2xl font-bold text-brand-navy">{tier.name}</h2>
                <p className="mt-2 text-sm text-neutral-600">{tier.subtitle}</p>
                <div className="mt-6 flex min-h-[5.5rem] flex-col items-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading-recoleta text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
                      {formatUsd(tier.monthlyUsd)}
                    </span>
                    <span className="text-base font-medium text-neutral-500">/month</span>
                  </div>
                </div>
              </div>
              <ul className="mb-8 flex flex-1 flex-col gap-3 text-left">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-neutral-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-bright" strokeWidth={2} aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {tier.id === 'free' ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleFree()}
                  className={cn(
                    btnBase,
                    'border-2 border-zinc-200 bg-surface text-brand-navy shadow-sm hover:border-brand-cyan/40 hover:bg-page',
                  )}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Start for free'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading || isCurrentPlan}
                  onClick={() => void handlePaidSelect(tier.id)}
                  className={cn(
                    btnBase,
                    isCurrentPlan &&
                      'cursor-not-allowed border border-neutral-200 bg-neutral-200 text-neutral-600 opacity-90 shadow-none hover:bg-neutral-200',
                    !isCurrentPlan &&
                      (popular
                        ? 'bg-brand-bright text-neutral-950 shadow-[0_0_28px_rgba(0,212,255,0.35)] hover:bg-surface'
                        : 'bg-brand-cyan text-white shadow-md hover:bg-sky-500'),
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isCurrentPlan ? (
                    'Your current plan'
                  ) : (
                    'Start free trial'
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {mode === 'default' && isAuthenticated && user && (
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-neutral-200/80 pt-8">
          <p className="text-sm text-neutral-500">Not ready to choose a paid plan?</p>
          <button
            type="button"
            onClick={() => handleSkip()}
            className="text-sm font-semibold text-brand-cyan underline-offset-2 hover:underline"
          >
            Skip for now — use free limits
          </button>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-neutral-500">
        Questions?{' '}
        <Link href="mailto:support@actionit.ai" className="font-medium text-brand-cyan hover:underline">
          support@actionit.ai
        </Link>
      </p>
    </div>
  )
}
