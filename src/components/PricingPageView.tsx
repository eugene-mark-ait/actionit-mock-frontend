import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PricingPageContent } from '@/components/PricingPageContent'

export function PricingPageView() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-page">
      <Navbar />
      <main className="min-w-0">
        <PricingPageContent />
      </main>
      <Footer />
    </div>
  )
}
