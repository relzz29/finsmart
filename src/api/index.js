import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth, setNotifCallback, setRefetchCallback } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import { NotifProvider, useNotifications } from './hooks/useNotifications'
import { logoBase64 } from './assets/logo'
import { getAdminToken, adminAuthApi, removeAdminToken } from './api'

import Onboarding      from './pages/Onboarding'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import Transactions    from './pages/Transactions'
import Budget          from './pages/Budget'
import Education       from './pages/Education'
import Profile         from './pages/Profile'
import Simulation      from './pages/Simulation'
import RatingApp       from './pages/RatingApp'
import BantuanFAQ      from './pages/BantuanFAQ'
import Notifikasi      from './pages/Notifikasi'
import SideNav         from './components/SideNav'
import AdminRegister   from './pages/AdminRegister'
import AdminLogin      from './pages/AdminLogin'
import AdminDashboard  from './pages/AdminDashboard'

function Loader() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg, #F9FAFB)', zIndex: 9999 }}>
      <img src={logoBase64} alt="FinSmart" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 16, animation: 'pulse 1.5s ease infinite', filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.3))' }} />
      <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-display)' }}>Memuat...</div>
    </div>
  )
}

// ── Guard: halaman user biasa ───────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ── Guard: halaman publik (redirect jika sudah login) ───────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

// ── Guard: halaman admin ────────────────────────────────────────────
// Verifikasi token ke server, bukan hanya cek localStorage.
// Tiga kemungkinan state:
//   'loading'  → sedang verifikasi ke server, tampilkan Loader
//   'valid'    → server konfirmasi token valid, render halaman admin
//   'invalid'  → token tidak ada / expired / palsu → redirect ke login
function AdminRoute({ children }) {
  const [status, setStatus] = React.useState('loading')

  React.useEffect(() => {
    const token = getAdminToken()
    // Kalau sama sekali tidak ada token di localStorage, langsung invalid
    if (!token) { setStatus('invalid'); return }

    // Kalau ada token, tanya server apakah token masih valid
    adminAuthApi.verifyToken()
      .then(() => setStatus('valid'))
      .catch(() => {
        // Token expired, palsu, atau server menolak → hapus token lama
        removeAdminToken()
        setStatus('invalid')
      })
  }, [])

  if (status === 'loading') return <Loader />
  if (status === 'invalid') return <Navigate to="/admin-login" replace />
  return children
}

// ── Bridge notif ─────────────────────────────────────────────────────
function NotifBridge() {
  const { addNotif, refetch } = useNotifications()
  useEffect(() => {
    setNotifCallback(addNotif)
    setRefetchCallback(refetch)
    return () => { setNotifCallback(null); setRefetchCallback(null) }
  }, [addNotif, refetch])
  return null
}

function AppRoutes() {
  const { user } = useAuth()
  const location = useLocation()
  const showSidebar = user && !['/login', '/register', '/'].includes(location.pathname)

  return (
    <>
      <NotifBridge />
      {showSidebar && <SideNav />}
      <Routes>
        {/* Publik */}
        <Route path="/"         element={<PublicRoute><Onboarding /></PublicRoute>} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* User terautentikasi */}
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budget"       element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/education"    element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/simulation"   element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
        <Route path="/rating"       element={<ProtectedRoute><RatingApp /></ProtectedRoute>} />
        <Route path="/bantuan"      element={<ProtectedRoute><BantuanFAQ /></ProtectedRoute>} />
        <Route path="/notifikasi"   element={<ProtectedRoute><Notifikasi /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-login"    element={<AdminLogin />} />
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <NotifProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </NotifProvider>
    </BrowserRouter>
  )
}