'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandWordmark } from '@/components/BrandWordmark'
import { SiteImage } from '@/components/SiteImage'
import { scrollToHash } from '../lib/scrollToHash'

const productLinks = [
  { href: '/pricing', label: 'Pricing' },
  { href: '#product', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#security', label: 'Security' },
]

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/TOS', label: 'Terms of Service' },
]

const industries = [
  { href: '/industries#legal', label: 'Legal' },
  { href: '/industries#healthcare', label: 'Healthcare' },
  { href: '/industries#consulting', label: 'Consulting' },
  { href: '/industries#sales', label: 'Sales' },
  { href: '/industries#enterprise', label: 'Enterprise' },
]

const featureLinks = [
  { href: '/features#dataless-architecture', label: 'Dataless Architecture' },
  { href: '/features#automatic-meeting-joining', label: 'Automatic Joining' },
  { href: '/features#speaker-diarization', label: 'Speaker Diarization' },
  { href: '/features#notion-integration', label: 'Notion Integration' },
]

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const onHash = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    if (isHome) {
      scrollToHash(href)
    } else {
      router.push(`/#${href.slice(1)}`)
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="pointer-events-auto relative z-50 border-t border-neutral-200/80 bg-page">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-16 lg:pt-20 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16">
            <div className="md:col-span-2 lg:col-span-2">
              <Link href="/" className="mb-6 inline-flex items-center gap-3">
                <SiteImage src="/ehanced_logo.png" alt="" width={40} height={40} className="rounded-lg" />
                <BrandWordmark className="font-navbar-mark text-2xl font-semibold tracking-tight" />
              </Link>
              <p className="text-neutral-400 leading-relaxed mb-6 max-w-sm">
                The AI meeting assistant that joins your calls, posts summaries to your tools, then wipes
                the slate clean. Privacy first, always.
              </p>
              <address className="not-italic text-sm text-neutral-500">
                8 The Green, Suite B
                <br />
                Dover, DE 19901
                <br />
                United States
              </address>
            </div>

            <div className="hidden md:block">
              <h3 className="font-label-display mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-800">
                Product
              </h3>
              <ul className="space-y-4">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith('#') ? (
                      <a
                        href={item.href}
                        onClick={(e) => onHash(e, item.href)}
                        className="block cursor-pointer text-sm text-neutral-400 transition-colors duration-200 hover:text-brand-bright"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-sm text-neutral-400 transition-colors duration-200 hover:text-brand-bright"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="font-label-display mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-800">
                Industries
              </h3>
              <ul className="space-y-4">
                {industries.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-400 hover:text-brand-bright transition-colors duration-200 cursor-pointer block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="font-label-display mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-800">
                Features
              </h3>
              <ul className="space-y-4">
                {featureLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-400 hover:text-brand-bright transition-colors duration-200 cursor-pointer block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3
                className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Legal
              </h3>
              <ul className="space-y-4">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-400 hover:text-brand-bright transition-colors duration-200 cursor-pointer block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:info@actionit.ai"
                    className="text-sm text-neutral-400 hover:text-brand-bright transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8">
            <p className="text-sm text-neutral-400 text-center sm:text-left">
              © {year}{' '}
              <BrandWordmark className="font-navbar-mark inline font-semibold tracking-tight" />
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
