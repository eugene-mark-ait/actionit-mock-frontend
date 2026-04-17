import { JsonLd } from '@/components/JsonLd'
import { featuresJsonLd, featuresMetadata } from '@/data/featuresSeo'
import type { Metadata } from 'next'

export const metadata: Metadata = featuresMetadata

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {featuresJsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {children}
    </>
  )
}
