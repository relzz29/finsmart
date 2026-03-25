import express  from 'express'
import { pool } from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT SUM(CASE WHEN type='masuk' THEN amount ELSE 0 END) AS income,
              SUM(CASE WHEN type='keluar' THEN amount ELSE 0 END) AS expense,
              COUNT(*) AS total_transactions
       FROM transactions WHERE user_id = ?`, [req.user.id]
    )
    const income = parseFloat(rows[0].income || 0), expense = parseFloat(rows[0].expense || 0)
    res.json({ income, expense, balance: income - expense, totalTransactions: rows[0].total_transactions })
  } catch (err) { res.status(500).json({ message: 'Gagal mengambil data dashboard.' }) }
})

router.get('/chart', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DAYNAME(date) AS day_name, DATE(date) AS day_date,
              SUM(CASE WHEN type='keluar' THEN amount ELSE 0 END) AS amount
       FROM transactions
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(date), DAYNAME(date) ORDER BY day_date ASC`, [req.user.id]
    )
    const dayMap = { Monday:'Sen', Tuesday:'Sel', Wednesday:'Rab', Thursday:'Kam', Friday:'Jum', Saturday:'Sab', Sunday:'Min' }
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayEn   = d.toLocaleDateString('en-US', { weekday: 'long' })
      const found   = rows.find(r => String(r.day_date).split('T')[0] === dateStr)
      chartData.push({ day: dayMap[dayEn] || dayEn.slice(0,3), amount: found ? parseFloat(found.amount) : 0 })
    }
    res.json({ chartData })
  } catch (err) { res.status(500).json({ message: 'Gagal mengambil data chart.' }) }
})

export default router
