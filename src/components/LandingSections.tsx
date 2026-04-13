import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Shield, Zap, Brain } from 'lucide-react'
import { cn } from '../lib/cn'
import {
  faqItems,
  howItWorksSteps,
  integrations,
  partnerLogos,
  pillars,
} from '../data/siteContent'

const pillarIcons = [Shield, Zap, Brain] as const

function useInViewOnce() {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true)
        })
      },
      { threshold: 0.1, rootMargin: '-50px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function PartnerLogoMarquee() {
  const renderStrip = (suffix: 'a' | 'b') => (
    <div className="flex items-center gap-16 sm:gap-20 md:gap-24 shrink-0 pr-16 sm:pr-20">
      {partnerLogos.map((p) => (
        <img
          key={`${p.src}-${suffix}`}
          src={p.src}
          alt={suffix === 'a' ? p.alt : ''}
          className="h-10 sm:h-12 w-auto max-w-[160px] object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      ))}
    </div>
  )
  return (
    <div className="relative overflow-hidden w-full select-none">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="flex w-max animate-partner-marquee hover:[animation-play-state:paused]">
        {renderStrip('a')}
        {renderStrip('b')}
      </div>
    </div>
  )
}

export function ProductSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section
      id="product"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-14 lg:py-20 bg-white overflow-hidden scroll-mt-28"
    >
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)' }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, transparent, #F8F9FA)' }}
        aria-hidden
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center transition-all duration-700 ease-out',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div className="text-left">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: "'Recoleta Light', var(--font-display), sans-serif" }}
            >
              Not another AI note<span style={{ fontFamily: 'var(--font-body), sans-serif' }}>-</span>
              taker
            </h2>
            <p className="text-lg text-neutral-600" style={{ fontFamily: 'var(--font-body)' }}>
              Worried your meeting recorder is keeping your data? Tired of sifting through transcripts?
              Here&apos;s what&apos;s broken.
            </p>
          </div>
          <div>
            <div className="py-4 border-b border-neutral-200">
              <p className="text-neutral-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                <span className="font-semibold text-[#0F172A]">Data risks:</span> Meeting data stored
                indefinitely on third-party servers, training AI models without your consent.
              </p>
            </div>
            <div className="py-4 border-b border-neutral-200">
              <p className="text-neutral-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                <span className="font-semibold text-[#0F172A]">Manual work:</span> Copying summaries
                between apps, updating CRMs, and chasing follow-ups manually.
              </p>
            </div>
            <div className="py-4 border-b border-neutral-200">
              <p className="text-neutral-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                <span className="font-semibold text-[#0F172A]">Shallow notes:</span> Transcripts without
                context. Keywords without meaning. Action items you can&apos;t trust.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-lg text-neutral-600">
            <span className="font-bold" style={{ color: '#00B4D8' }}>
              actionit.ai
            </span>{' '}
            was built to solve exactly this.
          </p>
        </div>
      </div>
    </section>
  )
}

export function PartnerMarqueeSection() {
  return (
    <section
      id="logo-cloud"
      className="relative block w-full min-h-[220px] bg-white overflow-hidden md:min-h-0 scroll-mt-28"
    >
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, #F8F9FA, #ffffff)' }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, transparent, #F8F9FA)' }}
        aria-hidden
      />
      <div className="flex min-h-[200px] flex-shrink-0 py-16 lg:py-24 items-center justify-center px-6 w-full">
        <div className="overflow-hidden w-full">
          <h2
            className="text-center text-2xl sm:text-3xl font-bold text-[#0F172A] block"
            style={{ fontFamily: "'Recoleta Light', sans-serif" }}
          >
            Companies worldwide already trust us
          </h2>
          <div className="mt-10 max-w-7xl mx-auto min-h-[52px] sm:min-h-[56px] py-2">
            <PartnerLogoMarquee />
          </div>
        </div>
      </div>
    </section>
  )
}

export function PillarsSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section
      id="security"
      ref={ref}
      className="relative py-14 lg:py-20 overflow-hidden scroll-mt-28"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: "'Recoleta Light', sans-serif" }}
          >
            A smarter approach to meeting intelligence
          </h2>
        </div>
        <div className="grid gap-6 sm:gap-y-8 grid-cols-1 md:grid-cols-3">
          {pillars.map((pillar, o) => {
            const Icon = pillarIcons[o] ?? Shield
            return (
              <div
                key={pillar.id}
                className={cn(
                  '-mx-2 flex max-w-lg items-center gap-6 rounded-lg sm:mx-0 transition-all duration-700 ease-out',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                )}
                style={{ transitionDelay: `${o * 150}ms` }}
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[#00D4FF]/10 text-[#00B4D8]">
                  <Icon className="h-10 w-10" strokeWidth={1.75} />
                </div>
                <div>
                  <h3
                    className="font-semibold text-lg tracking-[-0.015em] text-[#0F172A]"
                    style={{ fontFamily: "'Recoleta Light', sans-serif" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-pretty text-neutral-600 text-sm leading-relaxed">
                    {pillar.description.split('actionit.ai').map((part, i, arr) =>
                      i === arr.length - 1 ? (
                        part
                      ) : (
                        <span key={i}>
                          {part}
                          <span className="font-bold" style={{ color: '#00B4D8' }}>
                            actionit.ai
                          </span>
                        </span>
                      ),
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-14 lg:py-20 bg-neutral-50 overflow-hidden scroll-mt-28"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="text-center mb-10">
          <div
            className={cn(
              'transition-all duration-700 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
              style={{ fontFamily: "'Recoleta Light', sans-serif" }}
            >
              How <span className="text-[#00D4FF]">action.it</span> works
            </h2>
            <p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              A simple, secure process that delivers insights in seconds—then wipes the data so your
              meetings stay private.
            </p>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto">
          <ol className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-6 sm:gap-0" aria-label="How it works steps">
            {howItWorksSteps.map((step, o) => {
              return (
                <li key={step.id} className="flex-1 flex flex-col sm:flex-row sm:items-center">
                  {o > 0 && (
                    <div className="hidden sm:block flex-1 h-0.5 bg-[#00D4FF] mr-2 min-w-[1rem]" aria-hidden />
                  )}
                  <div className="flex flex-col items-center text-center w-full">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium shrink-0 mb-2"
                      style={{ backgroundColor: '#00D4FF' }}
                    >
                      {o + 1}
                    </div>
                    <p
                      className="mt-2 text-xs font-medium text-[#0F172A] uppercase tracking-wide"
                      style={{ fontFamily: "'Recoleta Light', sans-serif" }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-1 text-xs text-neutral-600 max-w-[140px] mx-auto leading-snug"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {step.description}
                    </p>
                  </div>
                  {o < howItWorksSteps.length - 1 && (
                    <div className="hidden sm:block flex-1 h-0.5 bg-[#00D4FF] ml-2 min-w-[1rem]" aria-hidden />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

const workflowPhases = [
  {
    title: 'Pre-Meeting.',
    subtitle: 'Prepare with Context',
    body: (
      <>
        Smart pre-meeting briefs mean you show up ready.{' '}
        <span className="font-bold" style={{ color: '#00B4D8' }}>
          actionit.ai
        </span>{' '}
        surfaces relevant context from past meetings, previous discussions with the same stakeholder, and
        key decisions that impact today&apos;s conversation—all without storing data after the meeting
        ends.
      </>
    ),
  },
  {
    title: 'In-Meeting.',
    subtitle: 'AI Listens, You Lead',
    body: (
      <>
        While you focus on the discussion, Action.IT transcribes in real-time, identifies decisions and
        action items, and flags follow-ups. Local processing means your words never leave your device
        until they&apos;re securely synced to your chosen tools.
      </>
    ),
  },
  {
    title: 'Post-Meeting.',
    subtitle: 'Instant Delivery, Then Gone',
    body: (
      <>
        Within seconds of your meeting, summaries, tasks, and highlights land exactly where your team
        needs them—Notion, Salesforce, Slack, or any of 50+ integrated tools. Then{' '}
        <span className="font-bold" style={{ color: '#00B4D8' }}>
          actionit.ai
        </span>{' '}
        deletes everything. Clean. Compliant. Done.
      </>
    ),
  },
] as const

export function DemoSection() {
  return (
    <div id="demo" className="scroll-mt-28">
      <section className="relative isolate overflow-hidden bg-white px-6 sm:px-10 md:px-16 lg:px-24 py-14 sm:py-20 lg:overflow-visible">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:pr-4 lg:max-w-xl">
            <p className="text-base/7 font-semibold text-indigo-600">Increase Productivity</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              A better workflow
            </h2>
            <p className="mt-6 text-xl/8 text-gray-700">
              Your meetings produce action-oriented{' '}
              <span className="font-bold" style={{ color: '#00B4D8' }}>
                actionit.ai
              </span>{' '}
              promptly delivers them to Slack, Salesforce, Notion, and other apps before erasing all local
              data.
            </p>
            <p className="mt-6 text-base/7 text-gray-600">
              No manual copying. No data lingering on servers. Just automatic, secure workflow updates that
              keep your team aligned without compromising privacy.
            </p>

            <ul className="mt-10 space-y-8" role="list">
              {workflowPhases.map((phase) => (
                <li key={phase.title} className="flex gap-x-3">
                  <CheckCircle2
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden
                    strokeWidth={2}
                  />
                  <span className="text-base/7 text-gray-600">
                    <span className="font-semibold text-gray-900">{phase.title}</span>{' '}
                    <span className="font-semibold text-gray-900">{phase.subtitle}</span>{' '}
                    {phase.body}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
              Your meeting is private? No problem.
            </h3>
            <p className="mt-6 text-base/7 text-gray-600">
              Your meetings are processed locally on your device, encrypted end-to-end, and never stored on{' '}
              <span className="font-bold" style={{ color: '#00B4D8' }}>
                actionit.ai
              </span>
              &apos;s servers. This isn&apos;t just a privacy feature—it&apos;s how we built the product
              from day one. You get powerful AI meeting intelligence without the server dependency.
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-1 lg:row-start-1">
            <div className="overflow-hidden rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10">
              <div className="relative aspect-[4/3] bg-zinc-800">
                <img
                  src="/mockup.png"
                  alt="Action.IT dashboard and meeting intelligence preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function IntegrationsSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section
      id="integrations"
      ref={ref}
      className="relative py-14 lg:py-20 bg-white overflow-hidden scroll-mt-28"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="text-center mb-10">
          <div
            className={cn(
              'transition-all duration-700 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
              style={{ fontFamily: "'Recoleta Light', sans-serif" }}
            >
              Seamlessly connects with your workflow
            </h2>
            <p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              actionit.ai delivers notes and insights straight into your existing workflows. No new app to
              check.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {integrations.map((item, o) => (
            <div
              key={item.name}
              className={cn(
                'flex flex-col items-center justify-center p-4 transition-all duration-300',
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
              )}
              style={{ transitionDelay: `${o * 50}ms` }}
            >
              <img src={item.logo} alt={`${item.name} logo`} className="h-10 w-auto object-contain" />
              {item.comingSoon && (
                <span className="text-[10px] font-medium text-[#FF6B6B] uppercase tracking-wider mt-2">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="relative bg-neutral-50 overflow-hidden scroll-mt-28">
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgb(248 250 252), rgba(248,250,252,0.4))' }}
        aria-hidden
      />
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <h2
          className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl text-[#0F172A]"
          style={{ fontFamily: "'Recoleta Light', sans-serif" }}
        >
          FAQ<span style={{ fontFamily: 'var(--font-body), sans-serif' }}>&apos;</span>s
        </h2>
        <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white px-2">
          {faqItems.map((item) => (
            <details key={item.id} className="group px-4 py-2">
              <summary className="cursor-pointer list-none py-4 text-base font-semibold text-neutral-800 text-left flex justify-between items-center gap-4">
                {item.question}
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="pb-4 text-neutral-600 text-sm leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
