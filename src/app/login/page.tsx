import { Suspense } from 'react'
import { SignInPage } from '@/views/SignInPage'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  )
}
