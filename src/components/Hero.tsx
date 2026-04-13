import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Lock } from 'lucide-react'
import { TypewriterSequences } from './TypewriterSequences'

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
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.2) 60%, rgba(255, 255, 255, 0.5) 75%, rgba(255, 255, 255, 0.8) 90%, #FFFFFF 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[100dvh] w-full"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
        }}
        aria-hidden
      />
    </>
  )
}

export function Hero() {
  const [trustOpacity, setTrustOpacity] = useState(1)

  const onScroll = useCallback(() => {
    const y = window.scrollY || 0
    setTrustOpacity(Math.max(0, 1 - Math.min(y / 260, 1)))
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden pt-8 sm:pt-12"
      aria-label="Hero section"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="hidden lg:block lg:order-1" aria-hidden="false">
            <div className="hero-image-in">
              <div className="relative">
                <div
                  className="relative rounded-2xl p-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow:
                      '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="rounded-t-xl bg-white/80 backdrop-blur-md p-3 border-b border-zinc-200/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-zinc-100/50 rounded-md px-3 py-1.5 text-xs text-zinc-500 backdrop-blur-sm">
                          app.actionit.ai/dashboard
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-b-xl overflow-hidden">
                    <img
                      src="/mockup.png"
                      alt="Dashboard interface preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-95"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5"
                      aria-hidden
                    />
                    <div className="absolute top-4 right-4 space-y-2">
                      <div
                        className="animate-mockup-bounce p-3 rounded-lg"
                        style={{
                          animationDelay: '0s',
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-700">Active</span>
                        </div>
                      </div>
                      <div
                        className="animate-mockup-bounce p-3 rounded-lg"
                        style={{
                          animationDelay: '0.25s',
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
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

          <div className="lg:order-2 text-center lg:text-left hero-text-in">
            <div
              className="mb-8 inline-flex"
              style={{ opacity: trustOpacity, transition: 'opacity 150ms linear' }}
              aria-label="Trust signals"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-200 px-4 py-2 text-sm text-neutral-700 shadow-sm">
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

            <h1
              className="text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl drop-shadow-lg"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
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
                <span
                  className="text-white drop-shadow-md"
                  style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
                >
                  deleted.
                </span>
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-8 text-white/95 lg:mx-0 drop-shadow-md"
              style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.35)' }}
            >
              An AI meeting assistant that joins your calls, posts summaries to your tools, then wipes
              the slate clean.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full min-h-[44px] px-8 py-3 text-sm font-semibold bg-[#00B4D8] text-white shadow-lg hover:bg-[#0ea5e9] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Start Free with actionit.ai"
              >
                Get Started Free
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full min-h-[44px] px-6 py-3 text-sm font-semibold border border-white/25 bg-white/60 text-zinc-900 shadow-sm backdrop-blur-md hover:bg-white/80 transition"
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
