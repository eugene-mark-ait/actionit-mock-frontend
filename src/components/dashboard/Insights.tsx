'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { fetchUserMetricsForDisplay, type UserMetrics } from '@/lib/user-metrics-api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  CalendarDays,
  Clock,
  FileText,
  Gauge,
  RefreshCw,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

const METRICS_POLL_MS = 5 * 60 * 1000

function formatMetricsTimestampUtc(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Last updated: unknown'
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(d)
  return `Last updated: ${formatted} UTC`
}

function confidencePercent(score: number): number {
  if (!Number.isFinite(score)) return 0
  if (score > 1) return Math.min(100, Math.max(0, score))
  return Math.min(100, Math.max(0, score * 100))
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  className,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  value: string
  hint?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[#0099cb]/15 bg-gradient-to-br from-white via-white to-[#0099cb]/[0.04] p-5 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-12px_rgba(0,153,203,0.18)]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-[#0099cb]/8 to-transparent blur-xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#0099cb]/15 bg-white/90 text-[#0099cb] shadow-sm">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="sf-text text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
          <p className="sf-display mt-1 truncate text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{value}</p>
          {hint ? <p className="sf-text mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </div>
    </div>
  )
}

function ConfidenceRing({ percent }: { percent: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const p = Math.min(100, Math.max(0, percent))
  const offset = c - (p / 100) * c
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center">
      <svg className="-rotate-90 transform" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#insightsRing)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <defs>
          <linearGradient id="insightsRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099cb" />
            <stop offset="100%" stopColor="#00c6f3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="sf-display text-3xl font-semibold tabular-nums text-foreground">{p.toFixed(1)}%</span>
        <span className="sf-text mt-0.5 text-xs font-medium text-muted-foreground">Avg. confidence</span>
      </div>
    </div>
  )
}

function MeetingsBars({ total, month }: { total: number; month: number }) {
  const max = Math.max(total, month, 1)
  const hTotal = Math.round((total / max) * 100)
  const hMonth = Math.round((month / max) * 100)
  return (
    <div className="mt-6 flex items-end justify-center gap-8 sm:gap-12">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-36 w-14 items-end justify-center rounded-xl border border-[#0099cb]/12 bg-slate-50/80 p-1.5">
          <div
            className="w-full max-h-full rounded-lg bg-gradient-to-t from-[#0099cb] to-[#00c6f3] transition-all duration-500 ease-out"
            style={{ height: `${Math.max(hTotal, 4)}%` }}
          />
        </div>
        <span className="sf-text text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">All time</span>
        <span className="sf-display text-lg font-semibold tabular-nums text-foreground">{total}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-36 w-14 items-end justify-center rounded-xl border border-[#0099cb]/12 bg-slate-50/80 p-1.5">
          <div
            className="w-full max-h-full rounded-lg bg-gradient-to-t from-[#0099cb]/70 to-[#00c6f3]/90 opacity-95 transition-all duration-500 ease-out"
            style={{ height: `${Math.max(hMonth, 4)}%` }}
          />
        </div>
        <span className="sf-text text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">This month</span>
        <span className="sf-display text-lg font-semibold tabular-nums text-foreground">{month}</span>
      </div>
    </div>
  )
}

function InsightsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8 md:space-y-10">
      <div className="h-28 rounded-2xl bg-slate-100/90" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100/90" />
        ))}
      </div>
    </div>
  )
}

