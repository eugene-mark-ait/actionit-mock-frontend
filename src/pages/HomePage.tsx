import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Hero, HeroFirstViewportBackdrop } from '../components/Hero'
import {
  DemoSection,
  FAQSection,
  HowItWorksSection,
  IntegrationsSection,
  PartnerMarqueeSection,
  PillarsSection,
  ProductSection,
} from '../components/LandingSections'
import { Footer } from '../components/Footer'

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.hash])

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100dvh]">
        <HeroFirstViewportBackdrop />
      </div>
      <Navbar />
      <main className="relative z-10">
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
