# 🎓 RAPIIN - Sistem Otomasi Format Dokumen Skripsi Berbasis AI

> **Rancang Bangun Sistem Berbasis Web untuk Otomatisasi Format Dokumen Skripsi Menggunakan Large Language Model**

## 📖 Gambaran Umum

RAPIIN adalah sistem web fullstack yang menggunakan **Artificial Intelligence (Large Language Model)** untuk otomatis:

1. ✅ Membaca panduan penulisan skripsi dari PDF
2. ✅ Mengekstrak aturan formatting (font, margin, spasi, dll)
3. ✅ Menerapkan aturan tersebut ke dokumen skripsi secara otomatis
4. ✅ Menghasilkan dokumen terformat yang siap disubmit

### Teknologi Utama

- **Frontend**: Nuxt.js 4 + Vue 3 + TailwindCSS
- **Backend**: Nuxt Server API (fullstack)
- **AI**: OpenAI GPT-4o Mini
- **File Processing**: pdf-parse, mammoth, docx

---

## 🚀 Memulai

### Prerequisites

- Node.js >= 18.0
- npm atau yarn
- OpenAI API Key (dapatkan di https://platform.openai.com/api-keys)

### Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Environment Variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` dan masukkan OpenAI API Key:

   ```
   OPENAI_API_KEY=sk_your_actual_key_here
   NUXT_PUBLIC_OPENAI_API_KEY=sk_your_actual_key_here
   ```

3. **Jalankan Development Server**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

---

## 📋 Cara Penggunaan

### Workflow Sistem

```
┌─────────────────────────────────────────────────────────┐
│ 1. User upload panduan.pdf + skripsi.docx              │
├─────────────────────────────────────────────────────────┤
│ 2. Backend: Extract text dari kedua file               │
├─────────────────────────────────────────────────────────┤
│ 3. LLM (OpenAI): Analisis panduan, ekstrak rules       │
│    Output: JSON dengan aturan formatting               │
├─────────────────────────────────────────────────────────┤
│ 4. Formatter Engine: Apply rules ke dokumen            │
├─────────────────────────────────────────────────────────┤
│ 5. Generate DOCX baru dengan formatting                │
├─────────────────────────────────────────────────────────┤
│ 6. User download file terformat                        │
└─────────────────────────────────────────────────────────┘
```

### Langkah-Langkah Penggunaan

1. **Buka aplikasi** di `http://localhost:3000`
2. **Upload Panduan Skripsi** (PDF)
3. **Upload Dokumen Skripsi** (DOCX)
4. **Klik "Proses Sekarang"**
5. **Lihat hasil** dan download

---

## 🏗️ Arsitektur Sistem

### Folder Structure

```
RAPIIN/
├── app/
│   ├── components/          # Vue components
│   ├── pages/               # Nuxt pages
│   ├── server/api/          # API endpoints
│   └── utils/               # Utility functions
├── assets/css/              # Styling
├── .env.local               # Environment variables
└── README.md                # Documentation
```

---

## 🛠️ Build & Production

```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview

# Generate static site
npm run generate
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
