'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Shown in UI and used for annual price math (effective monthly = list × (1 − rate)). */
export const ANNUAL_SAVINGS_PERCENT = 20
const ANNUAL_SAVINGS_RATE = ANNUAL_SAVINGS_PERCENT / 100

type TierId = 'free' | 'professional' | 'team'

type TierDef = {
  id: TierId
  name: string
  subtitle: string
  /** Monthly list price (USD). 0 = free. */
  monthlyUsd: number
  features: string[]
  cta: { href: string; label: string; variant: 'secondary' | 'primary' | 'emphasis' }
  highlight?: 'popular'
}

const tiers: TierDef[] = [
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
    cta: { href: '/login', label: 'Start for free', variant: 'secondary' },
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
    cta: { href: '/login', label: 'Start free trial', variant: 'primary' },
  },
  {
    id: 'team',
    name: 'Team',
    subtitle: 'For teams and organisations',
    monthlyUsd: 55.99,
    features: [
      'Everything in Professional',
      'Advanced analytics & insights',
      'Team collaboration features',
      'Priority support',
      'Custom integrations',
    ],
    cta: { href: '/login', label: 'Start Free trial', variant: 'emphasis' },
    highlight: 'popular',
  },
]

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Effective monthly rate when annual billing discount is applied. */
function effectiveMonthlyAnnual(monthlyList: number) {
  return Math.round(monthlyList * (1 - ANNUAL_SAVINGS_RATE) * 100) / 100
}

function TierCta({
  href,
  label,
  variant,
}: {
  href: string
  label: string
  variant: 'secondary' | 'primary' | 'emphasis'
}) {
  const base =
    'inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2'
  const styles = {
    secondary: cn(
      base,
      'border-2 border-zinc-200 bg-surface text-brand-navy shadow-sm hover:border-brand-cyan/40 hover:bg-page',
    ),
    primary: cn(base, 'bg-brand-cyan text-white shadow-md hover:bg-sky-500'),
    emphasis: cn(
      base,
      'bg-brand-bright text-neutral-950 shadow-[0_0_28px_rgba(0,212,255,0.35)] hover:bg-surface',
    ),
  }
  return (
    <Link href={href} className={styles[variant]}>
      {label}
    </Link>
  )
}

function BillingSwitch({
  annual,
  onAnnualChange,
}: {
  annual: boolean
  onAnnualChange: (annual: boolean) => void
}) {
  const id = 'pricing-billing-switch'
  return (
    <div
      className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <span
        id={`${id}-label`}
        className="sr-only"
      >
        Billing period
      </span>
      <span
        className={cn(
          'text-sm font-semibold transition-colors',
          !annual ? 'text-brand-navy' : 'text-neutral-400',
        )}
      >
        Monthly
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={annual}
        aria-label={annual ? 'Annual billing' : 'Monthly billing'}
        onClick={() => onAnnualChange(!annual)}
        className={cn(
          'relative inline-flex h-9 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent px-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2',
          annual ? 'bg-brand-cyan' : 'bg-zinc-300',
        )}
      >
        <span
          className={cn(
            'pointer-events-none h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-out',
            annual ? 'translate-x-5' : 'translate-x-0',
          )}
          aria-hidden
        />
      </button>
      <div className="flex flex-col items-center gap-0.5 sm:items-start">
        <span
          className={cn(
            'text-sm font-semibold transition-colors',
            annual ? 'text-brand-navy' : 'text-neutral-400',
          )}
        >
          Annual
        </span>
        <span className="text-xs font-semibold text-emerald-600">Save up to 20%</span>
      </div>
    </div>
  )
}

function TierPrice({
  monthlyUsd,
  annual,
}: {
  monthlyUsd: number
  annual: boolean
}) {
  if (monthlyUsd === 0) {
    return (
      <div className="mt-6 flex min-h-[5.5rem] flex-col items-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-heading-recoleta text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
            {formatUsd(0)}
          </span>
          <span className="text-base font-medium text-neutral-500">/month</span>
        </div>
        <p className="min-h-[2.5rem] text-center text-xs text-transparent" aria-hidden>
          &nbsp;
        </p>
      </div>
    )
  }

  const monthlyList = monthlyUsd
  const show = annual ? effectiveMonthlyAnnual(monthlyList) : monthlyList
  const yearlyTotal = Math.round(monthlyList * 12 * (1 - ANNUAL_SAVINGS_RATE) * 100) / 100

  return (
    <div className="mt-6 flex min-h-[5.5rem] flex-col items-center gap-1">
      <div className="flex items-baseline justify-center gap-1">
        <span className="font-heading-recoleta text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
          {formatUsd(show)}
        </span>
        <span className="text-base font-medium text-neutral-500">/month</span>
      </div>
      <p
        className={cn(
          'min-h-[2.5rem] text-center text-xs text-neutral-500',
          !annual && 'text-transparent',
        )}
      >
        {annual ? `${formatUsd(yearlyTotal)} per year, billed annually` : '\u00a0'}
      </p>
    </div>
  )
}

export function PricingPageContent() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="bg-page" data-pricing-annual-savings={ANNUAL_SAVINGS_PERCENT}>
      <section className="relative overflow-hidden pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pb-16 lg:pt-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta text-4xl font-bold text-brand-navy sm:text-5xl md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            Choose the plan that fits your workflow. Upgrade or downgrade anytime, all plans include our
            dataless AI approach to meeting intelligence.
          </p>
          <BillingSwitch annual={annual} onAnnualChange={setAnnual} />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6">
            {tiers.map((tier) => {
              const popular = tier.highlight === 'popular'
              return (
                <div
                  key={tier.id}
                  className={cn(
                    'relative flex flex-col rounded-2xl border bg-surface p-8 shadow-sm transition duration-300',
                    popular
                      ? 'border-brand-cyan/50 shadow-[0_8px_40px_-12px_rgba(0,180,216,0.35)] lg:z-10 lg:scale-[1.02] lg:shadow-xl'
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                  )}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-cyan px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                      Most popular
                    </div>
                  )}
                  <div className={cn('mb-6 text-center', popular && 'pt-2')}>
                    <h2 className="font-heading-recoleta text-2xl font-bold text-brand-navy">{tier.name}</h2>
                    <p className="mt-2 text-sm text-neutral-600">{tier.subtitle}</p>
                    <TierPrice monthlyUsd={tier.monthlyUsd} annual={annual} />
                  </div>
                  <ul className="mb-8 flex flex-1 flex-col gap-3 text-left">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-neutral-700">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-brand-bright"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <TierCta href={tier.cta.href} label={tier.cta.label} variant={tier.cta.variant} />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
