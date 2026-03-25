-- ============================================================
--  Finsmart Database Setup
--  Jalankan file ini di phpMyAdmin (XAMPP)
--  Menu: Import → pilih file ini → klik Go
-- ============================================================

CREATE DATABASE IF NOT EXISTS finsmart_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finsmart_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  avatar      VARCHAR(255)  DEFAULT NULL,
  role        ENUM('user','admin') DEFAULT 'user',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
  id          VARCHAR(36)   PRIMARY KEY,
  user_id     INT           NOT NULL,
  title       VARCHAR(150)  NOT NULL,
  category    VARCHAR(100)  NOT NULL,
  amount      DECIMAL(15,2) NOT NULL,
  type        ENUM('masuk','keluar') NOT NULL,
  icon        VARCHAR(10)   DEFAULT '💰',
  date        DATETIME      DEFAULT CURRENT_TIMESTAMP,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel budgets
CREATE TABLE IF NOT EXISTS budgets (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT           NOT NULL,
  month         VARCHAR(20)   NOT NULL,
  total_income  DECIMAL(15,2) DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_month (user_id, month),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel budget_categories
CREATE TABLE IF NOT EXISTS budget_categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  budget_id   INT           NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  percentage  INT           DEFAULT 0,
  used        DECIMAL(15,2) DEFAULT 0,
  total       DECIMAL(15,2) DEFAULT 0,
  color       VARCHAR(20)   DEFAULT '#7C3AED',
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel articles
CREATE TABLE IF NOT EXISTS articles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  content     TEXT,
  category    VARCHAR(100)  NOT NULL,
  read_time   INT           DEFAULT 5,
  image       VARCHAR(10)   DEFAULT '📄',
  bg_color    VARCHAR(20)   DEFAULT '#EDE9FE',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel notifications
CREATE TABLE IF NOT EXISTS notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT     NOT NULL,
  type        VARCHAR(50)  DEFAULT 'info',
  title       VARCHAR(150) NOT NULL,
  body        TEXT,
  is_read     TINYINT(1)   DEFAULT 0,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel ratings
CREATE TABLE IF NOT EXISTS ratings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT  NOT NULL,
  score       INT  NOT NULL,
  comment     TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Artikel default
INSERT INTO articles (title, category, read_time, image, bg_color) VALUES
('Mulai Investasi Rp 100rb/Bulan',             'INVESTASI', 5, '📈', '#EDE9FE'),
('Bahaya Paylater untuk Gaya Hidup',            'PAY LATER', 4, '⚠️', '#FEF3C7'),
('Metode 50/30/20 untuk Pemula',                'BUDGETING', 7, '💡', '#ECFDF5'),
('Cara Nabung Rp 1 Juta per Bulan',             'TABUNGAN',  6, '🏦', '#EFF6FF'),
('Reksa Dana vs Saham: Mana Lebih Baik?',       'INVESTASI', 8, '📊', '#EDE9FE'),
('Tips Hemat Belanja Bulanan',                  'BUDGETING', 5, '🛒', '#ECFDF5'),
('Memahami Dana Darurat dan Cara Menabungnya',  'TABUNGAN',  6, '🆘', '#FEF3C7');

-- ============================================================
--  Selesai! Database finsmart_db siap digunakan.
-- ============================================================
