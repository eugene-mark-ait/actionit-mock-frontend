'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

export interface DashboardUser {
  id: string
  email: string
  name: string
  picture?: string
  verified_email?: boolean
  recallCalendarId?: string
  recallCalendarStatus?: string
  /** ISO 8601 — from API when available */
  createdAt?: string
  /** e.g. "free", "pro" — from API when available */
  subscriptionTier?: string
}

interface SessionShape {
  user: DashboardUser
  access_token?: string
  expires_at?: number
}

interface AuthContextType {
  user: DashboardUser | null
  loading: boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredSession(): SessionShape | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('auth_session')
    if (!raw) return null
    const data = JSON.parse(raw) as SessionShape
    if (data?.expires_at && data.expires_at <= Date.now()) {
      localStorage.removeItem('auth_session')
      return null
    }
    return data
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = readStoredSession()
    if (session?.user) {
      setUser(session.user)
      setLoading(false)
      return
    }

    const demo: DashboardUser = {
      id: 'local-demo-user',
      email: 'demo@actionit.ai',
      name: 'Demo user',
      verified_email: true,
      recallCalendarStatus: 'disconnected',
      createdAt: '2025-01-15T12:00:00.000Z',
      subscriptionTier: 'free',
    }
    setUser(demo)
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('auth_session')
    } catch {
      /* ignore */
    }
    setUser(null)
    router.push('/login')
  }, [router])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
