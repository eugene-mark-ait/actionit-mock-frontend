/**
 * User preferences on API Gateway.
 * POST `{base}/user/preferences/language` — body `{ userId, preferredLanguage }`.
 *
 * Base: `NEXT_PUBLIC_USER_PREFERENCES_API_BASE`, or falls back to `NEXT_PUBLIC_API_GATEWAY_URL`
 * when preferences are deployed on the same API as billing.
 */

import { getApiGatewayBase } from '@/lib/billing-api'

export interface UpdateLanguagePreferenceResponse {
  success: boolean
  message: string
  language?: string
}

export function getUserPreferencesApiBase(): string {
  const dedicated =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_USER_PREFERENCES_API_BASE?.trim() : ''
  if (dedicated) return dedicated.replace(/\/$/, '')
  return getApiGatewayBase().replace(/\/$/, '')
}

/**
 * Persist transcription / analysis language for the signed-in user.
 */
export async function updateTranscriptionLanguagePreference(
  userId: string,
  preferredLanguage: string,
): Promise<UpdateLanguagePreferenceResponse> {
  const base = getUserPreferencesApiBase()
  if (!base) {
    throw new Error(
      'Language preferences API is not configured. Set NEXT_PUBLIC_USER_PREFERENCES_API_BASE or NEXT_PUBLIC_API_GATEWAY_URL.',
    )
  }

  const res = await fetch(`${base}/user/preferences/language`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, preferredLanguage }),
  })

  const text = await res.text()
  let data: UpdateLanguagePreferenceResponse & { error?: string } = {
    success: false,
    message: 'Unknown error',
  }
  try {
    data = text ? (JSON.parse(text) as typeof data) : data
  } catch {
    if (!res.ok) {
      throw new Error(`Language update failed (${res.status}): ${text.slice(0, 200)}`)
    }
    throw new Error('Invalid JSON from language preferences API')
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `Language update failed (${res.status})`)
  }

  if (data.success !== true) {
    throw new Error(data.message || data.error || 'Language preference was not saved.')
  }

  return data
}
