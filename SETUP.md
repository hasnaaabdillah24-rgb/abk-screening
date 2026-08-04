# 🚀 ABK Screening - Setup & Installation Guide

Panduan lengkap untuk setup dan menjalankan aplikasi ABK Screening secara lokal.

## 📋 Prasyarat

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **npm** atau **yarn** (biasanya included dengan Node.js)

## 🔧 Setup Database PostgreSQL

### 1. Buat Database

```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE abk_screening;

# Keluar
\q
```

### 2. Setup Environment Backend

```bash
cd backend
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=abk_screening
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Instalasi Backend

```bash
cd backend

# Install dependencies
npm install

# Jalankan migrasi database
npm run migrate

# (Optional) Seed database dengan data awal
npm run seed

# Jalankan server
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📦 Instalasi Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan tersedia di `http://localhost:3000`

## ✅ Testing

### 1. Buat Akun Guru

Kunjungi `http://localhost:3000/register` dan buat akun baru:
- Email: `guru@example.com`
- Password: `password123`
- Nama: `Guru Budi`
- Sekolah: `SDN 01 Jakarta`

### 2. Login

Klik "Login" dan masukkan kredensial yang baru dibuat.

### 3. Tambah Siswa

- Pergi ke halaman "Daftar Siswa"
- Klik "+ Tambah Siswa"
- Isi data siswa
- Simpan

### 4. Mulai Screening

- Dari dashboard, pilih siswa
- Klik "Mulai Skrining"
- Pilih kategori skrining (ADHD, ASD, Disleksia, atau Gangguan Perilaku Emosional)
- Jawab semua pertanyaan
- Lihat hasil dan download laporan PDF

## 📁 Struktur Folder

```
abk-screening/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Entry point
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── screenings.js
│   │   │   ├── results.js
│   │   │   └── users.js
│   │   ├── middleware/              # Custom middlewares
│   │   │   └── auth.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── constants.js
│   │   │   └── screeningAnalyzer.js
│   │   └── database/                # Database config & migrations
│   │       ├── db.js
│   │       ├── schema.sql
│   │       ├── migrations.js
│   │       └── seeds.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── store/                   # Zustand stores
│   │   ├── utils/                   # Utilities
│   │   ├── data/                    # Static data
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Registrasi pengguna baru
- `POST /api/v1/auth/login` - Login pengguna

### Students
- `GET /api/v1/students` - Ambil daftar siswa
- `POST /api/v1/students` - Tambah siswa baru
- `PUT /api/v1/students/:id` - Update data siswa
- `DELETE /api/v1/students/:id` - Hapus siswa

### Screening
- `POST /api/v1/screenings/start` - Mulai sesi skrining
- `POST /api/v1/screenings/answer` - Submit jawaban
- `POST /api/v1/screenings/complete/:sessionId` - Selesaikan skrining

### Results
- `GET /api/v1/results/session/:sessionId` - Ambil hasil by session
- `GET /api/v1/results/student/:studentId` - Ambil hasil by student
- `POST /api/v1/results/generate` - Generate hasil baru

### Users
- `GET /api/v1/users/profile` - Ambil profil user

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Pastikan PostgreSQL running
# Linux/Mac:
sudo service postgresql start

# Windows:
# Gunakan PostgreSQL Services dari Control Panel

# Check database connection
psql -U postgres -d abk_screening
```

### Error: "CORS error" atau "connection refused"

```bash
# Pastikan backend server sudah berjalan di port 5000
# dan frontend di port 3000

# Cek di package.json frontend, proxy harus ke:
proxy: 'http://localhost:5000'
```

### Error: "Module not found"

```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Dokumentasi Lanjutan

Untuk informasi lebih detail, lihat:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment ke production
- [API.md](./API.md) - Detail lengkap API endpoints
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guidelines

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.

---

**Happy Screening! 🎓**