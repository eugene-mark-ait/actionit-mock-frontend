'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { scrollToHash } from '../lib/scrollToHash'
import { Navbar } from '../components/Navbar'
import { Hero, HeroFirstViewportBackdrop } from '../components/Hero'

const Footer = dynamic(() => import('../components/Footer').then((m) => ({ default: m.Footer })), {
  ssr: true,
})

const ProductSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.ProductSection })),
  { ssr: true },
)
const PartnerMarqueeSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.PartnerMarqueeSection })),
  { ssr: true },
)
const PillarsSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.PillarsSection })),
  { ssr: true },
)
const HowItWorksSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.HowItWorksSection })),
  { ssr: true },
)
const DemoSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.DemoSection })),
  { ssr: true },
)
const IntegrationsSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.IntegrationsSection })),
  { ssr: true },
)
const FAQSection = dynamic(
  () => import('../components/LandingSections').then((m) => ({ default: m.FAQSection })),
  { ssr: true },
)

export function HomePage() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return
    const run = () => {
      const hash = window.location.hash
      if (!hash) return
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToHash(hash))
      })
    }
    run()
    window.addEventListener('hashchange', run)
    return () => window.removeEventListener('hashchange', run)
  }, [pathname])

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-clip bg-page">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100dvh]">
        <HeroFirstViewportBackdrop />
      </div>
      <Navbar />
      <main className="relative z-10 min-w-0">
        <div className="relative flex min-h-[calc(100dvh-5rem)] flex-col">
          <Hero />
        </div>
        <ProductSection />
        <PartnerMarqueeSection />
        <PillarsSection />
        <HowItWorksSection />
        <DemoSection />
        <IntegrationsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
