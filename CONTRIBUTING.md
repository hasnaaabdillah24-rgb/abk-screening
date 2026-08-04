# 🤝 Contributing to ABK Screening

Terima kasih telah tertarik untuk berkontribusi pada proyek ABK Screening! Panduan ini menjelaskan bagaimana Anda dapat membantu mengembangkan aplikasi ini.

## 📖 Code of Conduct

- Hormati pendapat dan perspektif orang lain
- Berkomitmen pada kualitas kode yang baik
- Bantu membuat proyek ini lebih baik
- Berkomunikasi dengan jelas dan profesional

## 🐛 Melaporkan Bug

### Sebelum Melaporkan

1. Periksa [Issues](https://github.com/hasnaaabdillah24-rgb/abk-screening/issues) untuk memastikan bug belum dilaporkan
2. Coba reproduce bug di environment yang clean
3. Kumpulkan informasi sebanyak mungkin

### Melaporkan Bug

Buat issue dengan template berikut:

```markdown
## Deskripsi
[Deskripsi singkat bug]

## Langkah Reproduksi
1. [Langkah pertama]
2. [Langkah kedua]
3. ...

## Hasil yang Diharapkan
[Apa yang seharusnya terjadi]

## Hasil Aktual
[Apa yang sebenarnya terjadi]

## Environment
- OS: [Windows/Mac/Linux]
- Node.js Version: [x.x.x]
- Browser: [Chrome/Firefox/Safari]

## Screenshots
[Jika ada, lampirkan screenshot]
```

## 💡 Mengusulkan Fitur

### Sebelum Mengusulkan

1. Periksa [Issues](https://github.com/hasnaaabdillah24-rgb/abk-screening/issues) untuk fitur serupa
2. Pertimbangkan apakah fitur ini sesuai dengan tujuan proyek
3. Pikirkan implementasi dan dampaknya

### Mengusulkan Fitur

Buat issue dengan template berikut:

```markdown
## Deskripsi Fitur
[Deskripsi singkat fitur yang diusulkan]

## Masalah yang Dipecahkan
[Masalah apa yang akan dipecahkan]

## Solusi yang Diusulkan
[Bagaimana fitur ini akan bekerja]

## Alternatif yang Dipertimbangkan
[Solusi alternatif lainnya]

## Konteks Tambahan
[Informasi tambahan apa pun]
```

## 🔧 Pull Request Process

### 1. Fork Repository

```bash
git clone https://github.com/your-username/abk-screening.git
cd abk-screening
git remote add upstream https://github.com/hasnaaabdillah24-rgb/abk-screening.git
```

### 2. Buat Branch Feature

```bash
git checkout -b feature/deskripsi-fitur
# atau
git checkout -b bugfix/deskripsi-bug
```

### 3. Buat Perubahan

- Ikuti [Development Guide](./DEVELOPMENT.md)
- Tulis kode yang clean dan readable
- Add comments untuk kode yang kompleks
- Update tests jika ada

### 4. Commit Changes

```bash
git add .
git commit -m "feat: deskripsi perubahan"
# atau
git commit -m "fix: deskripsi bug fix"
```

### 5. Push ke Fork

```bash
git push origin feature/deskripsi-fitur
```

### 6. Buat Pull Request

1. Buka [Pull Requests](https://github.com/hasnaaabdillah24-rgb/abk-screening/pulls)
2. Klik "New Pull Request"
3. Select branch Anda
4. Isi PR template:

```markdown
## Deskripsi
[Jelaskan perubahan Anda]

## Tipe Perubahan
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[Jelaskan bagaimana Anda menguji perubahan]

## Checklist
- [ ] Kode saya mengikuti style guide
- [ ] Saya telah melakukan self-review
- [ ] Komentar saya jelas dan berguna
- [ ] Saya tidak membuat perubahan yang tidak perlu
- [ ] Perubahan saya menghasilkan warning baru
- [ ] Tests pass locally

## Related Issues
Closes #[issue number]
```

## 📝 Commit Message Guidelines

Gunakan format berikut untuk commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: Feature baru
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/dependency changes

### Scope
- `auth`: Authentication
- `students`: Student management
- `screening`: Screening logic
- `results`: Results generation
- `frontend`: Frontend changes
- `backend`: Backend changes
- `db`: Database changes

### Contoh

```
feat(screening): add new ADHD questions

Added 5 new questions to improve ADHD detection accuracy.

Closes #42
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

Aim untuk minimal 80% code coverage.

## 📚 Documentation

Jika Anda menambah fitur baru:

1. Update [API.md](./API.md) dengan endpoint baru
2. Update [DEVELOPMENT.md](./DEVELOPMENT.md) jika ada perubahan struktur
3. Update [README.md](./README.md) jika perlu
4. Add comments dalam kode untuk logic yang kompleks

## 🎯 Areas untuk Kontribusi

### High Priority
- [ ] Unit tests untuk backend
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation improvements

### Medium Priority
- [ ] UI/UX improvements
- [ ] Additional screening categories
- [ ] Enhanced analytics
- [ ] Mobile responsiveness

### Low Priority
- [ ] Code refactoring
- [ ] Minor feature requests
- [ ] Documentation typos

## 💬 Getting Help

- 📖 Baca [Development Guide](./DEVELOPMENT.md)
- 📝 Lihat [API Documentation](./API.md)
- 💻 Buka [Issues](https://github.com/hasnaaabdillah24-rgb/abk-screening/issues) untuk diskusi
- 📧 Hubungi maintainers jika ada pertanyaan

## 👥 Pengakuan Kontribusi

Kontributor yang aktif akan diakui di:
- README.md
- Release notes
- GitHub contributors page

## 📋 Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License.

---

**Terima kasih telah berkontribusi pada ABK Screening! 🙏**