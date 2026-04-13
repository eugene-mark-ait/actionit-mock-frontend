import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FeaturesPageContent } from '../components/FeaturesPageContent'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import {
  FEATURES_CANONICAL,
  FEATURES_PAGE_DESCRIPTION,
  FEATURES_PAGE_TITLE,
  featuresJsonLd,
  getFeaturesSocialMetaTags,
} from '../data/featuresSeo'
import { injectLinkTag, injectMetaTags } from '../lib/injectRouteMeta'
import { scrollToHash } from '../lib/scrollToHash'

export function FeaturesPage() {
  const location = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    document.title = FEATURES_PAGE_TITLE

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', FEATURES_PAGE_DESCRIPTION)

    const canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', FEATURES_CANONICAL)
    document.head.appendChild(canonical)

    const removeSocialMeta = injectMetaTags(getFeaturesSocialMetaTags())
    const removeSitemapLink = injectLinkTag('sitemap', '/sitemap.xml', { type: 'application/xml' })

    const scripts: HTMLScriptElement[] = []
    for (const data of featuresJsonLd) {
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
    if (location.pathname !== '/features') return
    const id = location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToHash(`#${id}`))
    })
  }, [location.hash, location.pathname])

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-[#fafafa]">
      <Navbar />
      <main className="min-w-0">
        <FeaturesPageContent />
      </main>
      <Footer />
    </div>
  )
}
