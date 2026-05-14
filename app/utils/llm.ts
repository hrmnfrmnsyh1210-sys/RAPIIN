import type {
  FormattingRules,
  JournalFormattingRules,
  DocumentType,
  AnyFormattingRules,
} from "./types";

/**
 * Konfigurasi LLM — di-pass dari server route via useRuntimeConfig(event),
 * supaya env var dibaca lewat mekanisme resmi Nuxt (bukan process.env mentah).
 */
export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

// ═══════════════════════════════════════════════════════════
//  PROMPTS
// ═══════════════════════════════════════════════════════════

/**
 * Prompt template untuk ekstrak aturan formatting SKRIPSI.
 * Jika `targetProgram` diisi, ekstraksi difokuskan ke jurusan/prodi tersebut.
 */
function buildSkripsiPrompt(
  guidelineText: string,
  targetProgram?: string,
): string {
  const focusInstruction = targetProgram
    ? `
PENTING — FOKUS JURUSAN:
Panduan ini memuat aturan untuk beberapa jurusan/program studi. Ekstrak aturan
formatting HANYA yang berlaku untuk: "${targetProgram}". Abaikan aturan jurusan lain.`
    : `
DETEKSI JURUSAN:
Periksa apakah panduan memuat aturan formatting yang BERBEDA untuk lebih dari
satu jurusan/program studi/fakultas. Jika ya, daftarkan semua nama jurusan itu
pada field "programs". Jika panduan hanya untuk satu jurusan (atau tidak
menyebut jurusan sama sekali), kembalikan "programs" sebagai array kosong [].`;

  return `
Kamu adalah sistem pembaca panduan skripsi yang ahli.

PANDUAN YANG DIBERIKAN:
${guidelineText}
${focusInstruction}

TUGAS:
Ekstrak SEMUA aturan formatting yang ada dalam panduan di atas. Termasuk:
- Font (nama font yang digunakan)
- Ukuran font (dalam pt)
- Spasi baris (single, 1.5, double, dll)
- Margin (atas, bawah, kiri, kanan dalam cm)
- Format judul BAB (mis. "BAB I PENDAHULUAN") — bold, uppercase, align
- Format judul SUB-BAB (mis. "1.1 Latar Belakang") — bold, italic, uppercase, align
- Format judul SUB-SUB-BAB (mis. "1.1.1 ...") — bold, italic, uppercase, align
- Format paragraf (indent, alignment, dll)
- Format daftar isi
- Format footer/header
- Hal lain yang relevan dengan formatting

OUTPUT:
Berikan HANYA JSON VALID tanpa penjelasan apapun. Jika tidak ada informasi, gunakan default yang logis:

{
  "programs": [],
  "font": "Times New Roman",
  "size": 12,
  "spacing": 1.5,
  "margin": {
    "top": 4,
    "left": 4,
    "right": 3,
    "bottom": 3
  },
  "bab": {
    "uppercase": true,
    "bold": true,
    "align": "center"
  },
  "subBab": {
    "uppercase": false,
    "bold": true,
    "italic": false,
    "align": "left"
  },
  "subSubBab": {
    "uppercase": false,
    "bold": true,
    "italic": false,
    "align": "left"
  },
  "paragraf": {
    "indent": 0.75,
    "align": "justify"
  }
}
`;
}

/**
 * Prompt template untuk ekstrak aturan formatting JURNAL
 */
