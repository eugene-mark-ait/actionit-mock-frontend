import type { Metadata } from 'next'
import type { RouteMetaTag } from '../lib/injectRouteMeta'
import { FEATURES_OG_IMAGE, featuresJsonLd } from './featuresSeo'

/** Aligns with production home-style head; canonical + og:url target /industries */
export const INDUSTRIES_PAGE_TITLE =
  'Dataless AI | Action.IT - #1 Dataless AI Meeting Notetaker | Privacy-First Meeting Intelligence'

export const INDUSTRIES_PAGE_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI with GDPR-compliant recording. Zero data storage.'

export const INDUSTRIES_KEYWORDS =
  'dataless ai, dataless AI, dataless ai meeting notetaker, dataless ai meeting assistant, dataless ai notetaker, what is dataless ai, best dataless ai, dataless ai software, dataless ai platform, privacy-first dataless ai, action it, actionit, action.it, notion meeting notes, gdpr recording meetings, tracking action items, notion meeting, meeting notes notion, ai meeting assistant, notion integration, gdpr compliant meeting recorder, automatic meeting notes, ai meeting bot, meeting intelligence, action items from meetings, dataless meeting recorder, privacy-first ai, secure meeting assistant'

export const INDUSTRIES_CANONICAL = 'https://actionit.ai/industries'

/** Shorter OG / Twitter titles per original site */
export const INDUSTRIES_OG_TITLE = 'Dataless AI | Action.IT - #1 Dataless AI Meeting Notetaker'

export const INDUSTRIES_OG_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI.'

export const INDUSTRIES_TWITTER_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings and deletes recordings immediately. Privacy-first dataless AI.'

export const industriesMetadata: Metadata = {
  title: INDUSTRIES_PAGE_TITLE,
  description: INDUSTRIES_PAGE_DESCRIPTION,
  keywords: INDUSTRIES_KEYWORDS.split(', '),
  authors: [{ name: 'Action.IT' }],
  alternates: { canonical: INDUSTRIES_CANONICAL },
  openGraph: {
    title: INDUSTRIES_OG_TITLE,
    description: INDUSTRIES_OG_DESCRIPTION,
    url: INDUSTRIES_CANONICAL,
    siteName: 'Action.IT',
    locale: 'en_US',
    type: 'website',
    images: [{ url: FEATURES_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@action_it',
    creator: '@action_it',
    title: INDUSTRIES_OG_TITLE,
    description: INDUSTRIES_TWITTER_DESCRIPTION,
    images: [FEATURES_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  other: {
    bingbot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
}

export function getIndustriesSocialMetaTags(): RouteMetaTag[] {
  return [
    { type: 'name', name: 'keywords', content: INDUSTRIES_KEYWORDS },
    { type: 'name', name: 'author', content: 'Action.IT' },
    {
      type: 'name',
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      type: 'name',
      name: 'googlebot',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      type: 'name',
      name: 'bingbot',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    { type: 'property', property: 'og:title', content: INDUSTRIES_OG_TITLE },
    { type: 'property', property: 'og:description', content: INDUSTRIES_OG_DESCRIPTION },
    { type: 'property', property: 'og:type', content: 'website' },
    { type: 'property', property: 'og:url', content: INDUSTRIES_CANONICAL },
    { type: 'property', property: 'og:image', content: FEATURES_OG_IMAGE },
    { type: 'property', property: 'og:image:width', content: '1200' },
    { type: 'property', property: 'og:image:height', content: '630' },
    { type: 'property', property: 'og:site_name', content: 'Action.IT' },
    { type: 'property', property: 'og:locale', content: 'en_US' },
    { type: 'name', name: 'twitter:card', content: 'summary_large_image' },
    { type: 'name', name: 'twitter:site', content: '@action_it' },
    { type: 'name', name: 'twitter:creator', content: '@action_it' },
    { type: 'name', name: 'twitter:title', content: INDUSTRIES_OG_TITLE },
    { type: 'name', name: 'twitter:description', content: INDUSTRIES_TWITTER_DESCRIPTION },
    { type: 'name', name: 'twitter:image', content: FEATURES_OG_IMAGE },
  ]
}

/** Organization + SoftwareApplication + FAQPage from features; breadcrumb includes Industries */
export const industriesJsonLd: Record<string, unknown>[] = [
  ...featuresJsonLd.slice(0, 3),
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://actionit.ai' },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: INDUSTRIES_CANONICAL },
    ],
  },
]
