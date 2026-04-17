'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import { CalendarDays, Mail, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { DashboardUser } from '@/context/AuthContext'

function formatMemberSince(iso: string | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return '—'
  }
}

function subscriptionDisplayName(tier: string | undefined): string {
  const t = (tier ?? 'free').toLowerCase()
  if (t === 'free') return 'Free'
  if (t === 'pro' || t === 'paid') return 'Pro'
  return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Free'
}

function isFreeSubscription(tier: string | undefined): boolean {
  const t = (tier ?? 'free').toLowerCase()
  return t === 'free' || t === ''
}

export interface DashboardAccountSectionProps {
  user: DashboardUser | null
}

export function DashboardAccountSection({ user }: DashboardAccountSectionProps) {
  const { toast } = useToast()

  const handleDeleteAccount = useCallback(() => {
    const ok = window.confirm(
      'Delete your account permanently? All data will be removed. This cannot be undone.',
    )
    if (!ok) return
    toast({
      title: 'Not available yet',
      description: 'Account deletion will be available in a future release.',
      variant: 'destructive',
    })
  }, [toast])

  const email = user?.email ?? '—'
  const name = user?.name ?? '—'
  const memberSince = formatMemberSince(user?.createdAt)
  const tier = user?.subscriptionTier
  const subscriptionLabel = subscriptionDisplayName(tier)
  const showUpgrade = isFreeSubscription(tier)

  return (
    <section className="text-left" aria-labelledby="dashboard-account-heading">
      <div className="flex items-start gap-3">
        <span
          className="mt-1 hidden h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0099cb] to-[#00c6f3] sm:block"
          aria-hidden
        />
        <div>
          <h2
            id="dashboard-account-heading"
            className="sf-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            Account
          </h2>
          <p className="sf-text mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Manage your account settings
          </p>
        </div>
      </div>

      <div
        className={cn(
          'mt-8 overflow-hidden rounded-2xl border border-[#0099cb]/20 bg-gradient-to-br from-card via-card to-[#0099cb]/[0.04] p-5 shadow-sm md:p-6',
        )}
      >
        <div className="flex flex-col gap-4 border-b border-[#0099cb]/12 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.picture ? (
              <img
                src={user.picture}
                alt=""
                aria-hidden
                className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-[#0099cb]/25"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0099cb]/15 to-[#00c6f3]/15 ring-2 ring-[#0099cb]/20">
                <User className="h-8 w-8 text-[#0099cb]" aria-hidden />
              </div>
            )}
            <div className="min-w-0">
              <p className="sf-display truncate text-lg font-semibold text-foreground">{name}</p>
              <p className="sf-text mt-0.5 truncate text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="sf-text flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
              Email
            </dt>
            <dd className="sf-text mt-1 break-all pl-5 text-sm font-medium text-foreground md:text-base">{email}</dd>
          </div>
          <div>
            <dt className="sf-text flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <User className="h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
              Name
            </dt>
            <dd className="sf-text mt-1 pl-5 text-sm font-medium text-foreground md:text-base">{name}</dd>
          </div>
          <div>
            <dt className="sf-text flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
              Member since
            </dt>
            <dd className="sf-text mt-1 pl-5 text-sm font-medium text-foreground md:text-base">{memberSince}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="sf-text flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
              Subscription
            </dt>
            <dd className="sf-text mt-1 flex flex-col gap-3 pl-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-foreground md:text-base">{subscriptionLabel}</span>
              {showUpgrade && (
                <Button
                  type="button"
                  asChild
                  size="sm"
                  className="sf-text w-full border-0 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white shadow-sm hover:from-[#0088b8] hover:to-[#00b5e0] hover:text-white sm:w-auto"
                >
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-[#0099cb]/15 pt-6">
          <Button
            type="button"
            variant="destructive"
            className="sf-text w-full sm:w-auto"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </div>
      </div>
    </section>
  )
}
