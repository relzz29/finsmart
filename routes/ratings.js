import express  from 'express'
import { pool } from '../config/db.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  const { score, comment } = req.body
  if (!score || score < 1 || score > 5) return res.status(400).json({ message: 'Score harus antara 1-5.' })
  try {
    const [result] = await pool.query('INSERT INTO ratings (user_id, score, comment) VALUES (?,?,?)', [req.user.id, score, comment || ''])
    res.status(201).json({ id: result.insertId, score, comment })
  } catch (err) { res.status(500).json({ message: 'Gagal menyimpan rating.' }) }
})

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT r.*, u.name, u.email FROM ratings r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC`)
    const [avg]  = await pool.query('SELECT AVG(score) as average FROM ratings')
    res.json({ ratings: rows, average: parseFloat(avg[0].average || 0).toFixed(1) })
  } catch (err) { res.status(500).json({ message: 'Terjadi kesalahan server.' }) }
})

export default router