function buildJurnalPrompt(guidelineText: string): string {
  return `
Kamu adalah sistem pembaca panduan/template jurnal ilmiah yang ahli.

PANDUAN/TEMPLATE JURNAL YANG DIBERIKAN:
${guidelineText}

TUGAS:
Ekstrak SEMUA aturan formatting jurnal yang ada dalam panduan/template di atas. Termasuk:
- Font utama dan ukurannya (dalam pt)
- Spasi baris
- Margin halaman (atas, bawah, kiri, kanan dalam cm)
- Format judul paper (font, ukuran, bold, uppercase, align, batas kata)
- Format nama penulis dan afiliasi
- Format abstrak (font, ukuran, batas kata, bahasa yang dipakai)
- Format kata kunci/keywords (separator, jumlah maksimal, italic/tidak)
- Format heading/subheading per level (bold, uppercase, numbering, align)
- Layout kolom (single column / double column, jarak antar kolom)
- Gaya referensi/sitasi (APA, IEEE, Vancouver, Chicago, Harvard, atau lainnya)
- Format referensi (font, ukuran, hanging indent)
- Ukuran halaman (A4/Letter)
- Format paragraf (indent, alignment)
- Hal lain yang relevan dengan formatting jurnal

OUTPUT:
Berikan HANYA JSON VALID tanpa penjelasan apapun. Jika informasi tidak ada, gunakan default yang umum untuk jurnal ilmiah:

{
  "font": "Times New Roman",
  "size": 12,
  "spacing": 1.0,
  "margin": {
    "top": 2.54,
    "left": 2.54,
    "right": 2.54,
    "bottom": 2.54
  },
  "title": {
    "font": "Times New Roman",
    "size": 14,
    "bold": true,
    "uppercase": false,
    "align": "center",
    "maxWords": 15
  },
  "authors": {
    "font": "Times New Roman",
    "size": 12,
    "align": "center",
    "affiliationStyle": "superscript"
  },
  "abstract": {
    "font": "Times New Roman",
    "size": 10,
    "maxWords": 250,
    "minWords": 150,
    "bold": false,
    "italic": false,
    "indent": 0,
    "languages": ["id", "en"]
  },
  "keywords": {
    "separator": ",",
    "maxCount": 5,
    "italic": true
  },
  "sections": {
    "level1": {
      "bold": true,
      "uppercase": true,
      "numbering": true,
      "align": "left",
      "size": 12
    },
    "level2": {
      "bold": true,
      "italic": false,
      "numbering": true,
      "align": "left",
      "size": 12
    },
    "level3": {
      "bold": false,
      "italic": true,
      "numbering": true,
      "align": "left",
      "size": 12
    }
  },
  "columns": {
    "count": 2,
    "gap": 0.5
  },
  "references": {
    "style": "APA",
    "font": "Times New Roman",
    "size": 10,
    "hangingIndent": 1.27,
    "spacing": 1.0
  },
  "pageSize": "A4",
  "lineNumbering": false,
  "paragraf": {
    "indent": 0.75,
    "align": "justify"
  }
}
`;
}

// ═══════════════════════════════════════════════════════════
//  AI EXTRACTION
// ═══════════════════════════════════════════════════════════

/**
 * Validasi & normalisasi config LLM sebelum dipakai.
 */
function resolveConfig(config: LLMConfig): {
  apiKey: string;
  apiUrl: string;
  model: string;
} {
  const apiKey = config.apiKey?.trim();
  const baseUrl = config.baseUrl?.trim();
  const model = config.model?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY tidak ditemukan / kosong. Cek environment variable.",
    );
  }
  if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
    throw new Error(
      `LLM_BASE_URL tidak valid: "${baseUrl}". Harus berupa URL yang diawali http(s)://`,
    );
  }
  if (!model) {
    throw new Error("LLM_MODEL tidak ditemukan / kosong.");
  }

  return {
    apiKey,
    apiUrl: `${baseUrl.replace(/\/+$/, "")}/chat/completions`,
    model,
  };
}

/**
 * Call OpenAI API untuk ekstrak aturan (generic)
 */
