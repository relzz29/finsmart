import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import BottomNav from '../components/BottomNav'

export default function Simulation() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(1000000)
  const [monthly, setMonthly] = useState(500000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(5)

  const result = useMemo(() => {
    const r = rate / 100 / 12, n = years * 12
    const fvModal = modal * Math.pow(1 + r, n)
    const fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r)
    const total = fvModal + fvMonthly
    const totalInvested = modal + monthly * n
    const profit = total - totalInvested
    const pct = ((profit / totalInvested) * 100).toFixed(1)
    const chartData = Array.from({ length: years + 1 }, (_, y) => {
      const mn = y * 12
      const val = modal * Math.pow(1 + r, mn) + monthly * ((Math.pow(1 + r, mn) - 1) / r)
      return { year: `Thn ${y}`, value: Math.round(val) }
    })
    return { total: Math.round(total), profit: Math.round(profit), pct, chartData }
  }, [modal, monthly, rate, years])

  const fmtM = (v) => v >= 1000000 ? `${(v/1000000).toFixed(1).replace('.', ',')} Jt` : `${(v/1000).toFixed(0)} Rb`

  return (
    <div className="app-shell">
      <div className="page">

        {/* Header */}
        <div className="flex items-center gap-12" style={{ padding:'clamp(40px,8vw,52px) var(--page-padding) 16px' }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <div>
            <h1 className="page-title">Simulasi Investasi 📈</h1>
            <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:2 }}>Hitung potensi pertumbuhanmu</p>
          </div>
        </div>

        <div style={{ padding:'0 var(--page-padding)' }}>

          {/* Sliders */}
          <div className="card animate-fadeup-1" style={{ marginBottom:14 }}>
            <SliderInput label="Modal Awal" value={modal} min={100000} max={10000000} step={100000} onChange={setModal} format={fmtM}/>
            <SliderInput label="Investasi/Bulan" value={monthly} min={50000} max={5000000} step={50000} onChange={setMonthly} format={fmtM}/>
            <SliderInput label="Return/Tahun (%)" value={rate} min={4} max={30} step={1} onChange={setRate} format={v => `${v}%`}/>
            <SliderInput label="Jangka Waktu" value={years} min={1} max={30} step={1} onChange={setYears} format={v => `${v} Tahun`} accent/>
          </div>

          {/* Chart */}
          <div className="card animate-fadeup-2" style={{ marginBottom:14 }}>
            <div className="section-title" style={{ marginBottom:12 }}>📊 Proyeksi Pertumbuhan</div>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={result.chartData}>
                <XAxis dataKey="year" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip
                  contentStyle={{ borderRadius:10, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', fontSize:12 }}
                  formatter={v => [`Rp ${v.toLocaleString('id-ID')}`, 'Nilai']}
                />
                <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Result */}
          <div className="animate-fadeup-3" style={{ background:'var(--gradient-teal)', borderRadius:'var(--radius-lg)', padding:'clamp(20px,5vw,28px) var(--page-padding)', textAlign:'center', boxShadow:'0 8px 32px rgba(6,182,212,0.3)', marginBottom:20 }}>
            <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'clamp(12px,3vw,14px)', marginBottom:8 }}>Estimasi Nilai Akhir 🎯</div>
            <div style={{ color:'white', fontSize:'clamp(26px,7vw,36px)', fontWeight:900, letterSpacing:'-0.02em', marginBottom:14, fontFamily:'var(--font-display)' }}>
              Rp {result.total.toLocaleString('id-ID')}
            </div>
            <div className="flex-center gap-8">
              {[`+${result.pct}% 🚀`, `+Rp ${(result.profit/1000000).toFixed(1)}Jt`].map(t => (
                <span key={t} style={{ background:'rgba(255,255,255,0.2)', color:'white', borderRadius:50, padding:'6px 14px', fontSize:'clamp(12px,3vw,13px)', fontWeight:800 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  )
}

function SliderInput({ label, value, min, max, step, onChange, format, accent }) {
  const pct = ((value - min) / (max - min)) * 100
  const color = accent ? 'var(--accent)' : 'var(--primary)'
  return (
    <div style={{ marginBottom:18 }}>
      <div className="flex justify-between" style={{ marginBottom:8 }}>
        <span style={{ fontSize:'clamp(12px,3vw,14px)', color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:'clamp(12px,3vw,14px)', fontWeight:800, color }}>{format(value)}</span>
      </div>
      <div style={{ position:'relative', height:6, background:'var(--border)', borderRadius:3 }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct}%`, background:color, borderRadius:3 }}/>
        <input
          type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position:'absolute', inset:0, width:'100%', opacity:0, cursor:'pointer', height:'100%' }}
        />
      </div>
    </div>
  )
}
