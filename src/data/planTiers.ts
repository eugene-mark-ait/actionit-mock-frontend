import type { PlanCheckoutId } from '@/lib/plan-flow'

export type { PlanCheckoutId }

/** Billing tiers — single source for pricing page and plan selection. */
export type PlanTierDef = {
  id: PlanCheckoutId
  name: string
  subtitle: string
  monthlyUsd: number
  features: string[]
  highlight?: 'popular'
}

export const PLAN_TIERS: PlanTierDef[] = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Perfect for trying out actionit.ai',
    monthlyUsd: 0,
    features: [
      '3 meeting transcription per month',
      'AI-powered meeting summaries',
      'Notion integration',
      'Calendar integration',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'Perfect for individuals and small teams',
    monthlyUsd: 22.99,
    features: [
      'Unlimited meeting transcription',
      'AI-powered meeting summaries',
      'Notion integration',
      'Email notifications',
      'Calendar integration',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    subtitle: 'For teams and organisations',
    monthlyUsd: 55.99,
    features: [
      'Everything in Professional',
      'Advanced analytics & insights',
      'Team collaboration features',
      'Priority support',
      'Custom integrations',
    ],
    highlight: 'popular',
  },
]
