import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homepage/HomePage'
import LoginPage from './pages/auth/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}