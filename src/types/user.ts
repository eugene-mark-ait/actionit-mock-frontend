/** Stripe / product subscription lifecycle (optimistic client mirror until API sync). */
export type SubscriptionStatus =
  | 'none'
  | 'trialing'
  | 'active'
  | 'canceled'
  | 'past_due'

/** Authenticated dashboard user (Lambda OAuth or demo). */
export interface DashboardUser {
  id: string
  email: string
  name: string
  picture?: string
  verified_email?: boolean
  recallCalendarId?: string
  recallCalendarStatus?: string
  /** ISO 8601 — from API when available */
  createdAt?: string
  /** e.g. "free", "professional", "business" — from API when available */
  subscriptionTier?: string
  /** Set after checkout / promo / webhook-aware updates when available */
  subscriptionStatus?: SubscriptionStatus
}
