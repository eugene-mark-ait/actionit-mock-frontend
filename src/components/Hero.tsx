'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { Lock } from 'lucide-react'
import { SiteImage } from '@/components/SiteImage'
import { TypewriterSequences } from './TypewriterSequences'
import { useAuth } from '@/context/AuthContext'

const heroTypingSequences = [
  { text: 'action', deleteAfter: true },
  { text: 'outcomes', deleteAfter: true },
  { text: 'privacy', deleteAfter: false },
] as const

/** Full-viewport hero image + gradients; render once above the navbar so the image reaches the top edge. */
export function HeroFirstViewportBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[100dvh] w-full bg-cover bg-center bg-no-repeat hero-bg-in"
        style={{
          backgroundImage: 'url(/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[100dvh] w-full"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, transparent 40%, rgb(255 255 255 / 0.18) 60%, rgb(255 255 255 / 0.42) 75%, rgb(255 255 255 / 0.72) 90%, var(--color-page) 100%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[100dvh] w-full"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.18) 28%, rgba(0, 0, 0, 0.08) 55%, transparent 100%)',
        }}
        aria-hidden
      />
    </>
  )
}

export function Hero() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const showDashboardCta = !authLoading && isAuthenticated
  const [trustOpacity, setTrustOpacity] = useState(1)

  const onScroll = useCallback(() => {
    const y = window.scrollY || 0
    setTrustOpacity(Math.max(0, 1 - Math.min(y / 260, 1)))
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => onScroll())
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip pt-8 sm:pt-12"
      aria-label="Hero section"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24 pb-24 md:pb-32">
        <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="hidden min-w-0 lg:block lg:order-1" aria-hidden="false">
            <div className="hero-image-in">
              <div className="relative">
                <div className="hero-mockup-shell relative rounded-2xl p-2">
                  <div className="hero-mockup-chrome rounded-t-xl p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                        <div className="h-3 w-3 rounded-full bg-green-400/80" />
                      </div>
                      <div className="mx-4 flex-1">
                        <div className="rounded-md bg-zinc-300/35 px-3 py-1.5 text-xs text-zinc-600 backdrop-blur-sm">
                          app.actionit.ai/dashboard
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-b-xl overflow-hidden">
                    <SiteImage
                      src="/mockup.png"
                      alt="Dashboard interface preview"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-95"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-page)]/25 via-transparent to-blue-500/5"
                      aria-hidden
                    />
                    <div className="absolute right-4 top-4 space-y-2">
                      <div
                        className="hero-mockup-glass animate-mockup-bounce rounded-lg p-3"
                        style={{ animationDelay: '0s' }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-800">Active</span>
                        </div>
                      </div>
                      <div
                        className="hero-mockup-glass animate-mockup-bounce rounded-lg p-3"
                        style={{ animationDelay: '0.25s' }}
                      >
                        <div className="text-2xl font-bold text-zinc-800">12</div>
                        <div className="text-xs text-zinc-600">Meetings</div>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-4 left-4 animate-mockup-bounce p-3 rounded-lg"
                      style={{
                        animationDelay: '0.5s',
                        background: 'rgba(59, 130, 246, 0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">AI Processing</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-28 bg-blue-500/30 rounded-full" />
                        <div className="h-1.5 w-24 bg-blue-500/25 rounded-full" />
                        <div className="h-1.5 w-20 bg-blue-500/20 rounded-full" />
                      </div>
                    </div>
                    <div
                      className="absolute top-4 left-4 animate-mockup-bounce rounded-full px-3 py-2"
                      style={{
                        animationDelay: '0.75s',
                        background: 'rgba(16, 185, 129, 0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                        <span className="text-xs font-semibold text-emerald-700">Private</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:order-2 text-center lg:text-left hero-text-in">
            <div
              className="mb-8 inline-flex"
              style={{ opacity: trustOpacity, transition: 'opacity 150ms linear' }}
              aria-label="Trust signals"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-page/55 px-4 py-2 text-sm text-brand-navy shadow-sm backdrop-blur-md">
                <span className="text-green-600" aria-hidden>
                  ✓
                </span>
                <span>100% data privacy</span>
                <span className="text-neutral-400" aria-hidden>
                  •
                </span>
                <span>No data storage</span>
              </span>
            </div>

            <h1 className="text-hero-shadow text-4xl font-extrabold leading-[1.05] text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              Your meetings in <br />
              <span className="text-black drop-shadow-sm">
                <TypewriterSequences
                  sequences={[...heroTypingSequences]}
                  typingSpeed={50}
                  deleteSpeed={30}
                  pauseBeforeDelete={1500}
                  autoLoop
                  loopDelay={1000}
                />
                .
              </span>{' '}
              <br />
              <span className="whitespace-normal">
                Insights delivered,
                <br />
                data{' '}
                <span className="text-hero-word text-white drop-shadow-md">deleted.</span>
              </span>
            </h1>

            <p className="text-hero-subtle-shadow mx-auto mt-6 max-w-2xl text-base leading-8 text-white/95 drop-shadow-md md:text-lg lg:mx-0">
              An AI meeting assistant that joins your calls, posts summaries to your tools, then wipes
              the slate clean.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href={showDashboardCta ? '/dashboard' : '/login'}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-cyan px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={showDashboardCta ? 'Open your actionit.ai dashboard' : 'Start Free with actionit.ai'}
              >
                {showDashboardCta ? 'Dashboard' : 'Get Started'}
              </Link>
              <a
                href="#demo"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/30 bg-page/70 px-6 py-3 text-sm font-semibold text-brand-navy shadow-sm backdrop-blur-md transition hover:bg-page/85"
              >
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
