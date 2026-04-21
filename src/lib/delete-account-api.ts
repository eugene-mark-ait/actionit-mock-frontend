/**
 * Account deletion on its own API Gateway (`NEXT_PUBLIC_DELETE_ACCOUNT_API_GATEWAY_URL`).
 * POST `{origin}/delete-account` with body `{ userId }`.
 */

export interface DeleteAccountResponse {
  success: boolean
  message: string
  deletionResults?: {
    users_deleted: number
    oauth_tokens_deleted: number
    calendars_deleted: number
    bots_deleted: number
    errors: string[]
  }
}

/**
 * Secondary cleanup (e.g. transcript_mappings GetItem) can fail with ValidationException
 * when keys/schema do not match after the user is already removed — not actionable here.
 */
function isBenignDeletionCleanupError(message: string): boolean {
  const lower = message.toLowerCase()
  if (lower.includes('transcript mapping')) return true
  if (
    lower.includes('validationexception') &&
    (lower.includes('key element does not match') || lower.includes('getitem'))
  ) {
    return true
  }
  return false
}

export function partitionDeletionErrors(errors: string[]): {
  benign: string[]
  remaining: string[]
} {
  const benign: string[] = []
  const remaining: string[] = []
  for (const err of errors) {
    if (isBenignDeletionCleanupError(err)) benign.push(err)
    else remaining.push(err)
  }
  return { benign, remaining }
}

function getDeleteAccountApiGatewayBase(): string {
  return (
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_DELETE_ACCOUNT_API_GATEWAY_URL?.trim() : '') || ''
  )
}

function assertGatewayBaseForDeleteAccount(): string {
  const base = getDeleteAccountApiGatewayBase().replace(/\/$/, '')
  if (!base) {
    throw new Error('Account deletion is not configured (set NEXT_PUBLIC_DELETE_ACCOUNT_API_GATEWAY_URL).')
  }
  return base
}

export async function deleteUserAccount(userId: string): Promise<DeleteAccountResponse> {
  const base = assertGatewayBaseForDeleteAccount()
  const res = await fetch(`${base}/delete-account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  const text = await res.text()
  let data: DeleteAccountResponse & { error?: string } = { success: false, message: 'Unknown error' }
  try {
    data = text ? (JSON.parse(text) as typeof data) : data
  } catch {
    if (!res.ok) {
      throw new Error(`Delete account failed (${res.status}): ${text.slice(0, 200)}`)
    }
    throw new Error('Invalid JSON from delete-account API')
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `Delete account failed (${res.status})`)
  }

  if (data.success !== true) {
    throw new Error(data.message || data.error || 'Account deletion was not confirmed by the server.')
  }

  return data as DeleteAccountResponse
}
