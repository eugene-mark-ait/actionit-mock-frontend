/**
 * Plan selection, onboarding gate, and Stripe checkout entrypoints.
 *
 * ASSUMPTIONS (no backend contract changes beyond optional env URL):
 * - Paid checkout: GET `${NEXT_PUBLIC_API_GATEWAY_URL}/stripe/checkout?userId=&plan=` where plan is `professional` | `business`.
 * - Free tier: POST `${NEXT_PUBLIC_API_GATEWAY_URL}/promo/redeem` with `promoCode: "FREE"` (same as legacy app).
 * - 7-day trial and webhooks are configured on Stripe / API Gateway; this app only redirects and stores optimistic status.
 */

import type { DashboardUser, SubscriptionStatus } from '@/types/user'

export type PlanCheckoutId = 'free' | 'professional' | 'business'

export type { SubscriptionStatus }

const PENDING_PLAN_KEY = 'actionit_pending_plan'
/** Set on `/login?plan=…` so OAuth callback can ignore stale paid `PENDING_PLAN_KEY` from an old tab/session. */
const PENDING_PLAN_LOGIN_QUERY_MARKER = 'actionit_pending_plan_login_query'

/** Per-user: user has completed plan onboarding (picked a plan or skipped). */
export function planGateStorageKey(userId: string): string {
  return `actionit_plan_gate_${userId}`
}

export function readPendingPlanId(): PlanCheckoutId | null {
  if (typeof window === 'undefined') return null
  try {
    const v = sessionStorage.getItem(PENDING_PLAN_KEY)?.trim()
    if (v === 'team') return 'business'
    if (v === 'free' || v === 'professional' || v === 'business') return v
    return null
  } catch {
    return null
  }
}

export function setPendingPlanId(plan: PlanCheckoutId): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(PENDING_PLAN_KEY, plan)
  } catch {
    /* ignore */
  }
}

/** Call from the sign-in page when `?plan=` is present so paid checkout after OAuth is intentional. */
export function markPendingPlanConfirmedByLoginQuery(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(PENDING_PLAN_LOGIN_QUERY_MARKER, '1')
  } catch {
    /* ignore */
  }
}

export function clearPendingPlanId(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(PENDING_PLAN_KEY)
    sessionStorage.removeItem(PENDING_PLAN_LOGIN_QUERY_MARKER)
  } catch {
    /* ignore */
  }
}

export function readPlanGateComplete(userId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(planGateStorageKey(userId)) === '1'
  } catch {
    return false
  }
}

export function setPlanGateComplete(userId: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(planGateStorageKey(userId), '1')
  } catch {
    /* ignore */
  }
}

/** Stripe `plan` query param expected by API Gateway (legacy naming). */
export function toStripePlanParam(plan: Exclude<PlanCheckoutId, 'free'>): 'professional' | 'business' {
  return plan === 'business' ? 'business' : 'professional'
}

export function isPaidPlan(plan: PlanCheckoutId): boolean {
  return plan === 'professional' || plan === 'business'
}

/**
 * Maps stored `subscriptionTier` (session / API) to a paid plan card id for upgrade UI.
 * Returns null for free, unknown, or empty values so no card is incorrectly disabled.
 */
export function paidPlanCheckoutIdFromSubscriptionTier(
  tier: string | undefined | null,
): Exclude<PlanCheckoutId, 'free'> | null {
  if (!tier?.trim()) return null
  const t = tier.trim().toLowerCase()
  if (t === 'free') return null
  if (t === 'business' || t === 'team') return 'business'
  if (t === 'professional' || t === 'pro' || t === 'paid' || t === 'vip') return 'professional'
  return null
}

/**
 * If sessionStorage still holds a paid plan from a prior visit but the user did not open `/login?plan=…`
 * in this flow, drop it so post-auth does not redirect to checkout.
 */
export function discardStalePaidPendingWithoutLoginQueryMarker(): void {
  if (typeof window === 'undefined') return
  try {
    const pending = readPendingPlanId()
    if (!pending || !isPaidPlan(pending)) return
    if (sessionStorage.getItem(PENDING_PLAN_LOGIN_QUERY_MARKER) !== '1') {
      clearPendingPlanId()
    }
  } catch {
    /* ignore */
  }
}

/**
 * First-time users (after auth) should pick a plan unless we already have subscription info or they completed the gate.
 */
export function shouldShowPlanOnboarding(user: DashboardUser): boolean {
  if (readPlanGateComplete(user.id)) return false
  const st = user.subscriptionStatus
  if (st === 'trialing' || st === 'active') return false
  if (st && st !== 'none') return false
  const tier = user.subscriptionTier
  if (tier === 'professional' || tier === 'business' || tier === 'team') return false
  return true
}
