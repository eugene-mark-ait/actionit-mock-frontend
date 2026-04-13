import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PlaceholderPage title="Sign in" />} />
      <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
      <Route path="/TOS" element={<PlaceholderPage title="Terms of Service" />} />
      <Route path="/features/*" element={<PlaceholderPage title="Features" />} />
      <Route path="/industries/*" element={<PlaceholderPage title="Industries" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
