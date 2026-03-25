import express  from 'express'
import bcrypt   from 'bcryptjs'
import jwt      from 'jsonwebtoken'
import { pool } from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'
import { authLimiter }   from '../middleware/rateLimiter.js'

const router = express.Router()

// ── Validasi ────────────────────────────────────────────────────────
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STRONG_PW  = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/   // min 8 char, huruf + angka

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ─────────────────────────────────────────────────────────────────────
// POST /auth/register  (user biasa)
// ─────────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password)
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' })
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ message: 'Format email tidak valid.' })
  if (!STRONG_PW.test(password))
    return res.status(400).json({ message: 'Password minimal 8 karakter, mengandung huruf dan angka.' })

  try {
    const [exist] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
    if (exist.length > 0) return res.status(409).json({ message: 'Email sudah terdaftar.' })

    const hashed = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashed, 'user']
    )
    const user  = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: 'user' }
    const token = signToken(user)

    const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    const [bResult] = await pool.query(
      'INSERT INTO budgets (user_id, month, total_income) VALUES (?, ?, ?)', [user.id, monthLabel, 0]
    )
    await pool.query(
      `INSERT INTO budget_categories (budget_id, name, percentage, color) VALUES
       (?,  'Kebutuhan', 50, '#7C3AED'),
       (?,  'Keinginan', 30, '#F59E0B'),
       (?,  'Tabungan',  20, '#10B981')`,
      [bResult.insertId, bResult.insertId, bResult.insertId]
    )
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// ─────────────────────────────────────────────────────────────────────
// POST /auth/admin-register  (admin — butuh invite code)
// ─────────────────────────────────────────────────────────────────────
router.post('/admin-register', authLimiter, async (req, res) => {
  const { name, email, password, inviteCode } = req.body
  if (!name?.trim() || !email?.trim() || !password || !inviteCode)
    return res.status(400).json({ message: 'Semua field wajib diisi.' })
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ message: 'Format email tidak valid.' })
  if (!STRONG_PW.test(password))
    return res.status(400).json({ message: 'Password minimal 8 karakter, mengandung huruf dan angka.' })

  // Validasi invite code
  const VALID_CODE = process.env.ADMIN_INVITE_CODE
  if (!VALID_CODE || inviteCode !== VALID_CODE)
    return res.status(403).json({ message: 'Kode undangan admin tidak valid.' })

  try {
    const [exist] = await pool.query('SELECT id, role FROM users WHERE email = ?', [email.toLowerCase()])
    if (exist.length > 0)
      return res.status(409).json({ message: 'Email sudah terdaftar.' })

    const hashed = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashed, 'admin']
    )
    const user  = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: 'admin' }
    const token = signToken(user)
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Admin register error:', err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// ─────────────────────────────────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body
  if (!email?.trim() || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi.' })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    // Pesan error generik — jangan bocorkan apakah email ada atau tidak
    if (rows.length === 0) {
      await bcrypt.hash('dummy_to_prevent_timing_attack', 12)
      return res.status(401).json({ message: 'Email atau password salah.' })
    }
    const user  = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Email atau password salah.' })
    const token = signToken(user)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// POST /auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logout berhasil.' })
})

// GET /auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, avatar, role, created_at FROM users WHERE id = ?', [req.user.id]
    )
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan.' })
    const [txCount]  = await pool.query('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', [req.user.id])
    const [artCount] = await pool.query('SELECT COUNT(*) as count FROM articles')
    const user = rows[0]
    user.stats = { transactions: txCount[0].count, articles: artCount[0].count }
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// PUT /auth/me
router.put('/me', authMiddleware, async (req, res) => {
  const { name, avatar, password, newPassword } = req.body
  try {
    if (password && newPassword) {
      if (!STRONG_PW.test(newPassword))
        return res.status(400).json({ message: 'Password baru minimal 8 karakter, mengandung huruf dan angka.' })
      const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id])
      const match  = await bcrypt.compare(password, rows[0].password)
      if (!match) return res.status(401).json({ message: 'Password lama salah.' })
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 12), req.user.id])
      return res.json({ message: 'Password berhasil diperbarui.' })
    }
    const updates = [], values = []
    if (name?.trim())   { updates.push('name = ?');   values.push(name.trim()) }
    if (avatar) { updates.push('avatar = ?'); values.push(avatar) }
    if (!updates.length) return res.status(400).json({ message: 'Tidak ada data yang diubah.' })
    values.push(req.user.id)
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)
    const [rows] = await pool.query('SELECT id, name, email, avatar, role FROM users WHERE id = ?', [req.user.id])
    res.json({ user: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// GET /auth/admin/users  (admin only)
router.get('/admin/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Akses ditolak.' })
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              COUNT(t.id) AS transactions
       FROM users u
       LEFT JOIN transactions t ON t.user_id = u.id
       WHERE u.role = 'user'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    )
    res.json({ users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

export default router
