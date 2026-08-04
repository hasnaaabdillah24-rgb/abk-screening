# ABK Screening - Aplikasi Identifikasi Anak Berkebutuhan Khusus

Aplikasi web komprehensif untuk membantu guru dalam melakukan skrining awal Anak Berkebutuhan Khusus (ABK) dengan sistem pertanyaan adaptif berbasis AI.

## 🎯 Tujuan

Aplikasi ini dirancang untuk:
- Menganalisis hasil observasi anak secara terstruktur
- Memberikan indikasi awal tentang kemungkinan kebutuhan khusus
- Menghasilkan laporan profesional untuk guru dan orang tua
- Merekomendasikan konsultasi profesional jika diperlukan

## 📋 Kategori Skrining

1. **ADHD** (Attention-Deficit/Hyperactivity Disorder)
2. **ASD** (Autism Spectrum Disorder)
3. **Disleksia**
4. **Gangguan Perilaku Emosional**

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **PDF Generator:** PDFKit / ReportLab

### Frontend
- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Redux
- **HTTP Client:** Axios

## 📦 Instalasi

### Prasyarat
- Node.js v16+
- PostgreSQL 12+
- npm atau yarn

### Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm start
```

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Fitur Keamanan

- Enkripsi password menggunakan bcrypt
- JWT authentication untuk API
- Role-based access control (RBAC)
- HTTPS support
- Data encryption di database
- Input validation dan sanitization

## 📊 Fitur Utama

- ✅ Sistem login multi-user
- ✅ Pertanyaan adaptif berbasis jawaban sebelumnya
- ✅ Analisis real-time hasil observasi
- ✅ Penyimpanan data terenkripsi
- ✅ Export laporan ke PDF
- ✅ Dashboard untuk guru
- ✅ Riwayat skrining siswa
- ✅ Rekomendasi tindak lanjut

## 📝 Lisensi

MIT

## 👥 Kontribusi

Silakan berkontribusi dengan membuat pull request.

---

**Disclaimer:** Aplikasi ini hanya untuk skrining awal dan bukan merupakan diagnosis medis. Hasil skrining harus ditindaklanjuti dengan konsultasi profesional (psikolog, dokter, atau spesialis pendidikan khusus).
