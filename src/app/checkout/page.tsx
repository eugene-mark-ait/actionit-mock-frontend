import { Suspense } from 'react'
import { CheckoutRedirectClient } from '@/app/checkout/checkout-redirect-client'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-page text-sm text-zinc-600">Loading…</div>
      }
    >
      <CheckoutRedirectClient />
    </Suspense>
  )
}
