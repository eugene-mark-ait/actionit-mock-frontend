import { Suspense } from 'react'
import { OAuthCallbackClient } from './oauth-callback-client'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-page text-sm text-zinc-600">
          Loading…
        </div>
      }
    >
      <OAuthCallbackClient />
    </Suspense>
  )
}
