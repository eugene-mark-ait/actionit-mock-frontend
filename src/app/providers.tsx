'use client'

import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
}
