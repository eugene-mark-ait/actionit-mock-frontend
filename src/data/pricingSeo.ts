import type { Metadata } from 'next'
import { FEATURES_OG_IMAGE } from './featuresSeo'

export const PRICING_CANONICAL = 'https://actionit.ai/pricing'

export const PRICING_PAGE_TITLE = 'Pricing | actionit.ai — Simple, Transparent Plans'

export const PRICING_PAGE_DESCRIPTION =
  'Choose a plan that fits your workflow. Free, Professional, and Team plans with dataless AI meeting intelligence, Notion integration, and privacy-first architecture.'

export const PRICING_OG_TITLE = 'Pricing | actionit.ai'

export const PRICING_OG_DESCRIPTION =
  'Simple, transparent pricing for individuals and teams. Start free or trial Professional and Team plans.'

export const pricingMetadata: Metadata = {
  title: PRICING_PAGE_TITLE,
  description: PRICING_PAGE_DESCRIPTION,
  authors: [{ name: 'Action.IT' }],
  alternates: { canonical: PRICING_CANONICAL },
  openGraph: {
    title: PRICING_OG_TITLE,
    description: PRICING_OG_DESCRIPTION,
    url: PRICING_CANONICAL,
    siteName: 'actionit.ai',
    locale: 'en_US',
    type: 'website',
    images: [{ url: FEATURES_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@action_it',
    creator: '@action_it',
    title: PRICING_OG_TITLE,
    description: PRICING_OG_DESCRIPTION,
    images: [FEATURES_OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

export const pricingJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: PRICING_OG_TITLE,
    description: PRICING_PAGE_DESCRIPTION,
    url: PRICING_CANONICAL,
  },
] as const
