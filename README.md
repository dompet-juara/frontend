# Dompet Juara

Dompet Juara adalah aplikasi manajemen keuangan berbasis web yang dibangun menggunakan React, TypeScript, dan Vite. Aplikasi ini membantu pengguna dalam mencatat pemasukan, pengeluaran, melihat dashboard keuangan, mendapatkan rekomendasi AI, serta fitur chatbot untuk konsultasi keuangan.

## Fitur Utama

- **Autentikasi**: Login, register, dan mode guest.
- **Dashboard**: Ringkasan keuangan pengguna.
- **Pemasukan & Pengeluaran**: Catat dan kelola transaksi keuangan.
- **AI Recommender**: Rekomendasi keuangan berbasis AI.
- **Profil Pengguna**: Kelola data pribadi.
- **Chatbot**: Bantuan dan konsultasi keuangan otomatis.

## Struktur Direktori

```
src/
  App.tsx                // Entry point aplikasi React
  api/                   // API service untuk komunikasi backend
  components/            // Komponen UI reusable (Chatbot, Sidebar, dsb)
  contexts/              // Context API (misal: AuthContext)
  hooks/                 // Custom React hooks
  layouts/               // Layout utama aplikasi
  pages/                 // Halaman utama (Login, Dashboard, Income, Outcome, dsb)
  presenters/            // Presentational logic
  utils/                 // Utility functions
  assets/                // Asset gambar/icon
```

## Instalasi

1. **Clone repository**
   ```sh
   git clone https://github.com/username/dompet-juara-fe.git
   cd dompet-juara-fe
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Jalankan aplikasi**
   ```sh
   npm run dev
   ```
   Aplikasi akan berjalan di [http://localhost:5173](http://localhost:5173).

## Konfigurasi ESLint

Proyek ini sudah dilengkapi konfigurasi ESLint untuk menjaga kualitas kode. Lihat bagian `README.md` untuk detail ekspansi konfigurasi linting.

## Kontribusi

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur-anda`)
3. Commit perubahan (`git commit -am 'Tambah fitur'`)
4. Push ke branch (`git push origin fitur-anda`)
5. Buat Pull Request

## Lisensi

MIT License

---

> Dompet Juara - Manajemen keuangan cerdas untuk semua.