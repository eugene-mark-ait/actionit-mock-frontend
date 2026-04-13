import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { navFeatures, navIndustries, navProductLinks } from '../data/siteContent'
import { scrollToHash as scrollToHashSmooth } from '../lib/scrollToHash'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<'product' | 'industries' | 'features' | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHashLink = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    if (isHome) {
      scrollToHashSmooth(href)
    } else {
      void navigate({ pathname: '/', hash: href.slice(1) })
    }
    setOpenDrop(null)
    setMobileOpen(false)
  }

  const handleRoute = (path: string) => {
    const hashIdx = path.indexOf('#')
    if (hashIdx !== -1) {
      const pathname = path.slice(0, hashIdx) || '/'
      const hashFrag = path.slice(hashIdx + 1)
      void navigate({ pathname, hash: hashFrag || undefined })
    } else {
      void navigate(path)
    }
    setOpenDrop(null)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-[200] w-full shrink-0 pointer-events-none bg-transparent">
      <div className="mx-auto w-full max-w-[920px] px-4 pt-3 pb-3 md:pt-4 md:pb-4">
        <nav
          className="pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 md:px-6 backdrop-blur-xl border-white/20 shadow-[0_2px_24px_rgba(0,0,0,0.12)] bg-black/[0.12] supports-[backdrop-filter]:bg-black/[0.08]"
          aria-label="Global navigation"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]/40 rounded-md shrink-0"
              aria-label="actionit.ai Home"
            >
              <img
                src="/ehanced_logo.png"
                alt="actionit.ai logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span
                className="text-lg md:text-xl font-semibold tracking-tight hidden sm:inline"
                style={{ fontFamily: "'Recoleta Medium', var(--font-display), sans-serif" }}
              >
                <span className="text-[#2776EA]">actionit</span>
                <span className="text-[#00B4D8]">.ai</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current)
                setOpenDrop('product')
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setOpenDrop(null), 120)
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-900/90 hover:text-zinc-950 px-3 py-2 rounded-md hover:bg-white/10"
                aria-expanded={openDrop === 'product'}
                onClick={() => setOpenDrop((v) => (v === 'product' ? null : 'product'))}
              >
                Product
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'product' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul
                    className="grid gap-1 p-2 w-[280px] rounded-xl border border-white/20 bg-black/25 backdrop-blur-xl shadow-lg"
                    role="menu"
                  >
                    {navProductLinks.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          role="menuitem"
                          className="block rounded-lg px-3 py-2 hover:bg-white/10"
                          onClick={(e) => handleHashLink(e, item.href)}
                        >
                          <span className="block font-medium text-zinc-100">{item.label}</span>
                          <span className="block text-xs text-zinc-400">{item.description}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current)
                setOpenDrop('industries')
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setOpenDrop(null), 120)
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-900/90 hover:text-zinc-950 px-3 py-2 rounded-md hover:bg-white/10"
                aria-expanded={openDrop === 'industries'}
                onClick={() => setOpenDrop((v) => (v === 'industries' ? null : 'industries'))}
              >
                Industries
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'industries' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul className="p-2 w-[220px] rounded-xl border border-white/20 bg-black/25 backdrop-blur-xl shadow-lg">
                    {navIndustries.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-zinc-100"
                          onClick={() => handleRoute(item.href)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current)
                setOpenDrop('features')
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setOpenDrop(null), 120)
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-900/90 hover:text-zinc-950 px-3 py-2 rounded-md hover:bg-white/10"
                aria-expanded={openDrop === 'features'}
                onClick={() => setOpenDrop((v) => (v === 'features' ? null : 'features'))}
              >
                Features
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'features' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul className="p-2 w-[260px] rounded-xl border border-white/20 bg-black/25 backdrop-blur-xl shadow-lg">
                    {navFeatures.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-zinc-100"
                          onClick={() => handleRoute(item.href)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full min-h-[44px] px-6 py-2.5 text-sm font-semibold bg-[#00B4D8] text-white shadow-sm hover:bg-[#0ea5e9] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
            >
              Get Started Free
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-900 hover:bg-white/10"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden pointer-events-auto mt-2 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xl p-4 shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-2 pt-1">Product</p>
              {navProductLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 px-2 rounded-lg text-zinc-100 font-medium hover:bg-white/10"
                  onClick={(e) => handleHashLink(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-white/15 my-2" />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-2">Industries</p>
              {navIndustries.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="text-left py-2 px-2 rounded-lg text-zinc-100 hover:bg-white/10"
                  onClick={() => handleRoute(item.href)}
                >
                  {item.label}
                </button>
              ))}
              <hr className="border-white/15 my-2" />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-2">Features</p>
              {navFeatures.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="text-left py-2 px-2 rounded-lg text-zinc-100 hover:bg-white/10"
                  onClick={() => handleRoute(item.href)}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/login"
                className="mt-3 inline-flex justify-center rounded-full py-3 font-semibold bg-[#00B4D8] text-white"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
