# Development & Deployment Guide

## 🎯 Local Development

### Setup Environment

1. **Clone atau download project**

   ```bash
   cd RAPIIN
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup .env.local**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```
   OPENAI_API_KEY=sk_your_actual_key
   NUXT_PUBLIC_OPENAI_API_KEY=sk_your_actual_key
   ```

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000

---

## 🚀 Production Deployment

### Build

```bash
# Generate optimized production build
npm run build

# Preview hasil build
npm run preview
```

### Deploy Options

#### A. Vercel (Recommended)

```bash
# Install vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### B. Netlify

```bash
# Build
npm run build

# Drag & drop .output/public folder ke Netlify
```

#### C. Self-hosted (VPS/Heroku)

1. **Setup environment variables di server**
   - Set OPENAI_API_KEY
   - Set NODE_ENV=production

2. **Deploy aplikasi**

   ```bash
   npm run build
   node .output/server/index.mjs
   ```

3. **Setup reverse proxy (nginx)**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

---

## 🔧 Troubleshooting

### Error: "OPENAI_API_KEY not found"

✅ **Solution:**

```bash
# Make sure .env.local exists
ls -la .env.local

# Check content
cat .env.local

# Restart dev server
npm run dev
```

### Error: "Failed to parse PDF"

✅ **Causes:**

- PDF file corrupted
- PDF is password protected
- PDF menggunakan format khusus (image-based PDF)

✅ **Solution:**

- Coba dengan PDF lain
- Convert PDF ke format standard
- Check console untuk detail error

### Port 3000 already in use

✅ **Solution:**

```bash
# Run di port lain
npm run dev -- -p 3001
```

### Slow LLM response

✅ **Causes:**

- OpenAI API response time tinggi
- Network slow
- API quota limit

✅ **Solution:**

- Check OpenAI account status
- Gunakan prompt yang lebih singkat
- Add timeout handling di code

---

## 📊 Performance Tips

### Frontend Optimization

- ✅ Images lazy loading (automatic di Nuxt)
- ✅ Code splitting (automatic)
- ✅ CSS purging via Tailwind (automatic)
- ✅ Preload critical resources

### Backend Optimization

- ✅ Cache LLM responses
- ✅ Implement request rate limiting
- ✅ Use streaming untuk large files
- ✅ Compress response

### LLM Optimization

- ✅ Use gpt-4o-mini instead of gpt-4 (cost + speed)
- ✅ Limit token usage via max_tokens
- ✅ Cache extracted rules
- ✅ Batch similar requests

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Upload PDF panduan → Extract rules berhasil
- [ ] Upload DOCX dokumen → Format berhasil
- [ ] Download dokumen → File valid
- [ ] Try dengan file besar → Handle gracefully
- [ ] Error handling → Pesan error clear

### Automated Testing (TODO)

```bash
# Setup testing framework
npm install -D vitest @vue/test-utils

# Create test files
# tests/unit/parser.test.ts
# tests/unit/llm.test.ts

# Run tests
npm run test
```

---

## 📚 Additional Resources

- [Nuxt Docs](https://nuxt.com)
- [Vue 3 Docs](https://vuejs.org)
- [TailwindCSS Docs](https://tailwindcss.com)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 🎓 For Skripsi

### Bab IV - Implementation Details

Dokumentasikan:

1. **Server API Implementation**
   - Endpoint specifications
   - Request/Response format
   - Error handling

2. **LLM Integration**
   - Prompt engineering strategy
   - Model selection rationale
   - Token optimization

3. **File Processing**
   - PDF parsing approach
   - DOCX generation logic
   - Format conversion details

4. **Database Design (if applicable)**
   - Schema design
   - Indexing strategy

5. **Frontend Architecture**
   - Component structure
   - State management
   - API integration

### Bab V - Testing

Document:

1. **Unit Testing Results**
   - Parser tests
   - LLM integration tests
   - Formatter tests

2. **Integration Testing**
   - End-to-end flow
   - API testing
   - File processing accuracy

3. **Performance Testing**
   - Response times
   - File size limits
   - Concurrent users

4. **User Acceptance Testing**
   - User feedback
   - Usability metrics
