import type { DashboardUser } from '@/types/user'

/**
 * Google Calendar is provisioned automatically on sign-up / OAuth.
 * UI treats it as connected unless the session explicitly says `disconnected`
 * (e.g. local demo user).
 */
export function isGoogleCalendarConnected(user: DashboardUser | null): boolean {
  if (!user?.id) return false
  return user.recallCalendarStatus !== 'disconnected'
}
