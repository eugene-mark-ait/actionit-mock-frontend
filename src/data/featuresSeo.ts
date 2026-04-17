import type { Metadata } from 'next'
import type { RouteMetaTag } from '../lib/injectRouteMeta'

/** Matches production home-style copy; canonical + og:url use /features */
export const FEATURES_CANONICAL = 'https://actionit.ai/features'

export const FEATURES_PAGE_TITLE =
  'Dataless AI | Action.IT - #1 Dataless AI Meeting Notetaker | Privacy-First Meeting Intelligence'

export const FEATURES_PAGE_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI with GDPR-compliant recording. Zero data storage.'

export const FEATURES_OG_IMAGE =
  'https://actionit-assets-1759560282.s3.us-east-1.amazonaws.com/actionit-website-hotlink-banner.png'

export const FEATURES_KEYWORDS =
  'dataless ai, dataless AI, dataless ai meeting notetaker, dataless ai meeting assistant, dataless ai notetaker, what is dataless ai, best dataless ai, dataless ai software, dataless ai platform, privacy-first dataless ai, action it, actionit, action.it, notion meeting notes, gdpr recording meetings, tracking action items, notion meeting, meeting notes notion, ai meeting assistant, notion integration, gdpr compliant meeting recorder, automatic meeting notes, ai meeting bot, meeting intelligence, action items from meetings, dataless meeting recorder, privacy-first ai, secure meeting assistant'

/** Shorter strings for og:title / twitter:title (per live site) */
export const FEATURES_OG_TITLE = 'Dataless AI | Action.IT - #1 Dataless AI Meeting Notetaker'

export const FEATURES_OG_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI.'

export const FEATURES_TWITTER_DESCRIPTION =
  'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings and deletes recordings immediately. Privacy-first dataless AI.'

export const featuresMetadata: Metadata = {
  title: FEATURES_PAGE_TITLE,
  description: FEATURES_PAGE_DESCRIPTION,
  keywords: FEATURES_KEYWORDS.split(', '),
  authors: [{ name: 'Action.IT' }],
  alternates: { canonical: FEATURES_CANONICAL },
  openGraph: {
    title: FEATURES_OG_TITLE,
    description: FEATURES_OG_DESCRIPTION,
    url: FEATURES_CANONICAL,
    siteName: 'Action.IT',
    locale: 'en_US',
    type: 'website',
    images: [{ url: FEATURES_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@action_it',
    creator: '@action_it',
    title: FEATURES_OG_TITLE,
    description: FEATURES_TWITTER_DESCRIPTION,
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

/** Extra head tags for /features (OG, Twitter, robots)—injected alongside title/description. */
export function getFeaturesSocialMetaTags(): RouteMetaTag[] {
  return [
    { type: 'name', name: 'keywords', content: FEATURES_KEYWORDS },
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
    { type: 'property', property: 'og:title', content: FEATURES_OG_TITLE },
    { type: 'property', property: 'og:description', content: FEATURES_OG_DESCRIPTION },
    { type: 'property', property: 'og:type', content: 'website' },
    { type: 'property', property: 'og:url', content: FEATURES_CANONICAL },
    { type: 'property', property: 'og:image', content: FEATURES_OG_IMAGE },
    { type: 'property', property: 'og:image:width', content: '1200' },
    { type: 'property', property: 'og:image:height', content: '630' },
    { type: 'property', property: 'og:site_name', content: 'Action.IT' },
    { type: 'property', property: 'og:locale', content: 'en_US' },
    { type: 'name', name: 'twitter:card', content: 'summary_large_image' },
    { type: 'name', name: 'twitter:site', content: '@action_it' },
    { type: 'name', name: 'twitter:creator', content: '@action_it' },
    { type: 'name', name: 'twitter:title', content: FEATURES_OG_TITLE },
    { type: 'name', name: 'twitter:description', content: FEATURES_TWITTER_DESCRIPTION },
    { type: 'name', name: 'twitter:image', content: FEATURES_OG_IMAGE },
  ]
}

export const featuresJsonLd: Record<string, unknown>[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Action.IT',
    alternateName: ['action it', 'actionit', 'action.it', 'Action IT', 'ActionIT', 'Dataless AI', 'dataless ai'],
    url: 'https://actionit.ai',
    logo: 'https://actionit-assets-1759560282.s3.us-east-1.amazonaws.com/actionit-website-hotlink-banner.png',
    description:
      'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI with GDPR-compliant recording.',
    sameAs: ['https://twitter.com/action_it'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@actionit.ai',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Action.IT',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      "Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, tracks action items, and posts Notion meeting notes. GDPR-compliant recording meetings with dataless AI architecture that processes and deletes recordings immediately.",
    alternateName: 'Dataless AI',
    featureList: [
      'Dataless AI meeting notetaker',
      'Dataless AI architecture',
      'Notion meeting notes',
      'GDPR recording meetings',
      'Tracking action items',
      'Automatic meeting joining',
      'AI-powered transcription',
      'Action item extraction',
      'Meeting summaries',
      'Notion integration',
      'Zero data storage',
      'Immediate deletion',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is dataless AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dataless AI is a revolutionary approach to AI meeting assistants that processes and deletes recordings immediately after transcription. Action.IT is the #1 dataless AI meeting notetaker - unlike other AI tools that store your data forever, dataless AI ensures privacy by architecture, not just policy. Our dataless AI processes meetings, delivers insights, then deletes everything immediately.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Action.IT for Notion meeting notes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Action.IT automatically creates Notion meeting notes by joining your meetings, transcribing them in real-time, and posting comprehensive summaries directly to your Notion workspace. No manual work required – your Notion meeting notes are created automatically after every meeting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Action.IT GDPR compliant for recording meetings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Action.IT is fully GDPR compliant for recording meetings. Our dataless architecture processes and deletes recordings immediately after transcription, ensuring no data is stored long-term. This makes Action.IT ideal for organizations requiring GDPR-compliant recording meetings.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Action.IT track action items from meetings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Action.IT uses AI to automatically identify and extract action items from meetings, then tracks them in your Notion meeting notes. Action items are highlighted, assigned to team members, and synced to your project management tools, ensuring nothing falls through the cracks.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Action.IT integrate with Notion for meeting notes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Action.IT seamlessly integrates with Notion to automatically create Notion meeting notes. After each meeting, summaries, action items, and key decisions are posted directly to your Notion workspace. You can also use the /actionit command in any Notion page to trigger meeting recording.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Action.IT the best solution for Notion meeting notes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Action.IT is the best solution for Notion meeting notes because it automatically creates comprehensive meeting notes, tracks action items, and ensures GDPR-compliant recording meetings. All without manual work – your Notion meeting notes are created automatically.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://actionit.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Features',
        item: 'https://actionit.ai/features',
      },
    ],
  },
]