async function callLLM(
  prompt: string,
  systemMessage: string,
  config: LLMConfig,
): Promise<string> {
  const { apiKey, apiUrl, model } = resolveConfig(config);

  console.log(`[LLM] Using model: ${model} | url: ${apiUrl}`);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    let errMsg = `${response.status} ${response.statusText}`;
    try {
      const errData = await response.json();
      errMsg = errData?.error?.message || errData?.message || errMsg;
    } catch {
      const text = await response.text().catch(() => "");
      if (text) errMsg = text.substring(0, 200);
    }
    throw new Error(`LLM API Error: ${errMsg}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Tidak ada response dari LLM");
  }

  return content;
}

/**
 * Extract JSON dari response LLM (kadang ada text sebelum/sesudah)
 */
function extractJSON(content: string): any {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Response dari LLM:", content);
    throw new Error("Tidak bisa extract JSON dari response LLM");
  }
  return JSON.parse(jsonMatch[0]);
}

/**
 * Hasil ekstraksi skripsi: aturan + daftar jurusan yang terdeteksi di panduan.
 */
export interface SkripsiExtractionResult {
  rules: FormattingRules;
  programs: string[];
}

/**
 * Call OpenAI API untuk ekstrak aturan SKRIPSI.
 * `targetProgram` opsional — kalau diisi, ekstraksi difokuskan ke jurusan itu.
 */
export async function extractRulesFromAI(
  guidelineText: string,
  config: LLMConfig,
  targetProgram?: string,
): Promise<SkripsiExtractionResult> {
  try {
    const prompt = buildSkripsiPrompt(guidelineText, targetProgram);
    const content = await callLLM(
      prompt,
      "Kamu adalah expert dalam membaca dan mengekstrak aturan formatting dokumen skripsi. Selalu output JSON VALID.",
      config,
    );
    const parsed = extractJSON(content) as FormattingRules & {
      programs?: unknown;
    };

    // Pisahkan daftar jurusan dari objek rules.
    const programs = Array.isArray(parsed.programs)
      ? parsed.programs
          .map((p) => String(p).trim())
          .filter((p) => p.length > 0)
      : [];
    delete parsed.programs;

    return { rules: parsed as FormattingRules, programs };
  } catch (error) {
    console.error("Error extracting skripsi rules:", error);
    throw error;
  }
}

/**
 * Call OpenAI API untuk ekstrak aturan JURNAL
 */
export async function extractJournalRulesFromAI(
  guidelineText: string,
  config: LLMConfig,
): Promise<JournalFormattingRules> {
  try {
    const prompt = buildJurnalPrompt(guidelineText);
    const content = await callLLM(
      prompt,
      "Kamu adalah expert dalam membaca dan mengekstrak aturan formatting jurnal ilmiah. Selalu output JSON VALID.",
      config,
    );
    return extractJSON(content) as JournalFormattingRules;
  } catch (error) {
    console.error("Error extracting journal rules:", error);
    throw error;
  }
}

/**
 * Unified extractor — pilih berdasarkan documentType.
 * Selalu mengembalikan `programs` (kosong untuk jurnal / panduan satu jurusan).
 */
export async function extractRulesByType(
  guidelineText: string,
  documentType: DocumentType,
  config: LLMConfig,
  targetProgram?: string,
): Promise<{ rules: AnyFormattingRules; programs: string[] }> {
  if (documentType === "jurnal") {
    const rules = await extractJournalRulesFromAI(guidelineText, config);
    return { rules, programs: [] };
  }
  return extractRulesFromAI(guidelineText, config, targetProgram);
}

// ═══════════════════════════════════════════════════════════
//  VALIDATION & DEFAULTS
// ═══════════════════════════════════════════════════════════

/**
 * Validate rules skripsi
 */
export function validateRules(rules: FormattingRules): boolean {
  const required = ["font", "size", "spacing", "margin"];
  return required.every((key) => key in rules);
}

/**
 * Validate rules jurnal
 */
export function validateJournalRules(rules: JournalFormattingRules): boolean {
  const required = ["font", "size", "spacing", "margin"];
  return required.every((key) => key in rules);
}

/**
 * Merge rules skripsi dengan defaults
 */
export function mergeWithDefaults(
  extractedRules: Partial<FormattingRules>,
): FormattingRules {
  const defaults: FormattingRules = {
    font: "Times New Roman",
    size: 12,
    spacing: 1.5,
    margin: {
      top: 4,
      left: 4,
      right: 3,
      bottom: 3,
    },
    bab: {
      uppercase: true,
      bold: true,
      align: "center",
    },
    subBab: {
      uppercase: false,
      bold: true,
      italic: false,
      align: "left",
    },
    subSubBab: {
      uppercase: false,
      bold: true,
      italic: false,
      align: "left",
    },
    paragraf: {
      align: "justify",
      indent: 0.75,
    },
  };

  return {
    ...defaults,
    ...extractedRules,
    margin: {
      ...defaults.margin,
      ...(extractedRules.margin || {}),
    },
    bab: {
      ...defaults.bab,
      ...(extractedRules.bab || {}),
    },
    subBab: {
      ...defaults.subBab,
      ...(extractedRules.subBab || {}),
    },
    subSubBab: {
      ...defaults.subSubBab,
      ...(extractedRules.subSubBab || {}),
    },
    paragraf: {
      ...defaults.paragraf,
      ...(extractedRules.paragraf || {}),
    },
  };
}

/**
 * Merge rules jurnal dengan defaults
 */
export function mergeJournalWithDefaults(
  extractedRules: Partial<JournalFormattingRules>,
): JournalFormattingRules {
  const defaults: JournalFormattingRules = {
    font: "Times New Roman",
    size: 12,
    spacing: 1.0,
    margin: { top: 2.54, left: 2.54, right: 2.54, bottom: 2.54 },
    title: {
      font: "Times New Roman",
      size: 14,
      bold: true,
      uppercase: false,
      align: "center",
      maxWords: 15,
    },
    authors: {
      font: "Times New Roman",
      size: 12,
      align: "center",
      affiliationStyle: "superscript",
    },
    abstract: {
      font: "Times New Roman",
      size: 10,
      maxWords: 250,
      minWords: 150,
      bold: false,
      italic: false,
      indent: 0,
      languages: ["id", "en"],
    },
    keywords: {
      separator: ",",
      maxCount: 5,
      italic: true,
    },
    sections: {
      level1: {
        bold: true,
        uppercase: true,
        numbering: true,
        align: "left",
        size: 12,
      },
      level2: {
        bold: true,
        italic: false,
        numbering: true,
        align: "left",
        size: 12,
      },
      level3: {
        bold: false,
        italic: true,
        numbering: true,
        align: "left",
        size: 12,
      },
    },
    columns: { count: 2, gap: 0.5 },
    references: {
      style: "APA",
      font: "Times New Roman",
      size: 10,
      hangingIndent: 1.27,
      spacing: 1.0,
    },
    pageSize: "A4",
    lineNumbering: false,
    paragraf: { indent: 0.75, align: "justify" },
  };

  return {
    ...defaults,
    ...extractedRules,
    margin: { ...defaults.margin, ...(extractedRules.margin || {}) },
    title: { ...defaults.title, ...(extractedRules.title || {}) },
    authors: { ...defaults.authors, ...(extractedRules.authors || {}) },
    abstract: { ...defaults.abstract, ...(extractedRules.abstract || {}) },
    keywords: { ...defaults.keywords, ...(extractedRules.keywords || {}) },
    sections: {
      level1: {
        ...defaults.sections!.level1,
        ...(extractedRules.sections?.level1 || {}),
      },
      level2: {
        ...defaults.sections!.level2,
        ...(extractedRules.sections?.level2 || {}),
      },
      level3: {
        ...defaults.sections!.level3,
        ...(extractedRules.sections?.level3 || {}),
      },
    },
    columns: { ...defaults.columns, ...(extractedRules.columns || {}) },
    references: {
      ...defaults.references,
      ...(extractedRules.references || {}),
    },
    paragraf: { ...defaults.paragraf, ...(extractedRules.paragraf || {}) },
  };
}

/**
 * Unified merge — pilih berdasarkan documentType
 */
export function mergeRulesByType(
  rules: Partial<AnyFormattingRules>,
  documentType: DocumentType,
): AnyFormattingRules {
  if (documentType === "jurnal") {
    return mergeJournalWithDefaults(rules as Partial<JournalFormattingRules>);
  }
  return mergeWithDefaults(rules as Partial<FormattingRules>);
}
