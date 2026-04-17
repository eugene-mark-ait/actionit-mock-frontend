'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const SLUG_TO_FRAGMENT: Record<string, string> = {
  'dataless-architecture': 'dataless-architecture',
  'automatic-meeting-joining': 'automatic-meeting-joining',
  'speaker-diarization': 'speaker-diarization',
  'notion-integration': 'notion-integration',
}

export default function FeaturesLegacyRedirectPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const slug = typeof params.slug === 'string' ? params.slug : ''
    const fragment = SLUG_TO_FRAGMENT[slug]
    if (fragment) {
      window.location.replace(`/features#${fragment}`)
    } else {
      router.replace('/features')
    }
  }, [params, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-page text-neutral-500">
      Redirecting…
    </div>
  )
}
