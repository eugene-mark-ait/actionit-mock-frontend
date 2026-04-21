/**
 * Billing API Gateway: Stripe checkout and promo redeem only (`NEXT_PUBLIC_API_GATEWAY_URL`).
 * Account deletion uses `NEXT_PUBLIC_DELETE_ACCOUNT_API_GATEWAY_URL` in `delete-account-api.ts`.
 */

import { toStripePlanParam, type PlanCheckoutId } from '@/lib/plan-flow'

export function getApiGatewayBase(): string {
  return (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_GATEWAY_URL?.trim() : '') || ''
}

export function assertApiGatewayConfigured(): string {
  const base = getApiGatewayBase().replace(/\/$/, '')
  if (!base) {
    throw new Error('Billing API is not configured (set NEXT_PUBLIC_API_GATEWAY_URL).')
  }
  return base
}

/**
 * Browser redirect to API-hosted Stripe Checkout.
 * Configure the checkout session on the gateway so `success_url` includes:
 * `{ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan={professional|business}` (optional plan),
 * and `cancel_url` → `{ORIGIN}/checkout/cancel` for the cancel flow in this app.
 */
export function buildStripeCheckoutUrl(userId: string, plan: Exclude<PlanCheckoutId, 'free'>): string {
  const base = assertApiGatewayConfigured()
  const stripePlan = toStripePlanParam(plan)
  const q = new URLSearchParams({ userId, plan: stripePlan })
  return `${base}/stripe/checkout?${q.toString()}`
}

export interface RedeemPromoResponse {
  success?: boolean
  error?: string
  message?: string
}

export async function redeemPromoCode(body: {
  promoCode: string
  userId: string
  email: string
  name: string
}): Promise<RedeemPromoResponse> {
  const base = assertApiGatewayConfigured()
  const res = await fetch(`${base}/promo/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as RedeemPromoResponse
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Promo redeem failed (${res.status})`)
  }
  return data
}
