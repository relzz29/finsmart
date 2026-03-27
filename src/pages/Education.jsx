import React, { useState, useEffect } from 'react'
import { educationApi } from '../api'
import { mockArticles } from '../api/mockData'
import BottomNav from '../components/BottomNav'

const filters = ['Semua', 'Investasi', 'Tabungan', 'Budgeting', 'Pay Later']

// Extended article content
const articleContent = {
  '1': {
    content: `Memulai investasi tidak harus menunggu punya banyak uang. Dengan Rp 100.000 per bulan saja, kamu sudah bisa mulai membangun kekayaan jangka panjang.

**Kenapa Mulai Sekarang?**
Waktu adalah aset terbesar dalam investasi. Berkat bunga majemuk (compound interest), uang kecil yang diinvestasikan lebih awal bisa tumbuh jauh lebih besar dibanding uang besar yang diinvestasikan terlambat.

**Pilihan Investasi Rp 100rb/Bulan:**

1. **Reksa Dana Pasar Uang** — Risiko rendah, bisa ditarik kapan saja. Cocok untuk pemula.
2. **Reksa Dana Indeks** — Mengikuti pergerakan IHSG, return jangka panjang yang baik.
3. **Emas Digital** — Lindung nilai inflasi, beli mulai 0.01 gram.
4. **Saham Dividen** — Pilih perusahaan besar dengan track record bagus.

**Tips Investasi Rutin:**
• Otomatiskan transfer setiap tanggal gajian
• Jangan lihat portofolio setiap hari
• Pelajari instrumen sebelum menaruh uang lebih besar
• Diversifikasi untuk mengurangi risiko

Ingat: investasi terbaik adalah yang dimulai hari ini!`,
    readTime: 5,
    tags: ['Pemula', 'Reksa Dana', 'Emas', 'Saham']
  },
  '2': {
    content: `Pay Later atau Beli Sekarang Bayar Nanti sudah jadi bagian dari gaya hidup modern. Tapi tahukah kamu risikonya?

**Cara Kerja Pay Later**
Pay Later pada dasarnya adalah hutang jangka pendek. Kamu belanja sekarang, bayar nanti—biasanya dalam 30 hari atau cicilan.

**Bahayanya Jika Tidak Bijak:**

1. **Hutang Menumpuk** — Mudah tergoda beli terus, tagihan menumpuk tanpa disadari
2. **Bunga Tinggi** — Keterlambatan bayar bisa kena bunga 2-3% per bulan (24-36% per tahun!)
3. **FOMO Belanja** — Kemudahan akses mendorong pembelian impulsif
4. **Merusak Skor Kredit** — Gagal bayar berdampak pada riwayat kredit jangka panjang

**Aturan Bijak Pakai Pay Later:**
• Hanya untuk kebutuhan mendesak, bukan keinginan
• Pastikan ada dana untuk melunasinya sebelum jatuh tempo
• Catat semua transaksi pay later
• Matikan fitur jika tidak bisa disiplin
• Jangan lebih dari 10-15% dari penghasilan

Pay Later bukan musuh—tapi butuh disiplin tinggi untuk menggunakannya!`,
    readTime: 4,
    tags: ['Pay Later', 'Hutang', 'Keuangan Sehat']
  },
  '3': {
    content: `Metode 50/30/20 adalah salah satu cara termudah untuk mengatur keuangan pribadi tanpa harus jadi ahli keuangan.

**Apa itu 50/30/20?**
Bagi penghasilanmu menjadi tiga bagian:

**50% — Kebutuhan (Needs)**
Pengeluaran yang wajib dan tidak bisa dihindari:
• Sewa/cicilan rumah atau kos
• Makanan & groceries
• Transportasi
• Tagihan listrik, air, internet
• Cicilan yang sudah ada

**30% — Keinginan (Wants)**
Pengeluaran untuk menikmati hidup:
• Hiburan, nonton, ngopi
• Belanja pakaian, aksesoris
• Makan di restoran
• Liburan & hobi

**20% — Tabungan & Investasi (Savings)**
• Dana darurat (target 3-6x pengeluaran bulanan)
• Investasi jangka panjang
• Pelunasan hutang (selain cicilan wajib)

**Contoh dengan Gaji Rp 5.000.000:**
• Kebutuhan: Rp 2.500.000
• Keinginan: Rp 1.500.000
• Tabungan: Rp 1.000.000

Mulai terapkan minggu ini dan lihat perubahan keuanganmu dalam 3 bulan!`,
    readTime: 7,
    tags: ['Budgeting', '50/30/20', 'Tabungan']
  },
  '4': {
    content: `Menabung Rp 1 juta per bulan bisa terasa mustahil—tapi dengan strategi yang tepat, ini sangat mungkin dilakukan bahkan dengan gaji UMR.

**Strategi Pay Yourself First**
Langsung transfer ke rekening tabungan di hari gajian. Jangan tunggu sisa. Ini prinsip paling penting dalam menabung.

**5 Cara Praktis Nabung Rp 1 Juta/Bulan:**

1. **Tantangan 52 Minggu** — Minggu 1 nabung Rp 10rb, minggu 2 Rp 20rb, dst. Total setahun hampir Rp 14 juta!

2. **Metode Amplop** — Pisahkan uang tunai di amplop berlabel (makan, transport, jajan). Bila amplop habis, stop belanja.

3. **Kurangi 1 Kebiasaan Mahal** — Kopi kafe tiap hari = Rp 2 juta/bulan. Buat sendiri dan hemat Rp 1,5 juta.

4. **Jual Barang Tidak Terpakai** — Baju lama, gadget bekas, buku = tambahan tabungan.

5. **Cari Penghasilan Tambahan** — Freelance, jualan online, ojek online di waktu senggang.

**Rekening Terpisah = Kunci Sukses**
Buka rekening khusus tabungan yang tidak punya kartu ATM. "Out of sight, out of mind."

Konsistensi lebih penting dari jumlah. Mulai dari Rp 100rb pun tidak apa-apa!`,
    readTime: 6,
    tags: ['Tabungan', 'Tips', 'Disiplin Keuangan']
  },
  '5': {
    content: `Reksa dana vs saham — pertanyaan yang sering ditanyakan investor pemula. Mari kita bedah perbedaannya!

**Reksa Dana: Investasi Kolektif**
Uangmu digabung dengan investor lain, lalu dikelola manajer investasi profesional.

✅ **Keuntungan Reksa Dana:**
• Diversifikasi otomatis (risiko tersebar)
• Tidak perlu analisis mendalam
• Modal kecil (mulai Rp 10.000)
• Cocok untuk pemula
• Ada manajer investasi yang urus

❌ **Kekurangan Reksa Dana:**
• Ada biaya pengelolaan (expense ratio)
• Return biasanya lebih rendah dari saham langsung
• Tidak bisa kontrol portofolio sepenuhnya

**Saham: Kepemilikan Langsung**
Kamu langsung membeli sebagian kepemilikan perusahaan.

✅ **Keuntungan Saham:**
• Potensi return lebih tinggi
• Dapat dividen langsung
• Kendali penuh atas portofolio
• Transparan—bisa analisis sendiri

❌ **Kekurangan Saham:**
• Butuh pengetahuan lebih dalam
• Risiko lebih tinggi
• Perlu waktu untuk monitoring
• Butuh modal lebih besar untuk diversifikasi

**Mana yang Lebih Baik?**
Tidak ada jawaban mutlak. Kombinasi keduanya adalah strategi terbaik!
• Pemula → Mulai dengan reksa dana
• Sudah berpengalaman → Tambahkan saham
• Dana darurat → Jangan diinvestasikan

Kunci terpenting: mulai lebih awal dan konsisten!`,
    readTime: 8,
    tags: ['Investasi', 'Reksa Dana', 'Saham', 'Perbandingan']
  }
}

