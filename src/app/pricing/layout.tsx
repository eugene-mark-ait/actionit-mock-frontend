import { JsonLd } from '@/components/JsonLd'
import { pricingJsonLd, pricingMetadata } from '@/data/pricingSeo'
import type { Metadata } from 'next'

export const metadata: Metadata = pricingMetadata

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {pricingJsonLd.map((data, i) => (
        <JsonLd key={i} data={data as Record<string, unknown>} />
      ))}
      {children}
    </>
  )
}
