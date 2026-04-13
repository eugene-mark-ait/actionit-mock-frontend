import { Navigate, Route, Routes } from 'react-router-dom'
import { FeaturesLegacyRedirect } from './components/FeaturesLegacyRedirect'
import { IndustriesLegacyRedirect } from './components/IndustriesLegacyRedirect'
import { FeaturesPage } from './pages/FeaturesPage'
import { HomePage } from './pages/HomePage'
import { IndustriesPage } from './pages/IndustriesPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PlaceholderPage title="Sign in" />} />
      <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
      <Route path="/TOS" element={<PlaceholderPage title="Terms of Service" />} />
      <Route path="/features/:slug" element={<FeaturesLegacyRedirect />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/industries/:slug" element={<IndustriesLegacyRedirect />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
