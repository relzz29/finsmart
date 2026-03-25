# Finsmart — Fullstack (Front-end + Back-end)

Aplikasi keuangan pribadi berbasis React + Express.js + MySQL (XAMPP).

---

## Struktur Folder

```
Finsmart/
├── src/                        # Front-end React (Vite)
│   ├── api/index.js            # Axios HTTP client
│   ├── pages/                  # Halaman aplikasi
│   ├── components/             # Komponen UI
│   └── hooks/                  # Custom hooks
├── config/
│   └── db.js                   # Koneksi MySQL + auto-create tabel
├── middleware/
│   └── auth.js                 # JWT middleware
├── routes/
│   ├── auth.js                 # Register, Login, Profile
│   ├── transactions.js         # CRUD Transaksi
│   ├── budgets.js              # Budget 50/30/20
│   ├── articles.js             # Artikel edukasi
│   ├── dashboard.js            # Summary & chart data
│   ├── notifications.js        # Notifikasi
│   └── ratings.js              # Rating aplikasi
├── server.js                   # Entry point Express
├── finsmart_db.sql             # Import ke phpMyAdmin
├── .env                        # Konfigurasi (DB, JWT, port)
├── vite.config.js              # Konfigurasi Vite
└── package.json                # Dependencies gabungan
```

---

## Setup & Cara Menjalankan

### 1. Buat Database di phpMyAdmin (XAMPP)

1. Buka **XAMPP Control Panel** → Start **Apache** dan **MySQL**
2. Buka `http://localhost/phpmyadmin`
3. Klik tab **Import** → pilih file `finsmart_db.sql` → klik **Go**

### 2. Install Dependencies

```bash
npm install
```

### 3. Sesuaikan .env (jika perlu)

Buka file `.env`:
- `DB_PASSWORD` — isi jika MySQL XAMPP-mu punya password (default kosong)
- `JWT_SECRET` — ganti dengan string acak yang panjang untuk keamanan

### 4. Jalankan Aplikasi

```bash
# Jalankan front-end dan back-end sekaligus
npm run dev
```

| Service   | URL                        |
|-----------|----------------------------|
| Front-end | http://localhost:5173       |
| Back-end  | http://localhost:5000       |
| phpMyAdmin| http://localhost/phpmyadmin |

---

## Troubleshooting

**Error: ER_ACCESS_DENIED_ERROR**
→ Cek `DB_USER` dan `DB_PASSWORD` di `.env`

**Error: ECONNREFUSED**
→ Pastikan MySQL di XAMPP sudah di-Start

**CORS error di browser**
→ Pastikan `CLIENT_URL` di `.env` sama dengan URL Vite (default: `http://localhost:5173`)

**Port 5000 sudah dipakai**
→ Ganti `PORT=5001` di `.env` dan `VITE_API_URL=http://localhost:5001/v1`
