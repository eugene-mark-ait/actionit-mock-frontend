/**
 * HubSpot backend config — override with NEXT_PUBLIC_HUBSPOT_API_BASE in .env if needed.
 */
const DEFAULT_HUBSPOT_API_BASE = 'https://e76ryaww85.execute-api.us-east-2.amazonaws.com'

export const HUBSPOT_API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HUBSPOT_API_BASE) || DEFAULT_HUBSPOT_API_BASE

export const HUBSPOT_PATHS = {
  initiate: '/oauth/initiate',
  callback: '/oauth/callback',
  status: '/oauth/status',
} as const