export default function Education() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Semua')
  const [search, setSearch] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    educationApi.getArticles()
      .then(d => setArticles(d.articles || []))
      .catch(() => setArticles(mockArticles))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter(a => {
    const mF = filter === 'Semua' || a.category.toLowerCase().includes(filter.toLowerCase())
    const mS = !search || a.title.toLowerCase().includes(search.toLowerCase())
    return mF && mS
  })

  return (
    <div className="app-shell">
      <div className="page">

        <div style={{ padding:'clamp(40px,8vw,52px) var(--page-padding) 16px' }}>
          <h1 className="page-title">Edukasi 🧠</h1>
          <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:4 }}>Tingkatkan literasi keuanganmu</p>
        </div>

        {/* Search */}
        <div style={{ padding:'0 var(--page-padding) 12px' }}>
          <input
            className="input-field"
            placeholder="🔍 Cari artikel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background:'white' }}
          />
        </div>

        {/* Filter */}
        <div className="chip-row" style={{ padding:'0 var(--page-padding) 16px' }}>
          {filters.map(f => (
            <button key={f} className={`chip ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Articles */}
        <div style={{ padding:'0 var(--page-padding)' }}>
          {loading
            ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height:88, marginBottom:12, borderRadius:'var(--radius)' }}/>)
            : filtered.length === 0
              ? <div className="empty-state"><div className="emoji">📭</div><p style={{ fontWeight:700 }}>Artikel tidak ditemukan</p></div>
              : filtered.map(a => <ArticleCard key={a.id} article={a} onOpen={() => setSelectedArticle(a)}/>)
          }
        </div>
        <div style={{ height:20 }}/>
      </div>
      <BottomNav/>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div style={{ position:'fixed', inset:0, background:'white', zIndex:1000, display:'flex', flexDirection:'column', animation:'fadeIn 0.2s ease', maxWidth:'var(--shell-width)', margin:'0 auto' }}>
          {/* Header */}
          <div style={{ padding:'20px var(--page-padding) 16px', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <button onClick={() => setSelectedArticle(null)} style={{ background:'var(--border-light)', border:'none', borderRadius:'50%', width:40, height:40, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              ‹
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--primary)', letterSpacing:'0.06em', marginBottom:2 }}>{selectedArticle.category}</div>
              <div style={{ fontWeight:800, fontSize:14, color:'var(--text)', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedArticle.title}</div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={{ flex:1, overflowY:'auto', padding:'0 var(--page-padding) 40px' }}>

            {/* Hero */}
            <div style={{ margin:'20px 0', background: selectedArticle.bg || 'var(--primary-xlight)', borderRadius:'var(--radius)', padding:'28px 24px', display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:52 }}>{selectedArticle.image}</span>
              <div>
                <h1 style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--text)', lineHeight:1.3, marginBottom:8 }}>{selectedArticle.title}</h1>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(124,58,237,0.12)', color:'var(--primary)', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:20 }}>
                    ⏱ {selectedArticle.readTime} menit baca
                  </span>
                  <span style={{ background:'rgba(0,0,0,0.06)', color:'var(--text-muted)', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                    {selectedArticle.daysAgo} hari lalu
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {articleContent[selectedArticle.id]?.tags && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:20 }}>
                {articleContent[selectedArticle.id].tags.map(tag => (
                  <span key={tag} style={{ background:'var(--border-light)', color:'var(--text-muted)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20 }}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Article Body */}
            <div style={{ lineHeight:1.8, fontSize:14, color:'var(--text)' }}>
              {(articleContent[selectedArticle.id]?.content || `Artikel ini membahas tentang ${selectedArticle.title.toLowerCase()}. Dengan memahami konsep ini, kamu bisa mengelola keuangan dengan lebih cerdas dan mencapai tujuan finansialmu lebih cepat.\n\nTerus pelajari literasi keuangan untuk masa depan yang lebih cerah! 💪`)
                .split('\n\n')
                .map((paragraph, i) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    const text = paragraph.slice(2, -2)
                    return <h3 key={i} style={{ fontWeight:900, fontSize:16, fontFamily:'var(--font-display)', marginTop:24, marginBottom:8, color:'var(--text)' }}>{text}</h3>
                  }
                  // Render bold inline text
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
                  return (
                    <p key={i} style={{ marginBottom:14 }}>
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2,-2)}</strong>
                        }
                        // Handle bullet points
                        if (part.includes('\n•')) {
                          return part.split('\n').map((line, k) => {
                            if (line.startsWith('•')) {
                              return <div key={k} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'var(--primary)', flexShrink:0 }}>•</span><span>{line.slice(1).trim()}</span></div>
                            }
                            if (line.match(/^\d+\./)) {
                              return <div key={k} style={{ display:'flex', gap:8, marginBottom:8 }}><span style={{ color:'var(--primary)', fontWeight:800, flexShrink:0 }}>{line.match(/^\d+/)[0]}.</span><span>{line.replace(/^\d+\./, '').trim()}</span></div>
                            }
                            return line ? <span key={k}>{line}{k < part.split('\n').length - 1 ? '\n' : ''}</span> : null
                          })
                        }
                        return <span key={j}>{part}</span>
                      })}
                    </p>
                  )
                })}
            </div>

            {/* Share / Bookmark */}
            <div style={{ display:'flex', gap:10, marginTop:28 }}>
              <button
                onClick={() => { navigator.share ? navigator.share({ title: selectedArticle.title, text: 'Baca artikel keuangan ini!' }) : navigator.clipboard?.writeText(window.location.href).then(() => alert('Link disalin!')) }}
                style={{ flex:1, padding:14, background:'var(--border-light)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}
              >
                📤 Bagikan
              </button>
              <button
                onClick={() => alert('Artikel disimpan! ✅')}
                style={{ flex:1, padding:14, background:'var(--primary-xlight)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', fontWeight:700, fontSize:14, color:'var(--primary)', display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}
              >
                🔖 Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article, onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{ display:'flex', gap:14, padding:'clamp(12px,3vw,16px)', background:'white', borderRadius:'var(--radius)', marginBottom:12, border:'1px solid var(--border-light)', cursor:'pointer', boxShadow:'var(--shadow-sm)', transition:'box-shadow 0.2s', WebkitTapHighlightColor:'transparent' }}
    >
      <div style={{ width:'clamp(52px,14vw,64px)', height:'clamp(52px,14vw,64px)', borderRadius:12, background: article.bg || 'var(--primary-xlight)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(24px,6vw,30px)', flexShrink:0 }}>
        {article.image}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'var(--primary)', letterSpacing:'0.06em', marginBottom:4 }}>{article.category}</div>
        <div style={{ fontWeight:700, fontSize:'clamp(13px,3.5vw,14px)', lineHeight:1.35, marginBottom:5 }}>{article.title}</div>
        <div style={{ color:'var(--text-muted)', fontSize:12, display:'flex', alignItems:'center', gap:8 }}>
          <span>⏱ {article.readTime} mnt</span>
          <span>·</span>
          <span>{article.daysAgo} hari lalu</span>
          <span style={{ marginLeft:'auto', color:'var(--primary)', fontWeight:700 }}>Baca →</span>
        </div>
      </div>
    </div>
  )
}
