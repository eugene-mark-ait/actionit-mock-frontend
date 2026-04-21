import { Suspense } from 'react'
import { CheckoutSuccessClient } from '@/app/checkout/success/checkout-success-client'

export const dynamic = 'force-dynamic'

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-page text-sm text-zinc-600">Loading…</div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  )
}
