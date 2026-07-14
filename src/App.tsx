import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homepage/HomePage'
import LoginPage from './pages/auth/LoginPage'
import BookAppointment from './pages/appointment/BookAppointment'
import Dashboard from './pages/admin/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book-appointments" element={<BookAppointment />} />

      //Adminroutes
      <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  )
}