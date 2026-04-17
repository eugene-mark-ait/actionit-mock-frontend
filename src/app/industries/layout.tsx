import { JsonLd } from '@/components/JsonLd'
import { industriesJsonLd, industriesMetadata } from '@/data/industriesSeo'
import type { Metadata } from 'next'

export const metadata: Metadata = industriesMetadata

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {industriesJsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {children}
    </>
  )
}
