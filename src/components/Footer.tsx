import { Link, useLocation, useNavigate } from 'react-router-dom'

const productLinks = [
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
  { href: '/industries/legal', label: 'Legal' },
  { href: '/industries/healthcare', label: 'Healthcare' },
  { href: '/industries/consulting', label: 'Consulting' },
  { href: '/industries/sales', label: 'Sales' },
  { href: '/industries/enterprise', label: 'Enterprise' },
]

const featureLinks = [
  { href: '/features/dataless-architecture', label: 'Dataless Architecture' },
  { href: '/features/automatic-meeting-joining', label: 'Automatic Joining' },
  { href: '/features/speaker-diarization', label: 'Speaker Diarization' },
  { href: '/features/notion-integration', label: 'Notion Integration' },
]

export function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const onHash = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      void navigate({ pathname: '/', hash: href.slice(1) })
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="relative z-50 bg-neutral-100" style={{ pointerEvents: 'auto' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-16 lg:pt-20 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16">
            <div className="md:col-span-2 lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <img src="/ehanced_logo.png" alt="" width={40} height={40} className="rounded-lg" />
                <span
                  className="text-2xl font-semibold tracking-tight"
                  style={{ fontFamily: "'Recoleta Medium', sans-serif" }}
                >
                  <span className="text-[#2776EA]">actionit</span>
                  <span className="text-[#00B4D8]">.ai</span>
                </span>
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
              <h3
                className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Product
              </h3>
              <ul className="space-y-4">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => onHash(e, item.href)}
                      className="text-sm text-neutral-400 hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3
                className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Industries
              </h3>
              <ul className="space-y-4">
                {industries.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-neutral-400 hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer block"
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
                Features
              </h3>
              <ul className="space-y-4">
                {featureLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-neutral-400 hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer block"
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
                      to={item.href}
                      className="text-sm text-neutral-400 hover:text-[#00D4FF] transition-colors duration-200 cursor-pointer block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:info@actionit.ai"
                    className="text-sm text-neutral-400 hover:text-[#00D4FF] transition-colors duration-200"
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
              <span
                className="font-semibold tracking-tight"
                style={{ fontFamily: "'Recoleta Medium', sans-serif" }}
              >
                <span className="text-[#2776EA]">actionit</span>
                <span className="text-[#00B4D8]">.ai</span>
              </span>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