export function Insights() {
  const { user } = useAuth()
  const userId = user?.id

  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [softError, setSoftError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const hasLoadedOnceRef = useRef(false)

  const load = useCallback(async () => {
    if (!userId?.trim()) {
      setPhase('error')
      setErrorMessage('Sign in to view insights.')
      setSoftError(null)
      return
    }
    setBusy(true)
    setSoftError(null)
    if (!hasLoadedOnceRef.current) {
      setPhase('loading')
    }
    try {
      const result = await fetchUserMetricsForDisplay(userId)
      if (!result.ok) {
        if (!hasLoadedOnceRef.current) {
          setPhase('error')
          setErrorMessage(result.error)
        } else {
          setPhase('ready')
          setSoftError(result.error)
        }
        return
      }
      hasLoadedOnceRef.current = true
      setMetrics(result.data)
      setPhase('ready')
      setErrorMessage(null)
    } finally {
      setBusy(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!userId?.trim()) return
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      void load()
    }, METRICS_POLL_MS)
    const onVis = () => {
      if (!document.hidden) void load()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [load, userId])

  const confPct = metrics ? confidencePercent(metrics.average_confidence_score) : 0

  return (
    <DashboardShell mainAriaLabel="Insights" enableOnboarding={false}>
      <div className="mx-auto max-w-6xl space-y-10 md:space-y-12">
        <section
          className="relative overflow-hidden rounded-2xl border border-[#0099cb]/15 bg-gradient-to-br from-white via-white to-[#0099cb]/[0.04] px-5 py-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] md:px-10 md:py-10"
          aria-labelledby="insights-heading"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#0099cb]/10 to-[#00c6f3]/5 blur-2xl" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="sf-text text-xs font-semibold uppercase tracking-[0.2em] text-[#0099cb]/90">Analytics</p>
              <h1
                id="insights-heading"
                className="sf-display mt-2 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-4xl"
              >
                Insights
              </h1>
              <p className="sf-text mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                A snapshot of your meeting activity refreshed periodically from your workspace metrics.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-[#0099cb]/25 font-sans hover:border-[#0099cb]/40 hover:bg-[#0099cb]/[0.06]"
                onClick={() => void load()}
                disabled={busy}
              >
                <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} aria-hidden />
                Refresh
              </Button>
              {metrics ? (
                <p className="sf-text text-right text-xs text-muted-foreground">{formatMetricsTimestampUtc(metrics.timestamp)}</p>
              ) : null}
            </div>
          </div>
        </section>

        {phase === 'loading' && !metrics ? <InsightsSkeleton /> : null}

        {phase === 'error' && !metrics ? (
          <div
            className="rounded-2xl border border-red-200/80 bg-red-50/50 px-5 py-6 text-center shadow-sm md:px-8"
            role="alert"
          >
            <p className="sf-text text-sm font-medium text-red-800">{errorMessage ?? 'Could not load insights.'}</p>
            <Button type="button" className="mt-4 rounded-xl font-sans" variant="secondary" onClick={() => void load()}>
              Try again
            </Button>
          </div>
        ) : null}

        {metrics && phase !== 'error' ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard icon={Users} label="Total meetings" value={metrics.total_meetings.toLocaleString()} />
              <StatCard icon={CalendarDays} label="Meetings this month" value={metrics.meetings_this_month.toLocaleString()} />
              <StatCard icon={FileText} label="Total transcripts" value={metrics.total_transcripts.toLocaleString()} />
              <StatCard
                icon={Gauge}
                label="Average confidence"
                value={`${confPct.toFixed(1)}%`}
                hint="Based on transcript quality signals from your sessions."
              />
              <StatCard
                icon={Clock}
                label="Avg. meeting length"
                value={`${metrics.average_meeting_length_minutes.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 0,
                })} min`}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#0099cb]/15 bg-gradient-to-br from-white to-[#0099cb]/[0.03] p-6 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] md:p-8">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-[#0099cb]" aria-hidden />
                  <h2 className="sf-display text-lg font-semibold text-foreground">Meeting volume</h2>
                </div>
                <p className="sf-text mt-1 text-sm text-muted-foreground">Compare all-time totals with the current month.</p>
                <MeetingsBars total={metrics.total_meetings} month={metrics.meetings_this_month} />
              </div>

              <div className="rounded-2xl border border-[#0099cb]/15 bg-gradient-to-br from-white to-[#00c6f3]/[0.04] p-6 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] md:p-8">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0099cb]" aria-hidden />
                  <h2 className="sf-display text-lg font-semibold text-foreground">Transcription confidence</h2>
                </div>
                <p className="sf-text mt-1 text-sm text-muted-foreground">Higher scores usually mean clearer audio and diarization.</p>
                <div className="mt-2 flex justify-center py-2">
                  <ConfidenceRing percent={confPct} />
                </div>
              </div>
            </div>

            <p className="sf-text text-center text-xs text-muted-foreground">
              <Sparkles className="mb-0.5 mr-1 inline-block h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
              Figures sync on a short cadence while this page is open. Use Refresh for an immediate pull.
            </p>
          </>
        ) : null}

        {softError ? (
          <p className="sf-text text-center text-sm text-amber-800" role="status">
            Could not refresh metrics. {softError}
          </p>
        ) : null}
      </div>
    </DashboardShell>
  )
}
