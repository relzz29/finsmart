import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { authApi } from '../api'
import BottomNav from '../components/BottomNav'
import { logoBase64 } from '../assets/logo'

// ── Local storage helpers ──────────────────────────────────────────
const LS_PIN     = 'fs_pin_hash'
const LS_2FA     = 'fs_2fa_enabled'
const LS_BIO     = 'fs_biometrik'
const LS_DEVICES = 'fs_devices'

function simpleHash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return h.toString(16)
}

function getDevices() {
  try { return JSON.parse(localStorage.getItem(LS_DEVICES) || '[]') } catch { return [] }
}
function addCurrentDevice() {
  const ua = navigator.userAgent
  const isMobile = /Mobile|Android|iPhone/i.test(ua)
  const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser'
  const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : 'Unknown OS'
  const id = 'dev_' + Date.now()
  const dev = { id, browser, os, isMobile, ip: '127.0.0.1', location: 'Bogor, Indonesia', lastActive: new Date().toISOString(), current: true }
  const existing = getDevices().filter(d => !d.current)
  localStorage.setItem(LS_DEVICES, JSON.stringify([dev, ...existing]))
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [showKeamanan, setShowKeamanan] = useState(false)
  const [keamananStep, setKeamananStep] = useState('menu')

  // Init device on mount
  useEffect(() => { addCurrentDevice() }, [])

  const handleLogout = () => { logout(); navigate('/'); toast('Sampai jumpa! 👋', 'success') }
  const handleSave   = () => { updateUser({ name }); setEditing(false); toast('Profil diperbarui ✅', 'success') }

  const closeKeamanan = () => { setShowKeamanan(false); setKeamananStep('menu') }

  const menuItems = [
    { icon:'👤', label:'Edit Profil',          action: () => setEditing(e => !e) },
    { icon:'🔔', label:'Notifikasi',            action: () => navigate('/notifikasi') },
    { icon:'🔒', label:'Keamanan',             action: () => setShowKeamanan(true) },
    { icon:'📊', label:'Simulasi Investasi',   action: () => navigate('/simulation') },
    { icon:'📚', label:'Riwayat Edukasi',      action: () => navigate('/education') },
    { icon:'⭐', label:'Beri Rating Aplikasi', action: () => navigate('/rating') },
    { icon:'❓', label:'Bantuan & FAQ',         action: () => navigate('/bantuan') },
  ]

  return (
    <div className="app-shell">
      <div className="page">
        {/* Profile Header */}
        <div style={{ background:'var(--gradient-main)', padding:'clamp(40px,8vw,56px) var(--page-padding) clamp(24px,5vw,32px)', textAlign:'center', borderRadius:'0 0 var(--radius-xl) var(--radius-xl)', marginBottom:20, position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
          <div style={{ width:'clamp(70px,18vw,88px)', height:'clamp(70px,18vw,88px)', borderRadius:'50%', background:'white', border:'4px solid rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', boxShadow:'0 4px 24px rgba(0,0,0,0.18)', overflow:'hidden' }}>
            <img src={logoBase64} alt="FinSmart" style={{ width:'90%', height:'90%', objectFit:'contain' }}/>
          </div>
          <h2 style={{ color:'white', fontSize:'clamp(18px,5vw,22px)', fontWeight:900, marginBottom:4, fontFamily:'var(--font-display)' }}>{user?.name || 'Nama Pengguna'}</h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(12px,3vw,14px)' }}>{user?.email || 'nama@email.com'}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginTop:20 }}>
            {[
              { label:'Transaksi', value: user?.stats?.transactions || 128, color:'white' },
              { label:'Budget OK', value: `${user?.stats?.budgetOk || 89}%`, color:'#86EFAC' },
              { label:'Artikel',   value: user?.stats?.articles || 12,       color:'#FDE68A' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.15)', borderRadius:'var(--radius-sm)', padding:'clamp(10px,3vw,14px) 8px' }}>
                <div style={{ color:s.color, fontWeight:900, fontSize:'clamp(18px,5vw,24px)', fontFamily:'var(--font-display)' }}>{s.value}</div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(10px,2.5vw,12px)', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="card animate-fadeup" style={{ margin:'0 var(--page-padding) 14px' }}>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:14, fontFamily:'var(--font-display)' }}>Edit Profil</div>
            <div className="input-group">
              <label className="input-label">Nama</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div className="flex gap-8">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSave}>Simpan ✓</button>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setEditing(false)}>Batal</button>
            </div>
          </div>
        )}

        {/* Menu */}
        <div style={{ padding:'0 var(--page-padding)' }}>
          {menuItems.map(item => (
            <button key={item.label} onClick={item.action} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'clamp(13px,3vw,16px)', background:'white', border:'1px solid var(--border-light)', borderRadius:'var(--radius-sm)', marginBottom:8, cursor:'pointer', boxShadow:'var(--shadow-sm)', transition:'all 0.15s', textAlign:'left', fontFamily:'var(--font-body)' }}>
              <span style={{ fontSize:'clamp(18px,5vw,22px)', width:32, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1, fontWeight:700, fontSize:'clamp(13px,3.5vw,15px)' }}>{item.label}</span>
              <span style={{ color:'var(--text-muted)', fontSize:18 }}>›</span>
            </button>
          ))}
          <button className="btn btn-danger w-full" style={{ marginTop:8, padding:'clamp(13px,3vw,16px)' }} onClick={handleLogout}>
            🚪 Keluar
          </button>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <BottomNav/>

      {/* Modal Keamanan */}
      {showKeamanan && (
        <KeamananModal
          step={keamananStep}
          setStep={setKeamananStep}
          onClose={closeKeamanan}
          user={user}
          toast={toast}
        />
      )}

      <style>{`@keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  MODAL KEAMANAN
// ══════════════════════════════════════════════════════════════════
function KeamananModal({ step, setStep, onClose, user, toast }) {
  const [biometrikEnabled, setBiometrikEnabled] = useState(() => localStorage.getItem(LS_BIO) === '1')
  const [twoFAEnabled,     setTwoFAEnabled]     = useState(() => localStorage.getItem(LS_2FA)  === '1')
  const pinSet = !!localStorage.getItem(LS_PIN)

  const menuItems = [
    { icon:'🔑', emoji:'🔑', title:'Ubah Password',      desc:'Ganti password akunmu',              step:'ubahPassword', badge: null },
    { icon:'🔢', emoji:'🔢', title:'Atur PIN',            desc: pinSet ? 'PIN aktif — ketuk untuk ubah' : 'Buat PIN 6 digit untuk masuk cepat', step:'pin', badge: pinSet ? '✓' : null },
    { icon:'👆', emoji:'👆', title:'Biometrik',           desc: biometrikEnabled ? 'Aktif — Ketuk untuk nonaktifkan' : 'Nonaktif — Ketuk untuk aktifkan', toggle: true,
      onToggle: async () => {
        if (!biometrikEnabled) {
          if (!window.PublicKeyCredential) { toast('Browser tidak mendukung biometrik', 'error'); return }
          try {
            const cred = await navigator.credentials.create({
              publicKey: {
                challenge: new Uint8Array(32),
                rp: { name: 'FinSmart' },
                user: { id: new Uint8Array(16), name: user?.email || 'user', displayName: user?.name || 'User' },
                pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
                authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
                timeout: 30000,
              }
            })
            if (cred) { localStorage.setItem(LS_BIO, '1'); setBiometrikEnabled(true); toast('Biometrik diaktifkan! 👆', 'success') }
          } catch { toast('Biometrik dibatalkan atau tidak tersedia', 'error') }
        } else {
          localStorage.removeItem(LS_BIO); setBiometrikEnabled(false); toast('Biometrik dinonaktifkan', 'success')
        }
      }
    },
    { icon:'🛡️', emoji:'🛡️', title:'Verifikasi 2 Langkah', desc: twoFAEnabled ? 'Aktif — keamanan ekstra via email' : 'Keamanan tambahan via SMS/email', step:'verifikasi2', badge: twoFAEnabled ? '✓' : null },
    { icon:'📱', emoji:'📱', title:'Perangkat Aktif',    desc:'Lihat sesi login aktif',            step:'perangkat' },
  ]

  const Wrapper = ({ children }) => (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'white', borderRadius:'24px 24px 0 0', padding:28, width:'100%', maxWidth:'var(--shell-width)', maxHeight:'88vh', overflowY:'auto', animation:'slideUp 0.3s ease' }}>
        {children}
      </div>
    </div>
  )

  const BackBtn = ({ label }) => (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
      <button onClick={() => setStep('menu')} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
      <div>
        <h3 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>{label}</h3>
      </div>
    </div>
  )

  // ── MENU ──────────────────────────────────────────────────────────
  if (step === 'menu') return (
    <Wrapper>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h3 style={{ fontSize:20, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>🔒 Keamanan</h3>
          <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:4 }}>Kelola keamanan akunmu</p>
        </div>
        <button onClick={onClose} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
      </div>
      {menuItems.map(item => (
        <button key={item.title}
          onClick={() => item.toggle ? item.onToggle() : setStep(item.step)}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:16, background:'var(--border-light)', border:'none', borderRadius:'var(--radius-sm)', marginBottom:10, cursor:'pointer', textAlign:'left' }}>
          <span style={{ fontSize:24, width:36, textAlign:'center', flexShrink:0 }}>{item.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:15, color:'var(--text)', fontFamily:'var(--font-body)', display:'flex', alignItems:'center', gap:6 }}>
              {item.title}
              {item.badge && <span style={{ background:'#10B981', color:'white', fontSize:10, borderRadius:10, padding:'1px 7px', fontWeight:700 }}>{item.badge}</span>}
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>
              {item.title === 'Biometrik' ? (biometrikEnabled ? 'Aktif — Ketuk untuk nonaktifkan' : 'Nonaktif — Ketuk untuk aktifkan')
               : item.title === 'Verifikasi 2 Langkah' ? (twoFAEnabled ? 'Aktif — keamanan ekstra via email' : 'Keamanan tambahan via SMS/email')
               : item.desc}
            </div>
          </div>
          {item.toggle ? (
            <div style={{ width:44, height:24, borderRadius:12, background: biometrikEnabled ? 'var(--primary)' : '#D1D5DB', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'white', position:'absolute', top:2, left: biometrikEnabled ? 22 : 2, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
            </div>
          ) : (
            <span style={{ color:'var(--text-muted)', fontSize:18 }}>›</span>
          )}
        </button>
      ))}
    </Wrapper>
  )

  // ── UBAH PASSWORD ─────────────────────────────────────────────────
  if (step === 'ubahPassword') return (
    <Wrapper>
      <StepUbahPassword setStep={setStep} toast={toast} user={user}/>
    </Wrapper>
  )

  // ── PIN ───────────────────────────────────────────────────────────
  if (step === 'pin') return (
    <Wrapper>
      <StepPin setStep={setStep} toast={toast}/>
    </Wrapper>
  )

  // ── VERIFIKASI 2 LANGKAH ──────────────────────────────────────────
  if (step === 'verifikasi2') return (
    <Wrapper>
      <StepVerifikasi2 setStep={setStep} toast={toast} user={user} twoFAEnabled={localStorage.getItem(LS_2FA) === '1'} setTwoFAEnabled={v => { if(v) localStorage.setItem(LS_2FA,'1'); else localStorage.removeItem(LS_2FA) }}/>
    </Wrapper>
  )

  // ── PERANGKAT AKTIF ───────────────────────────────────────────────
  if (step === 'perangkat') return (
    <Wrapper>
      <StepPerangkat setStep={setStep} toast={toast}/>
    </Wrapper>
  )

  return null
}

// ══════════════════════════════════════════════════════════════════
//  STEP: UBAH PASSWORD
// ══════════════════════════════════════════════════════════════════
function StepUbahPassword({ setStep, toast }) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confPass, setConfPass] = useState('')
  const [shows, setShows] = useState([false, false, false])
  const [loading, setLoading] = useState(false)

  const toggle = (i) => setShows(s => s.map((v, j) => j === i ? !v : v))

  const strength = newPass.length === 0 ? 0 : newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : 3
  const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat']
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!oldPass)          { toast('Masukkan password lama', 'error'); return }
    if (newPass.length < 6){ toast('Password baru minimal 6 karakter', 'error'); return }
    if (newPass !== confPass){ toast('Konfirmasi password tidak sama', 'error'); return }
    setLoading(true)
    try {
      await authApi.updateProfile({ password: oldPass, newPassword: newPass })
      toast('Password berhasil diubah! 🔒', 'success')
      setStep('menu')
    } catch (err) {
      toast(err.message || 'Gagal mengubah password', 'error')
    } finally { setLoading(false) }
  }

  const fields = [
    { label:'Password Lama', val:oldPass, set:setOldPass, i:0 },
    { label:'Password Baru', val:newPass, set:setNewPass, i:1 },
    { label:'Konfirmasi Password Baru', val:confPass, set:setConfPass, i:2 },
  ]

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => setStep('menu')} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        <h3 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>🔑 Ubah Password</h3>
      </div>
      <form onSubmit={handleSubmit}>
        {fields.map(f => (
          <div key={f.label} className="input-group">
            <label className="input-label">{f.label}</label>
            <div style={{ position:'relative' }}>
              <input className="input-field" type={shows[f.i] ? 'text' : 'password'} placeholder="••••••••" value={f.val} onChange={e => f.set(e.target.value)} style={{ paddingRight:48 }}/>
              <button type="button" onClick={() => toggle(f.i)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontSize:16, cursor:'pointer' }}>
                {shows[f.i] ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        ))}
        {newPass && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>Kekuatan password:</div>
            <div style={{ height:6, borderRadius:3, background:'var(--border)', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:3, background:strengthColor[strength], width:`${[0,33,66,100][strength]}%`, transition:'all 0.3s' }}/>
            </div>
            <div style={{ fontSize:11, marginTop:4, color:strengthColor[strength] }}>{strengthLabel[strength]} ({newPass.length} karakter)</div>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-full" style={{ padding:16 }} disabled={loading}>
          {loading ? <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}><div className="spinner"/>Menyimpan...</span> : 'Simpan Password Baru 🔒'}
        </button>
      </form>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
//  STEP: ATUR PIN
// ══════════════════════════════════════════════════════════════════
function StepPin({ setStep, toast }) {
  const pinSet = !!localStorage.getItem(LS_PIN)
  const [subStep, setSubStep] = useState(pinSet ? 'verify' : 'new') // verify | new | confirm
  const [oldPin, setOldPin]     = useState('')
  const [pin, setPin]           = useState('')
  const [confirmPin, setConfPin] = useState('')
  const [error, setError]       = useState('')

  const handleVerify = (e) => {
    e.preventDefault()
    if (simpleHash(oldPin) !== localStorage.getItem(LS_PIN)) { setError('PIN lama salah'); return }
    setOldPin(''); setError(''); setSubStep('new')
  }
  const handleNew = (e) => {
    e.preventDefault()
    if (pin.length !== 6) { setError('PIN harus tepat 6 digit'); return }
    setError(''); setSubStep('confirm')
  }
  const handleConfirm = (e) => {
    e.preventDefault()
    if (pin !== confirmPin) { setError('PIN tidak cocok'); return }
    localStorage.setItem(LS_PIN, simpleHash(pin))
    toast('PIN berhasil ' + (pinSet ? 'diubah' : 'dibuat') + '! 🔢', 'success')
    setStep('menu')
  }

  const PinDots = ({ val, match }) => (
    <div style={{ display:'flex', gap:10, justifyContent:'center', margin:'8px 0 16px' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ width:16, height:16, borderRadius:'50%', background: i < val.length ? (match !== undefined ? (match ? '#10B981' : '#EF4444') : 'var(--primary)') : 'var(--border)', transition:'all 0.15s' }}/>
      ))}
    </div>
  )

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => { if(subStep === 'confirm') setSubStep('new'); else setStep('menu') }} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        <h3 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>
          🔢 {subStep === 'verify' ? 'Verifikasi PIN Lama' : subStep === 'new' ? 'Buat PIN Baru' : 'Konfirmasi PIN'}
        </h3>
      </div>

      {subStep === 'verify' && (
        <form onSubmit={handleVerify}>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16, textAlign:'center' }}>Masukkan PIN lama untuk melanjutkan</p>
          <input className="input-field" type="number" inputMode="numeric" maxLength={6} placeholder="······" value={oldPin} onChange={e => { setOldPin(e.target.value.slice(0,6)); setError('') }} style={{ letterSpacing:8, fontSize:22, fontWeight:900, textAlign:'center' }} autoFocus/>
          <PinDots val={oldPin}/>
          {error && <div style={{ color:'var(--danger)', fontSize:13, textAlign:'center', marginBottom:12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary w-full" style={{ padding:16 }}>Lanjutkan</button>
        </form>
      )}

      {subStep === 'new' && (
        <form onSubmit={handleNew}>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16, textAlign:'center' }}>Buat PIN 6 digit baru</p>
          <input className="input-field" type="number" inputMode="numeric" maxLength={6} placeholder="······" value={pin} onChange={e => { setPin(e.target.value.slice(0,6)); setError('') }} style={{ letterSpacing:8, fontSize:22, fontWeight:900, textAlign:'center' }} autoFocus/>
          <PinDots val={pin}/>
          {error && <div style={{ color:'var(--danger)', fontSize:13, textAlign:'center', marginBottom:12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary w-full" style={{ padding:16 }}>Lanjutkan</button>
        </form>
      )}

      {subStep === 'confirm' && (
        <form onSubmit={handleConfirm}>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16, textAlign:'center' }}>Ulangi PIN untuk konfirmasi</p>
          <input className="input-field" type="number" inputMode="numeric" maxLength={6} placeholder="······" value={confirmPin} onChange={e => { setConfPin(e.target.value.slice(0,6)); setError('') }} style={{ letterSpacing:8, fontSize:22, fontWeight:900, textAlign:'center' }} autoFocus/>
          <PinDots val={confirmPin} match={confirmPin.length > 0 ? confirmPin === pin.slice(0, confirmPin.length) : undefined}/>
          {error && <div style={{ color:'var(--danger)', fontSize:13, textAlign:'center', marginBottom:12 }}>{error}</div>}
          <button type="submit" className="btn btn-success w-full" style={{ padding:16 }}>Simpan PIN 🔢</button>
        </form>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
//  STEP: VERIFIKASI 2 LANGKAH
// ══════════════════════════════════════════════════════════════════
function StepVerifikasi2({ setStep, toast, user, twoFAEnabled, setTwoFAEnabled }) {
  const [enabled, setEnabled]   = useState(twoFAEnabled)
  const [subStep, setSubStep]   = useState('info') // info | otpInput
  const [otp, setOtp]           = useState('')
  const [generatedOtp, setGen]  = useState('')
  const [loading, setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(0)

  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGen(code)
    setCountdown(60)
    setLoading(false)
    // Simulasi kirim — tampil di toast untuk demo
    toast(`Kode OTP: ${code} (demo)`, 'success')
    const t = setInterval(() => setCountdown(c => { if(c <= 1){ clearInterval(t); return 0 } return c-1 }), 1000)
  }

  const handleToggle = () => {
    if (!enabled) {
      setSubStep('otpInput')
      setLoading(true)
      setTimeout(() => { sendOtp() }, 800)
    } else {
      setTwoFAEnabled(false)
      setEnabled(false)
      toast('Verifikasi 2 Langkah dinonaktifkan', 'success')
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp !== generatedOtp) { toast('Kode OTP salah', 'error'); return }
    setTwoFAEnabled(true)
    setEnabled(true)
    toast('Verifikasi 2 Langkah aktif! 🛡️', 'success')
    setStep('menu')
  }

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => subStep === 'otpInput' ? setSubStep('info') : setStep('menu')} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        <h3 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>🛡️ Verifikasi 2 Langkah</h3>
      </div>

      {subStep === 'info' && (
        <>
          <div style={{ background: enabled ? '#ECFDF5' : '#F5F3FF', border:`1px solid ${enabled ? '#A7F3D0' : '#DDD6FE'}`, borderRadius:'var(--radius)', padding:20, marginBottom:20, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{enabled ? '✅' : '🛡️'}</div>
            <div style={{ fontWeight:800, fontSize:16, color: enabled ? '#059669' : 'var(--primary)', marginBottom:6 }}>
              {enabled ? '2FA Aktif' : '2FA Belum Aktif'}
            </div>
            <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>
              {enabled
                ? 'Akun kamu dilindungi dengan lapisan keamanan tambahan. Setiap login memerlukan kode OTP.'
                : 'Aktifkan untuk mendapatkan kode OTP setiap kali login. Melindungi akunmu dari akses tidak sah.'}
            </div>
          </div>
          <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'var(--radius-sm)', padding:14, marginBottom:20, fontSize:13, color:'#92400E', lineHeight:1.6 }}>
            📧 Kode akan dikirim ke: <strong>{user?.email || 'email kamu'}</strong>
          </div>
          <button className={`btn w-full ${enabled ? 'btn-danger' : 'btn-primary'}`} style={{ padding:16 }} onClick={handleToggle} disabled={loading}>
            {loading ? <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}><div className="spinner"/>Mengirim kode...</span>
              : enabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
          </button>
        </>
      )}

      {subStep === 'otpInput' && (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>📧</div>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Cek email kamu</p>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Kode OTP 6 digit dikirim ke <strong>{user?.email}</strong></p>
          </div>
          <div className="input-group">
            <label className="input-label">Kode OTP</label>
            <input className="input-field" type="number" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.slice(0,6))} style={{ letterSpacing:6, fontSize:24, fontWeight:900, textAlign:'center' }} autoFocus/>
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ padding:16, marginBottom:12 }}>Verifikasi & Aktifkan</button>
          <button type="button"
            onClick={() => { if(countdown === 0) sendOtp() }}
            style={{ width:'100%', background:'none', border:'none', color: countdown > 0 ? 'var(--text-muted)' : 'var(--primary)', fontSize:13, cursor: countdown > 0 ? 'default' : 'pointer', fontWeight:600 }}>
            {countdown > 0 ? `Kirim ulang dalam ${countdown}s` : 'Kirim ulang kode'}
          </button>
        </form>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
//  STEP: PERANGKAT AKTIF
// ══════════════════════════════════════════════════════════════════
function StepPerangkat({ setStep, toast }) {
  const [devices, setDevices] = useState(getDevices())

  const handleLogoutDevice = (id) => {
    const updated = devices.filter(d => d.id !== id)
    localStorage.setItem(LS_DEVICES, JSON.stringify(updated))
    setDevices(updated)
    toast('Sesi diakhiri', 'success')
  }

  const handleLogoutAll = () => {
    const updated = devices.filter(d => d.current)
    localStorage.setItem(LS_DEVICES, JSON.stringify(updated))
    setDevices(updated)
    toast('Semua sesi lain diakhiri', 'success')
  }

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'Baru saja'
    if (m < 60) return `${m} menit lalu`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} jam lalu`
    return `${Math.floor(h/24)} hari lalu`
  }

  const otherDevices = devices.filter(d => !d.current)

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => setStep('menu')} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        <h3 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)' }}>📱 Perangkat Aktif</h3>
      </div>

      <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>
        {devices.length} perangkat terdaftar • {otherDevices.length} sesi lain aktif
      </p>

      {devices.map(d => (
        <div key={d.id} style={{ background: d.current ? '#F5F3FF' : 'var(--border-light)', border:`1px solid ${d.current ? '#DDD6FE' : 'var(--border-light)'}`, borderRadius:'var(--radius-sm)', padding:16, marginBottom:10, display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ fontSize:32, flexShrink:0 }}>{d.isMobile ? '📱' : '💻'}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:14, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
              {d.browser} · {d.os}
              {d.current && <span style={{ background:'var(--primary)', color:'white', fontSize:10, borderRadius:10, padding:'1px 7px', fontWeight:700 }}>Ini</span>}
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{d.location} • {timeAgo(d.lastActive)}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>IP: {d.ip}</div>
          </div>
          {!d.current && (
            <button onClick={() => handleLogoutDevice(d.id)} style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'6px 12px', color:'var(--danger)', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              Keluarkan
            </button>
          )}
        </div>
      ))}

      {otherDevices.length > 0 && (
        <button className="btn btn-danger w-full" style={{ padding:14, marginTop:8 }} onClick={handleLogoutAll}>
          🚪 Akhiri Semua Sesi Lain
        </button>
      )}
      {devices.length === 0 && (
        <div className="empty-state"><div className="emoji">📱</div><p>Belum ada perangkat terdaftar</p></div>
      )}
    </>
  )
}