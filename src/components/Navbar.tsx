'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { BrandWordmark } from '@/components/BrandWordmark'
import { SiteImage } from '@/components/SiteImage'
import { useAuth } from '@/context/AuthContext'
import { navFeatures, navIndustries, navProductLinks } from '../data/siteContent'
import { cn } from '../lib/cn'
import { scrollToHash as scrollToHashSmooth } from '../lib/scrollToHash'

const dropdownPanelClass =
  'rounded-xl border border-zinc-800/70 bg-zinc-950/92 backdrop-blur-xl shadow-xl shadow-black/40'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const showDashboardNav = !authLoading && isAuthenticated
  const isHome = pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  /** Mobile / tablet drawer: which nav group is expanded (accordion — one at a time, default all collapsed). */
  const [mobileSection, setMobileSection] = useState<'product' | 'industries' | 'features' | null>(null)
  const [openDrop, setOpenDrop] = useState<'product' | 'industries' | 'features' | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHashLink = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    if (isHome) {
      scrollToHashSmooth(href)
    } else {
      router.push(`/#${href.slice(1)}`)
    }
    setOpenDrop(null)
    setMobileSection(null)
    setMobileOpen(false)
  }

  const handleRoute = (path: string) => {
    const hashIdx = path.indexOf('#')
    if (hashIdx !== -1) {
      const pathOnly = path.slice(0, hashIdx) || '/'
      const hashFrag = path.slice(hashIdx + 1)
      const href = hashFrag ? `${pathOnly}#${hashFrag}` : pathOnly
      router.push(href)
    } else {
      router.push(path)
    }
    setOpenDrop(null)
    setMobileSection(null)
    setMobileOpen(false)
  }

  const toggleMobileSection = (section: 'product' | 'industries' | 'features') => {
    setMobileSection((prev) => (prev === section ? null : section))
  }

  return (
    <header className="sticky top-0 z-[200] w-full min-w-0 shrink-0 pointer-events-none bg-transparent">
      <div className="mx-auto w-full max-w-7xl px-4 pt-3 pb-3 sm:px-6 md:px-10 md:pt-4 md:pb-4 lg:px-16 xl:px-24">
        <nav
          className="pointer-events-auto flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/55 bg-white/65 px-2.5 py-2.5 shadow-[0_2px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/[0.58] sm:gap-3 sm:px-4 md:gap-4 md:px-6"
          aria-label="Global navigation"
        >
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href="/"
              className="flex min-w-0 max-w-full flex-1 items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/40 sm:gap-2"
              aria-label="actionit.ai Home"
            >
              <SiteImage
                src="/ehanced_logo.png"
                alt="actionit.ai logo"
                width={40}
                height={40}
                className="h-8 w-8 shrink-0 rounded-md sm:h-10 sm:w-10"
                priority
              />
              <BrandWordmark className="font-navbar-mark block min-w-0 flex-1 truncate text-sm font-semibold leading-tight tracking-tight sm:text-base md:text-xl" />
            </Link>
          </div>

          <div className="hidden lg:flex lg:min-w-0 lg:items-center lg:gap-1">
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
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-900/90 hover:bg-zinc-100 hover:text-zinc-950"
                aria-expanded={openDrop === 'product'}
                onClick={() => setOpenDrop((v) => (v === 'product' ? null : 'product'))}
              >
                Product
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'product' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul className={cn('grid w-[280px] gap-1 p-2', dropdownPanelClass)} role="menu">
                    {navProductLinks.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          role="menuitem"
                          className="block rounded-lg px-3 py-2 hover:bg-white/12"
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
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-900/90 hover:bg-zinc-100 hover:text-zinc-950"
                aria-expanded={openDrop === 'industries'}
                onClick={() => setOpenDrop((v) => (v === 'industries' ? null : 'industries'))}
              >
                Industries
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'industries' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul className={cn('w-[220px] p-2', dropdownPanelClass)}>
                    {navIndustries.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/12"
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
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-900/90 hover:bg-zinc-100 hover:text-zinc-950"
                aria-expanded={openDrop === 'features'}
                onClick={() => setOpenDrop((v) => (v === 'features' ? null : 'features'))}
              >
                Features
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              {openDrop === 'features' && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ul className={cn('w-[260px] p-2', dropdownPanelClass)}>
                    {navFeatures.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/12"
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

            <Link
              href="/pricing"
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/pricing'
                  ? 'bg-brand-cyan/10 text-brand-cyan'
                  : 'text-zinc-900/90 hover:bg-zinc-100 hover:text-zinc-950',
              )}
            >
              Pricing
            </Link>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <Link
              href={showDashboardNav ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center rounded-full min-h-[44px] px-6 py-2.5 text-sm font-semibold bg-[#00B4D8] text-white shadow-sm hover:bg-[#0ea5e9] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
            >
              {showDashboardNav ? 'Dashboard' : 'Get Started'}
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-900 hover:bg-black/[0.06] lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setMobileOpen((v) => {
                const next = !v
                if (!next) setMobileSection(null)
                return next
              })
            }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div
            className={cn(
              'pointer-events-auto mt-2 p-3 sm:p-4 lg:hidden',
              dropdownPanelClass,
              'rounded-2xl border-zinc-800/80',
            )}
          >
            <div className="flex flex-col">
              <div className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-3 text-left text-sm font-semibold text-zinc-100 hover:bg-white/10"
                  aria-expanded={mobileSection === 'product'}
                  onClick={() => toggleMobileSection('product')}
                >
                  <span>Product</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200',
                      mobileSection === 'product' && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                {mobileSection === 'product' && (
                  <div className="space-y-0.5 pb-3 pl-1">
                    {navProductLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-2 py-2.5 text-sm font-medium text-zinc-100 hover:bg-white/12"
                        onClick={(e) => handleHashLink(e, item.href)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-3 text-left text-sm font-semibold text-zinc-100 hover:bg-white/10"
                  aria-expanded={mobileSection === 'industries'}
                  onClick={() => toggleMobileSection('industries')}
                >
                  <span>Industries</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200',
                      mobileSection === 'industries' && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                {mobileSection === 'industries' && (
                  <div className="space-y-0.5 pb-3 pl-1">
                    {navIndustries.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        className="w-full rounded-lg px-2 py-2.5 text-left text-sm text-zinc-100 hover:bg-white/12"
                        onClick={() => handleRoute(item.href)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-3 text-left text-sm font-semibold text-zinc-100 hover:bg-white/10"
                  aria-expanded={mobileSection === 'features'}
                  onClick={() => toggleMobileSection('features')}
                >
                  <span>Features</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200',
                      mobileSection === 'features' && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                {mobileSection === 'features' && (
                  <div className="space-y-0.5 pb-3 pl-1">
                    {navFeatures.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        className="w-full rounded-lg px-2 py-2.5 text-left text-sm text-zinc-100 hover:bg-white/12"
                        onClick={() => handleRoute(item.href)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/pricing"
                className={cn(
                  'rounded-lg px-2 py-3 text-sm font-medium',
                  pathname === '/pricing' ? 'bg-white/15 text-brand-bright' : 'text-zinc-100 hover:bg-white/12',
                )}
                onClick={() => {
                  setMobileSection(null)
                  setMobileOpen(false)
                }}
              >
                Pricing
              </Link>
              <Link
                href={showDashboardNav ? '/dashboard' : '/login'}
                className="mt-2 inline-flex justify-center rounded-full py-3 text-sm font-semibold bg-[#00B4D8] text-white"
                onClick={() => {
                  setMobileSection(null)
                  setMobileOpen(false)
                }}
              >
                {showDashboardNav ? 'Dashboard' : 'Get Started'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
