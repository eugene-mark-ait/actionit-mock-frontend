'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { readAuthSession } from '@/lib/auth-session'

function hasValidStoredSession(): boolean {
  if (typeof window === 'undefined') return false
  const s = readAuthSession()
  return Boolean(s?.user?.id && s.expires_at > Date.now())
}

/**
 * Blocks rendering until auth state is known; redirects unauthenticated users to sign-in.
 *
 * After OAuth, `writeAuthSession` updates localStorage before `AuthContext` state updates.
 * Child `useEffect` can run before a parent pathname sync, so we use `useLayoutEffect` to
 * call `refreshSession` and we never redirect while localStorage still holds a valid session.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, refreshSession } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const storageLoggedIn = hasValidStoredSession()
  const pendingContextSync = storageLoggedIn && !isAuthenticated

  useLayoutEffect(() => {
    if (loading) return
    if (pendingContextSync) {
      void refreshSession()
    }
  }, [loading, pendingContextSync, refreshSession])

  useEffect(() => {
    if (loading) return
    if (pendingContextSync) return

    if (!isAuthenticated) {
      const search = pathname ? `?from=${encodeURIComponent(pathname)}` : ''
      router.replace(`/login${search}`)
    }
  }, [loading, isAuthenticated, pendingContextSync, router, pathname])

  if (loading || !isAuthenticated) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-page px-4"
        aria-busy="true"
        aria-live="polite"
      >
        <Loader2 className="h-9 w-9 animate-spin text-brand-cyan" aria-hidden />
        <p className="text-sm text-zinc-600">
          {pendingContextSync ? 'Restoring your session…' : 'Checking your session…'}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
