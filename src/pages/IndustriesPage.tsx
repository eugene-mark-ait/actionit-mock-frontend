import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { IndustriesPageContent } from '../components/IndustriesPageContent'
import { Navbar } from '../components/Navbar'
import {
  INDUSTRIES_CANONICAL,
  INDUSTRIES_PAGE_DESCRIPTION,
  INDUSTRIES_PAGE_TITLE,
  getIndustriesSocialMetaTags,
  industriesJsonLd,
} from '../data/industriesSeo'
import { injectLinkTag, injectMetaTags } from '../lib/injectRouteMeta'
import { scrollToHash } from '../lib/scrollToHash'

export function IndustriesPage() {
  const location = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    document.title = INDUSTRIES_PAGE_TITLE

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', INDUSTRIES_PAGE_DESCRIPTION)

    const canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', INDUSTRIES_CANONICAL)
    document.head.appendChild(canonical)

    const removeSocialMeta = injectMetaTags(getIndustriesSocialMetaTags())
    const removeSitemapLink = injectLinkTag('sitemap', '/sitemap.xml', { type: 'application/xml' })

    const scripts: HTMLScriptElement[] = []
    for (const data of industriesJsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.textContent = JSON.stringify(data)
      document.head.appendChild(s)
      scripts.push(s)
    }

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
      canonical.remove()
      removeSocialMeta()
      removeSitemapLink()
      for (const s of scripts) {
        s.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (location.pathname !== '/industries') return
    const id = location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToHash(`#${id}`))
    })
  }, [location.hash, location.pathname])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main>
        <IndustriesPageContent />
      </main>
      <Footer />
    </div>
  )
}
