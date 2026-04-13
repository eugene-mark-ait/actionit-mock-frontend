import { Navigate, useParams } from 'react-router-dom'

const SLUG_TO_FRAGMENT: Record<string, string> = {
  legal: 'legal',
  healthcare: 'healthcare',
  consulting: 'consulting',
  sales: 'sales',
  enterprise: 'enterprise',
}

/** /industries/legal → /industries#legal */
export function IndustriesLegacyRedirect() {
  const { slug = '' } = useParams()
  const fragment = SLUG_TO_FRAGMENT[slug]
  if (fragment) {
    return <Navigate to={`/industries#${fragment}`} replace />
  }
  return <Navigate to="/industries" replace />
}
