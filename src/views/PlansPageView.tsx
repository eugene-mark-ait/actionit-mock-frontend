'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { HeroFirstViewportBackdrop } from '@/components/Hero'
import { PlanSelectionView } from '@/components/plan/PlanSelectionView'

export function PlansPageView() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Plans | actionit.ai'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-clip bg-page">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 min-h-[100dvh]">
        <HeroFirstViewportBackdrop />
      </div>
      <Navbar />
      <main className="relative z-10 pb-24 pt-12 sm:pt-16">
        <PlanSelectionView className="pt-4" />
        <p className="mx-auto mt-12 max-w-xl px-6 text-center text-sm text-neutral-500">
          <Link href="/pricing" className="font-medium text-brand-cyan underline-offset-2 hover:underline">
            Compare details on the pricing page
          </Link>{' '}
          or{' '}
          <Link href="/dashboard" className="font-medium text-brand-cyan underline-offset-2 hover:underline">
            return to the dashboard
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
