import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { logoBase64 } from '../assets/logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStep, setForgotStep] = useState(1)
  const [forgotLoading, setForgotLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast('Isi email dan password dulu ya!', 'error'); return }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) { toast('Selamat datang kembali! 👋', 'success'); navigate('/dashboard') }
    else toast(result.error || 'Login gagal', 'error')
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) { toast('Masukkan email kamu dulu!', 'error'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast('Format email tidak valid', 'error'); return
    }
    setForgotLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setForgotLoading(false)
    setForgotStep(2)
  }

  const closeForgot = () => {
    setShowForgot(false)
    setForgotEmail('')
    setForgotStep(1)
    setForgotLoading(false)
  }

  return (
    <div className="app-shell auth-page">
      <div className="auth-content" style={{ padding: 'clamp(24px,6vw,40px) var(--page-padding)', animation: 'fadeIn 0.4s ease' }}>

        {/* Logo header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(20px,5vw,28px)' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '12px 20px',
            boxShadow: '0 8px 32px rgba(124,58,237,0.18)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <img src={logoBase64} alt="FinSmart" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }} />
            <span style={{
              fontSize: 22,
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.5px',
            }}>
              Fin<span style={{ color: '#7C3AED' }}>Smart</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(24px,6vw,36px)',
          marginBottom: 16,
          border: '1px solid rgba(124,58,237,0.08)',
          boxShadow: '0 8px 40px rgba(124,58,237,0.1)',
        }}>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{
              fontSize: 'clamp(22px,6vw,28px)',
              fontWeight: 900,
              marginBottom: 4,
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
            }}>
              Pantau Cuanmu Di Sini 💰
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Masuk dan cek keuanganmu</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukan password anda"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', padding: 4 }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <span onClick={() => setShowForgot(true)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
                  Lupa password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ padding: 'clamp(14px,3.5vw,17px)', fontSize: 16, marginTop: 4 }}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : 'Masuk ✨'}
            </button>
          </form>


        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          Belum punya akun?{' '}
          <span style={{ color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/register')}>
            Daftar sekarang
          </span>
        </p>

      </div>

      {/* Modal Lupa Password */}
      {showForgot && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeForgot()}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}
        >
          <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: 28, width: '100%', maxWidth: 460, animation: 'slideUp 0.3s ease' }}>
            {forgotStep === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>🔑 Lupa Password</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Masukkan email untuk reset password</p>
                  </div>
                  <button onClick={closeForgot} style={{ background: 'var(--border-light)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>✕</button>
                </div>
                <div style={{ background: 'var(--primary-xlight)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>💡</span>
                  <p style={{ fontSize: 13, color: 'var(--primary)', lineHeight: 1.5 }}>Kami akan mengirimkan link reset password ke email kamu.</p>
                </div>
                <form onSubmit={handleForgotPassword}>
                  <div className="input-group" style={{ marginBottom: 16 }}>
                    <label className="input-label">Alamat Email</label>
                    <input className="input-field" type="email" placeholder="nama@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} autoFocus />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" style={{ padding: 16 }} disabled={forgotLoading}>
                    {forgotLoading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><div className="spinner" /> Mengirim...</span> : 'Kirim Link Reset Password 📧'}
                  </button>
                  <button type="button" onClick={closeForgot} className="btn btn-outline w-full" style={{ marginTop: 10, padding: 14 }}>Batal</button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 10 }}>Email Terkirim!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>Link reset password sudah dikirim ke</p>
                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 15, marginBottom: 20 }}>{forgotEmail}</p>
                <button onClick={closeForgot} className="btn btn-primary w-full" style={{ padding: 16 }}>Kembali ke Login ✨</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .auth-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}