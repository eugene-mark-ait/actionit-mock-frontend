'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const SLUG_TO_FRAGMENT: Record<string, string> = {
  legal: 'legal',
  healthcare: 'healthcare',
  consulting: 'consulting',
  sales: 'sales',
  enterprise: 'enterprise',
}

export default function IndustriesLegacyRedirectPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const slug = typeof params.slug === 'string' ? params.slug : ''
    const fragment = SLUG_TO_FRAGMENT[slug]
    if (fragment) {
      window.location.replace(`/industries#${fragment}`)
    } else {
      router.replace('/industries')
    }
  }, [params, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-page text-neutral-500">
      Redirecting…
    </div>
  )
}
