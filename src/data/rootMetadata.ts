import type { Metadata } from 'next'

export const rootMetadata: Metadata = {
  metadataBase: new URL('https://actionit.ai'),
  title:
    'Dataless AI | Action.IT - #1 Dataless AI Meeting Notetaker | Privacy-First Meeting Intelligence',
  description:
    'Action.IT is the #1 dataless AI meeting notetaker. The only dataless AI that automatically joins meetings, creates Notion meeting notes, and deletes recordings immediately. Privacy-first dataless AI with GDPR-compliant recording. Zero data storage.',
  icons: {
    icon: '/ehanced_logo.png',
  },
}
