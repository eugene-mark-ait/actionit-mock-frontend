'use client'

import React from 'react'
import { Calendar, Languages, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLanguageName } from '@/lib/languages'
import { isGoogleCalendarConnected } from '@/lib/google-calendar-integration'
import type { DashboardUser } from '@/context/AuthContext'

function greetingLine(displayName: string | undefined | null): string {
  const hour = new Date().getHours()
  const phrase = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const first = displayName?.trim().split(/\s+/)[0]
  return first ? `${phrase}, ${first}.` : `${phrase}.`
}

function subscriptionShort(tier: string | undefined): string {
  const t = (tier ?? 'free').toLowerCase()
  if (t === 'free') return 'Free'
  if (t === 'pro' || t === 'paid') return 'Pro'
  return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Free'
}

export interface DashboardHeroProps {
  user: DashboardUser | null
  transcriptionLanguage: string
}

export function DashboardHero({ user, transcriptionLanguage }: DashboardHeroProps) {
  const calendarLinked = isGoogleCalendarConnected(user)
  const langLabel = getLanguageName(transcriptionLanguage)
  const plan = subscriptionShort(user?.subscriptionTier)

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#0099cb]/15 bg-gradient-to-br from-white via-white to-[#0099cb]/[0.04] px-5 py-8 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] md:px-10 md:py-10"
      aria-labelledby="dashboard-greeting-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#0099cb]/10 to-[#00c6f3]/5 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#00c6f3]/8 to-transparent blur-2xl"
        aria-hidden
      />

      <p className="sf-text relative text-xs font-semibold uppercase tracking-[0.2em] text-[#0099cb]/90">
        Your workspace
      </p>
      <h1
        id="dashboard-greeting-heading"
        className="sf-display relative mt-3 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-4xl"
        suppressHydrationWarning
      >
        {greetingLine(user?.name)}
      </h1>
      <p className="sf-text relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
        Meeting notes, integrations, and preferences organized in one place so you can focus on the conversation.
      </p>

      <div className="relative mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center backdrop-blur-sm transition-colors',
            'border-[#0099cb]/15 bg-white/70 hover:border-[#0099cb]/30',
          )}
        >
          <Calendar className="h-5 w-5 text-[#0099cb]" aria-hidden />
          <span className="sf-text text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Calendar
          </span>
          <span
            className={cn(
              'sf-text text-sm font-semibold',
              calendarLinked ? 'text-emerald-700' : 'text-foreground/80',
            )}
          >
            {calendarLinked ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <div
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center backdrop-blur-sm transition-colors',
            'border-[#0099cb]/15 bg-white/70 hover:border-[#0099cb]/30',
          )}
        >
          <Languages className="h-5 w-5 text-[#0099cb]" aria-hidden />
          <span className="sf-text text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Transcription
          </span>
          <span className="sf-text text-sm font-semibold text-foreground/90">{langLabel}</span>
        </div>
        <div
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center backdrop-blur-sm transition-colors',
            'border-[#0099cb]/15 bg-white/70 hover:border-[#0099cb]/30',
          )}
        >
          <Sparkles className="h-5 w-5 text-[#0099cb]" aria-hidden />
          <span className="sf-text text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Plan
          </span>
          <span className="sf-text text-sm font-semibold text-foreground/90">{plan}</span>
        </div>
      </div>
    </section>
  )
}
