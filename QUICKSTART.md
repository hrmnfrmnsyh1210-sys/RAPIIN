# 🎉 RAPIIN - Setup & Quick Start Guide

## ✅ Project Ready!

Sistem **RAPIIN** (Rancang Bangun Sistem Otomasi Format Dokumen Skripsi) telah berhasil di-setup dan siap digunakan!

---

## 🚀 Cara Memulai

### 1. Development Server Sudah Berjalan

**URL**: http://localhost:3000

Dev server otomatis ter-restart saat ada perubahan file (Hot Module Replacement).

### 2. Setup OpenAI API Key (PENTING!)

Sebelum menggunakan aplikasi, setup API key:

1. **Buka file `.env.local`** di root folder
2. **Masukkan OpenAI API Key Anda**:

   ```
   OPENAI_API_KEY=sk_your_actual_key_here
   NUXT_PUBLIC_OPENAI_API_KEY=sk_your_actual_key_here
   ```

3. **Dapatkan API Key**:
   - Buka https://platform.openai.com/api-keys
   - Login atau buat akun
   - Generate new secret key
   - Copy key ke `.env.local`

4. **Restart dev server**:
   ```bash
   # Ctrl+C untuk stop server
   # Jalankan lagi:
   npm run dev
   ```

### 3. Test Aplikasi

1. **Buka http://localhost:3000** di browser
2. **Persiapkan file test**:
   - Panduan format skripsi (PDF) dari universitas/kampus Anda
   - Dokumen skripsi test (DOCX)
3. **Upload kedua file**
4. **Klik "Proses Sekarang"**
5. **Lihat hasil** dan download

---

## 📁 Struktur Project

```
RAPIIN/
├── app/
│   ├── components/
│   │   ├── UploadForm.vue          ← Form upload
│   │   └── ResultPreview.vue       ← Preview hasil
│   ├── pages/
│   │   └── index.vue               ← Main page
│   ├── server/api/
│   │   ├── upload.post.ts          ← Upload handler
│   │   ├── extractRules.post.ts    ← LLM extraction
│   │   └── formatDoc.post.ts       ← Document formatting
│   └── utils/
│       ├── parser.ts               ← PDF/DOCX parsing
│       ├── llm.ts                  ← OpenAI integration
│       ├── formatter.ts            ← Document engine
│       └── types.ts                ← TypeScript types
├── assets/css/
│   └── main.css                    ← Global styles
├── .env.local                      ← Environment (PRIVATE!)
├── .env.example                    ← Template
├── nuxt.config.ts                  ← Nuxt config
├── tailwind.config.ts              ← Tailwind config
└── README.md                        ← Documentation
```

---

## 🛠️ Tech Stack

| Layer        | Technology                      | Purpose              |
| ------------ | ------------------------------- | -------------------- |
| **Frontend** | Nuxt.js 4 + Vue 3 + TailwindCSS | UI/UX                |
| **Backend**  | Nuxt Server Routes (Node.js)    | API endpoints        |
| **AI**       | OpenAI GPT-4o Mini              | Rules extraction     |
| **PDF**      | pdf-parse                       | Read PDF files       |
| **DOCX**     | mammoth + docx                  | Read & generate DOCX |

---

## 🔑 API Endpoints

### 1. POST `/api/extractRules`

Extract aturan formatting dari panduan

**Request**:

```json
{
  "guidelineText": "string dari panduan"
}
```

**Response**:

```json
{
  "success": true,
  "rules": {
    "font": "Times New Roman",
    "size": 12,
    "spacing": 1.5,
    "margin": { "top": 4, "left": 4, "right": 3, "bottom": 3 },
    ...
  }
}
```

### 2. POST `/api/formatDoc`

Format dokumen dengan rules

**Request**:

```json
{
  "thesisText": "string dari dokumen",
  "rules": { FormattingRules }
}
```

**Response**:

```json
{
  "success": true,
  "document": "base64_encoded_docx"
}
```

---

## 📊 Features Saat Ini

