/**
 * User Metrics API
 * Fetches user statistics from the backend
 */

import { apiFetch } from '@/lib/api-client'

const METRICS_API_BASE = 'https://w6h7umfa5b.execute-api.us-east-1.amazonaws.com/prod';

export interface UserMetrics {
  total_meetings: number;
  meetings_this_month: number;
  total_transcripts: number;
  average_confidence_score: number;
  average_meeting_length_minutes: number;
  timestamp: string;
}

function parseUserMetricsPayload(raw: unknown): UserMetrics | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const num = (k: string): number | null => {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v)
      if (Number.isFinite(n)) return n
    }
    return null
  }
  const str = (k: string) => (typeof o[k] === 'string' ? o[k] : null)
  const total = num('total_meetings')
  const month = num('meetings_this_month')
  const transcripts = num('total_transcripts')
  const conf = num('average_confidence_score')
  const len = num('average_meeting_length_minutes')
  const ts = str('timestamp')
  if (total === null || month === null || transcripts === null || conf === null || len === null || !ts) return null
  return {
    total_meetings: total,
    meetings_this_month: month,
    total_transcripts: transcripts,
    average_confidence_score: conf,
    average_meeting_length_minutes: len,
    timestamp: ts,
  }
}

export type FetchUserMetricsResult =
  | { ok: true; data: UserMetrics }
  | { ok: false; error: string }

/**
 * Fetches user metrics for UI display. Unlike {@link getUserMetrics}, this does not swallow HTTP errors.
 */
export async function fetchUserMetricsForDisplay(userId: string): Promise<FetchUserMetricsResult> {
  const id = userId?.trim()
  if (!id) return { ok: false, error: 'Missing user id.' }
  try {
    const response = await apiFetch(`${METRICS_API_BASE}/user-metrics?user_id=${encodeURIComponent(id)}`, {
      method: 'GET',
    })
    if (!response.ok) {
      return { ok: false, error: `Request failed (${response.status}).` }
    }
    const raw: unknown = await response.json()
    const data = parseUserMetricsPayload(raw)
    if (!data) return { ok: false, error: 'Unexpected response from metrics service.' }
    return { ok: true, data }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error.'
    return { ok: false, error: msg }
  }
}

export async function getUserMetrics(userId: string): Promise<UserMetrics> {
  const result = await fetchUserMetricsForDisplay(userId)
  if (result.ok) return result.data
  console.error('Error fetching user metrics:', result.error)
  return {
    total_meetings: 0,
    meetings_this_month: 0,
    total_transcripts: 0,
    average_confidence_score: 0,
    average_meeting_length_minutes: 0,
    timestamp: new Date().toISOString(),
  }
}











