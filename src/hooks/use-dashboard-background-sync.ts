'use client'

import { useEffect } from 'react'
import { getUserMetrics } from '@/lib/user-metrics-api'
import { getNotionStatus } from '@/lib/notion-api'

/** Matches production HAR: ~5 min cadence for user-metrics. */
const METRICS_POLL_MS = 5 * 60 * 1000
/** Slightly offset from metrics to avoid simultaneous bursts. */
const NOTION_STATUS_POLL_MS = 4 * 60 * 1000

export interface UseDashboardBackgroundSyncOptions {
  userId: string | undefined
  onNotionConfiguredChange?: (notionConfigured: boolean) => void
}

/**
 * While the dashboard is mounted, periodically calls the same API Gateway routes
 * as production idle traffic: GET `user-metrics` and GET `notion/status`.
 * Pauses interval ticks when the document is hidden; refreshes when visible again.
 */
export function useDashboardBackgroundSync({
  userId,
  onNotionConfiguredChange,
}: UseDashboardBackgroundSyncOptions): void {
  useEffect(() => {
    if (!userId?.trim()) return

    const pollMetrics = () => {
      void getUserMetrics(userId)
    }

    const pollNotion = async () => {
      const status = await getNotionStatus(userId)
      onNotionConfiguredChange?.(Boolean(status.notion_configured))
    }

    const runIfVisible = (fn: () => void) => {
      if (typeof document !== 'undefined' && document.hidden) return
      fn()
    }

    const tickMetrics = () => runIfVisible(pollMetrics)
    const tickNotion = () => runIfVisible(() => void pollNotion())

    void pollMetrics()
    void pollNotion()

    const metricsInterval = setInterval(tickMetrics, METRICS_POLL_MS)
    const notionInterval = setInterval(tickNotion, NOTION_STATUS_POLL_MS)

    const onVisibility = () => {
      if (document.hidden) return
      pollMetrics()
      void pollNotion()
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(metricsInterval)
      clearInterval(notionInterval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [userId, onNotionConfiguredChange])
}
