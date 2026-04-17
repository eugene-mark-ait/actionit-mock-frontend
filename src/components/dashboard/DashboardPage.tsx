'use client'

import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/components/dashboard/Dashboard'

export function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
      <Toaster />
    </AuthProvider>
  )
}
