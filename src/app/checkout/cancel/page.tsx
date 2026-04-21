'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearPendingPlanId } from '@/lib/plan-flow'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-sm text-zinc-600">No payment was taken. You can pick a plan again whenever you are ready.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              clearPendingPlanId()
              router.push('/plans')
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-cyan px-6 text-sm font-semibold text-white shadow-md hover:bg-sky-500"
          >
            Choose a plan
          </button>
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-zinc-200 bg-surface px-6 text-sm font-semibold text-brand-navy hover:border-brand-cyan/40"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
