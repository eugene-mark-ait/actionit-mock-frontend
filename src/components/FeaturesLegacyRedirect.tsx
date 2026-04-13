import { Navigate, useParams } from 'react-router-dom'

const SLUG_TO_FRAGMENT: Record<string, string> = {
  'dataless-architecture': 'dataless-architecture',
  'automatic-meeting-joining': 'automatic-meeting-joining',
  'speaker-diarization': 'speaker-diarization',
  'notion-integration': 'notion-integration',
}

/** Old URLs like /features/dataless-architecture → /features#dataless-architecture */
export function FeaturesLegacyRedirect() {
  const { slug = '' } = useParams()
  const fragment = SLUG_TO_FRAGMENT[slug]
  if (fragment) {
    return <Navigate to={`/features#${fragment}`} replace />
  }
  return <Navigate to="/features" replace />
}