✅ Upload panduan PDF  
✅ Upload dokumen DOCX  
✅ Extract rules otomatis dengan AI  
✅ Format dokumen otomatis  
✅ Preview hasil  
✅ Download DOCX terformat  
✅ Beautiful modern UI

---

## 🚧 Features TODO (untuk pengembangan lanjut)

- [ ] Database untuk simpan rules per kampus
- [ ] Batch processing untuk multiple files
- [ ] Caching untuk rules yang sering dipakai
- [ ] History/log untuk setiap processing
- [ ] Settings page untuk custom rules
- [ ] Export/Import rules
- [ ] Support untuk format lain (ODT, RTF)
- [ ] Comparison view (sebelum/sesudah)
- [ ] Real-time preview saat type
- [ ] User accounts & authentication

---

## 📝 Untuk Skripsi

### Bab I - Pendahuluan

**Latar Belakang**:

- Masalah inkonsistensi format skripsi di kampus
- Banyak waktu terbuang untuk formatting manual
- Solusi: Sistem berbasis AI

**Rumusan Masalah**:

1. Bagaimana mengotomatisasi ekstraksi aturan dari panduan?
2. Bagaimana menerapkan rules ke dokumen secara otomatis?
3. Bagaimana membuat sistem yang user-friendly?

### Bab II - Studi Literatur

Topics yang harus di-cover:

1. **Natural Language Processing (NLP)**
   - Definisi dan konsep dasar
   - Machine learning approaches
2. **Large Language Models (LLM)**
   - Transformer architecture
   - Fine-tuning vs Prompt engineering
   - OpenAI GPT models
3. **Document Processing**
   - PDF parsing techniques
   - DOCX format dan manipulation
   - Text extraction dan normalization
4. **Web Development**
   - Nuxt.js framework
   - Server-side rendering
   - API design

### Bab III - Metodologi & Design

- System architecture
- API design documentation
- Database schema (jika ada)
- UI/UX wireframe & design

### Bab IV - Implementasi

- Penjelasan implementasi setiap module
- Code snippets penting
- Integration points
- Error handling strategy

### Bab V - Testing & Evaluasi

- Unit test results
- Integration test results
- Performance metrics
- User testing feedback
- Analisis keberhasilan

### Bab VI - Kesimpulan & Saran

- Pencapaian sistem
- Saran untuk pengembangan lebih lanjut
- Potential improvements

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY tidak ditemukan"

```bash
✓ Cek .env.local exists
✓ Pastikan API key ada dan valid
✓ Restart dev server (Ctrl+C → npm run dev)
```

### Error: "Gagal membaca PDF"

```bash
✓ Pastikan file PDF valid
✓ Coba dengan PDF dari sumber lain
✓ Check console untuk detail error
```

### Port 3000 sudah terpakai

```bash
npm run dev -- -p 3001  # Use different port
```

### CSS tidak loading

```bash
✓ Clear browser cache (Ctrl+Shift+Delete)
✓ Restart dev server
✓ Check network tab di DevTools
```

---

## 📚 Dokumentasi

- **README.md** - Project overview & docs lengkap
- **DEVELOPMENT.md** - Setup & deployment guide
- **nuxt.config.ts** - Konfigurasi project
- **app/utils/types.ts** - Type definitions

---

## 🎯 Next Steps

1. **Setup API Key** → langkah paling penting!
2. **Test dengan file sample** → pastikan semua berfungsi
3. **Customize UI** → sesuaikan dengan branding kampus Anda
4. **Add database** → untuk production use
5. **Deploy** → ke server production

---

## 📞 Support

Jika ada error atau issue:

1. Check console browser (F12)
2. Check terminal output
3. Read error message carefully
4. Check README.md & DEVELOPMENT.md
5. Google/ChatGPT search untuk error message

---

## 🎉 Selesai!

**RAPIIN siap digunakan!**

🚀 Buka http://localhost:3000  
📄 Upload file Anda  
🤖 Biarkan AI bekerja  
✨ Dapatkan dokumen terformat sempurna!

---

**Happy formatting! 🎓**
