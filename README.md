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

```text
frontend-main/
├── src/
│   ├── api/           # Directory for API configurations and functions
│   ├── assets/        # Directory for static assets (images, fonts, etc.)
│   ├── components/    # Reusable React components
│   ├── contexts/      # React Context for state management
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components for page structure
│   ├── pages/         # Main page components
│   ├── presenters/    # Presenter components for presentation logic
│   ├── utils/         # Utility functions and helpers
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   ├── index.css      # Global styling
│   └── vite-env.d.ts  # TypeScript declarations for Vite
│
├── public/            # Directory for public assets
├── index.html         # Main HTML file
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # Main TypeScript configuration
├── tsconfig.app.json  # TypeScript configuration for application
├── tsconfig.node.json # TypeScript configuration for Node
├── package.json       # Dependencies and scripts
├── package-lock.json  # Lock file for dependencies
├── eslint.config.js   # ESLint configuration
├── .gitignore        # Git ignored files
├── README.md         # Project documentation
└── LICENSE           # Project license
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