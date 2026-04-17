'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FeaturesPageContent } from '@/components/FeaturesPageContent'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { scrollToHash } from '@/lib/scrollToHash'

export function FeaturesPageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/features') return
    const run = () => {
      const id = window.location.hash.slice(1)
      if (!id) return
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToHash(`#${id}`))
      })
    }
    run()
    window.addEventListener('hashchange', run)
    return () => window.removeEventListener('hashchange', run)
  }, [pathname])

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-page">
      <Navbar />
      <main className="min-w-0">
        <FeaturesPageContent />
      </main>
      <Footer />
    </div>
  )
}
