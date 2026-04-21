import type { DashboardUser } from '@/types/user'
import { patchAuthSessionUser } from '@/lib/auth-session'
import { redeemPromoCode } from '@/lib/billing-api'
import {
  clearPendingPlanId,
  readPendingPlanId,
  setPlanGateComplete,
  isPaidPlan,
} from '@/lib/plan-flow'

/** Free tier after login when user chose Free on the landing flow. */
async function finalizeDefaultFreeTier(user: DashboardUser): Promise<void> {
  try {
    await redeemPromoCode({
      promoCode: 'FREE',
      userId: user.id,
      email: user.email,
      name: user.name,
    })
  } catch {
    /* Billing gateway optional in dev — still persist free tier client-side */
  }
  patchAuthSessionUser({
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
  })
  setPlanGateComplete(user.id)
  clearPendingPlanId()
}

/**
 * After OAuth or password login:
 * - Pending **free** → redeem / local free tier → `/dashboard`
 * - Pending **paid** → `/checkout?plan=…` (client then redirects to Stripe)
 * - **No** pending plan → `/dashboard` (skip forced `/plans` onboarding)
 */
export async function resolvePostAuthDestination(user: DashboardUser): Promise<string> {
  const pending = readPendingPlanId()

  if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing') {
    clearPendingPlanId()
    return '/dashboard'
  }

  if (pending === 'free') {
    await finalizeDefaultFreeTier(user)
    return '/dashboard'
  }

  if (pending && isPaidPlan(pending)) {
    return `/checkout?plan=${pending}`
  }

  return '/dashboard'
}
