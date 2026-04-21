'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Plug2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { DashboardUser } from '@/context/AuthContext'
import { isGoogleCalendarConnected } from '@/lib/google-calendar-integration'

export type IntegrationId =
  | 'google-calendar'
  | 'zoom'
  | 'salesforce'
  | 'slack'
  | 'notion'
  | 'hubspot'
  | 'trello'
  | 'odoo'

type IntegrationDef = {
  id: IntegrationId
  name: string
  logoSrc: string
}

const INTEGRATIONS: IntegrationDef[] = [
  { id: 'google-calendar', name: 'Google Calendar', logoSrc: '/google.png' },
  { id: 'zoom', name: 'Zoom', logoSrc: '/zoom logo.png' },
  { id: 'salesforce', name: 'Salesforce', logoSrc: '/Salesforce.png' },
  { id: 'slack', name: 'Slack', logoSrc: '/Slack.png' },
  { id: 'notion', name: 'Notion', logoSrc: '/notion-logo-no-background.png' },
  { id: 'hubspot', name: 'HubSpot', logoSrc: 'https://cdn.simpleicons.org/hubspot/FF7A59' },
  { id: 'trello', name: 'Trello', logoSrc: 'https://cdn.simpleicons.org/trello/0052CC' },
  { id: 'odoo', name: 'Odoo', logoSrc: 'https://cdn.simpleicons.org/odoo/714B67' },
]

/**
 * Flip to `true` when disconnect is wired to real APIs; `toggle` below already supports both directions.
 */
const INTEGRATION_DISCONNECT_ENABLED = false

function initialConnected(user: DashboardUser | null): Record<IntegrationId, boolean> {
  const base: Record<IntegrationId, boolean> = {
    'google-calendar': false,
    zoom: false,
    salesforce: false,
    slack: false,
    notion: false,
    hubspot: false,
    trello: false,
    odoo: false,
  }
  base['google-calendar'] = isGoogleCalendarConnected(user)
  return base
}

export interface DashboardIntegrationsSectionProps {
  user: DashboardUser | null
}

export function DashboardIntegrationsSection({ user }: DashboardIntegrationsSectionProps) {
  const [connected, setConnected] = useState<Record<IntegrationId, boolean>>(() => initialConnected(user))

  useEffect(() => {
    setConnected((prev) => ({
      ...prev,
      'google-calendar': isGoogleCalendarConnected(user),
    }))
  }, [user])

  const toggle = useCallback((id: IntegrationId) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const onIntegrationAction = useCallback(
    (id: IntegrationId, isConnected: boolean) => {
      if (isConnected && !INTEGRATION_DISCONNECT_ENABLED) return
      toggle(id)
    },
    [toggle],
  )

  const connectedCount = useMemo(
    () => INTEGRATIONS.reduce((n, i) => n + (connected[i.id] ? 1 : 0), 0),
    [connected],
  )

  return (
    <section className="text-left" aria-labelledby="dashboard-integrations-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 hidden h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0099cb] to-[#00c6f3] sm:block"
            aria-hidden
          />
          <div>
            <h2
              id="dashboard-integrations-heading"
              className="sf-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              Integrations
            </h2>
            <p className="sf-text mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Connect your favorite tools to automate your workflow
            </p>
          </div>
        </div>
        <p className="sf-text inline-flex items-center gap-2 self-start rounded-full border border-[#0099cb]/20 bg-white/80 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm sm:self-auto">
          <Plug2 className="h-3.5 w-3.5 text-[#0099cb]" aria-hidden />
          <span>
            {connectedCount} of {INTEGRATIONS.length} connected
          </span>
        </p>
      </div>

      <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((item) => {
          const isConnected = connected[item.id]
          return (
            <li
              key={item.id}
              className={cn(
                'group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm',
                'border-[#0099cb]/18 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0099cb]/35 hover:shadow-md',
                isConnected && 'ring-1 ring-emerald-500/40',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/40 ring-1 ring-[#0099cb]/15 transition-transform group-hover:scale-[1.03]">
                  <img
                    src={item.logoSrc}
                    alt=""
                    aria-hidden
                    className="h-9 w-9 object-contain"
                    onError={(e) => {
                      if (item.id === 'zoom') {
                        e.currentTarget.src = '/zoom.png'
                      }
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="sf-text truncate font-semibold text-foreground">{item.name}</h3>
                  <p
                    className={cn(
                      'sf-text mt-0.5 text-xs font-medium md:text-sm',
                      isConnected ? 'text-emerald-700' : 'text-muted-foreground',
                    )}
                  >
                    {isConnected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant={isConnected ? 'outline' : 'default'}
                size="sm"
                disabled={isConnected && !INTEGRATION_DISCONNECT_ENABLED}
                title={
                  isConnected && !INTEGRATION_DISCONNECT_ENABLED
                    ? 'Disconnect will be available soon'
                    : undefined
                }
                className={cn(
                  'sf-text w-full sm:w-auto sm:self-start',
                  !isConnected &&
                    'border-0 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white shadow-sm hover:from-[#0088b8] hover:to-[#00b5e0] hover:text-white',
                  isConnected &&
                    INTEGRATION_DISCONNECT_ENABLED &&
                    'border-[#0099cb]/35 text-foreground hover:bg-muted/60',
                  isConnected &&
                    !INTEGRATION_DISCONNECT_ENABLED &&
                    'cursor-not-allowed border-neutral-200 bg-muted/40 text-muted-foreground opacity-90 hover:bg-muted/40',
                )}
                onClick={() => onIntegrationAction(item.id, isConnected)}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
