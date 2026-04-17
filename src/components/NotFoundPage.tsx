'use client'

import Link from 'next/link'
import { ArrowRight, Home, Radio } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { cn } from '@/lib/cn'

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-page">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,180,216,0.18),transparent)]" />
        <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-brand-cyan/[0.07] blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[380px] w-[380px] rounded-full bg-brand-wordmark/[0.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <main
        id="main-content"
        className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <div
            className="relative mb-10 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44"
            aria-hidden
          >
            <span className="absolute inset-0 rounded-full border border-brand-cyan/20 bg-white/45 shadow-[0_0_0_1px_rgba(255,255,255,0.85)_inset] backdrop-blur-sm" />
            <span className="absolute inset-[10%] rounded-full border border-dashed border-brand-cyan/35 motion-safe:animate-[spin_32s_linear_infinite] motion-reduce:animate-none" />
            <span className="absolute inset-[22%] rounded-full bg-brand-cyan/[0.06] motion-safe:animate-pulse motion-reduce:animate-none" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-[62%] w-[62%] rounded-full border border-brand-cyan/20 motion-safe:animate-ping motion-reduce:animate-none" />
            </span>
            <span className="absolute inset-0 flex items-center justify-center motion-reduce:hidden">
              <span
                className="absolute h-[78%] w-[78%] rounded-full border border-brand-cyan/12 motion-safe:animate-ping motion-reduce:animate-none"
                style={{ animationDelay: '0.75s' }}
              />
            </span>
            <Radio
              className="relative z-10 h-14 w-14 text-brand-cyan drop-shadow-[0_0_22px_rgba(0,180,216,0.4)] sm:h-16 sm:w-16"
              strokeWidth={1.25}
            />
          </div>

          <p className="mb-3 font-label-display text-xs font-semibold uppercase tracking-[0.35em] text-brand-cyan">
            Signal lost · 404
          </p>

          <h1 className="font-heading-recoleta text-balance text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl md:text-5xl">
            This page never joined the call.
          </h1>

          <p className="font-body-prose mt-5 max-w-md text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
            The link might be mistyped, or we retired this URL, like a meeting with no invite on the calendar.
            Let&apos;s route you somewhere that actually exists.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition',
                'bg-gradient-to-r from-[#00b4d8] to-[#0099cb] hover:brightness-105 hover:shadow-xl',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
              )}
            >
              <Home className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-surface px-8 py-3.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-cyan/40 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/30"
            >
              See features
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <p className="mt-12 text-sm text-neutral-500">
            Or try{' '}
            <Link href="/pricing" className="font-medium text-brand-wordmark underline-offset-4 hover:underline">
              pricing
            </Link>
            {' · '}
            <Link href="/login" className="font-medium text-brand-wordmark underline-offset-4 hover:underline">
              sign in
            </Link>
          </p>
        </div>
      </main>

    </div>
  )
}
