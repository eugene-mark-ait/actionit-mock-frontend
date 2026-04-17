'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { IndustriesPageContent } from '@/components/IndustriesPageContent'
import { Navbar } from '@/components/Navbar'
import { scrollToHash } from '@/lib/scrollToHash'

export function IndustriesPageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/industries') return
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
        <IndustriesPageContent />
      </main>
      <Footer />
    </div>
  )
}
