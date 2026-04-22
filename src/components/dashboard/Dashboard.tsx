'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { DashboardIntegrationsSection } from '@/components/dashboard/DashboardIntegrationsSection'
import { DashboardAccountSection } from '@/components/dashboard/DashboardAccountSection'
import { DashboardHero } from '@/components/dashboard/DashboardHero'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <DashboardShell mainAriaLabel="Dashboard">
      {({ transcriptionLanguage }) => (
        <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
          <DashboardHero user={user} transcriptionLanguage={transcriptionLanguage} />
          <DashboardIntegrationsSection user={user} />
          <DashboardAccountSection user={user} />
        </div>
      )}
    </DashboardShell>
  )
}

export default Dashboard
