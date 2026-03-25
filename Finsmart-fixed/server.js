import express      from 'express'
import cors         from 'cors'
import dotenv       from 'dotenv'
import helmet       from 'helmet'
import rateLimit    from 'express-rate-limit'
dotenv.config()

import { initDB }        from './config/db.js'
import authRoutes         from './routes/auth.js'
import transactionRoutes  from './routes/transactions.js'
import budgetRoutes       from './routes/budgets.js'
import articleRoutes      from './routes/articles.js'
import dashboardRoutes    from './routes/dashboard.js'
import notifRoutes        from './routes/notifications.js'
import ratingRoutes       from './routes/ratings.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security headers ───────────────────────────────────────────────
app.use(helmet())

// ── CORS ───────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// ── Global rate limiter — 200 req / 15 menit per IP ──────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan, coba lagi sebentar.' },
})
app.use(globalLimiter)

// ── Routes ──────────────────────────────────────────────────────────
app.use('/v1/auth',          authRoutes)
app.use('/v1/transactions',  transactionRoutes)
app.use('/v1/budgets',       budgetRoutes)
app.use('/v1/articles',      articleRoutes)
app.use('/v1/dashboard',     dashboardRoutes)
app.use('/v1/notifications', notifRoutes)
app.use('/v1/ratings',       ratingRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🚀 Finsmart API berjalan!', version: 'v1' })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} tidak ditemukan.` })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Terjadi kesalahan server.' })
})

async function start() {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`\n🚀 Finsmart API berjalan di http://localhost:${PORT}`)
      console.log(`📦 Database  : ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`)
      console.log(`🌐 CORS      : ${process.env.CLIENT_URL}`)
    })
  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err.message)
    process.exit(1)
  }
}

start()