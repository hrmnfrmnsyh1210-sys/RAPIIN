import type {
  FormattingRules,
  JournalFormattingRules,
  DocumentType,
  AnyFormattingRules,
} from "./types";

const API_KEY =
  process.env.OPENAI_API_KEY || process.env.NUXT_PUBLIC_OPENAI_API_KEY;
const BASE_URL =
  process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const API_URL = `${BASE_URL}/chat/completions`;
const MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

// ═══════════════════════════════════════════════════════════
//  PROMPTS
// ═══════════════════════════════════════════════════════════

/**
 * Prompt template untuk ekstrak aturan formatting SKRIPSI
 */
function buildSkripsiPrompt(guidelineText: string): string {
  return `
Kamu adalah sistem pembaca panduan skripsi yang ahli.

PANDUAN YANG DIBERIKAN:
${guidelineText}

TUGAS:
Ekstrak SEMUA aturan formatting yang ada dalam panduan di atas. Termasuk:
- Font (nama font yang digunakan)
- Ukuran font (dalam pt)
- Spasi baris (single, 1.5, double, dll)
- Margin (atas, bawah, kiri, kanan dalam cm)
- Format judul BAB/SECTION (bold, uppercase, align, dll)
- Format paragraf (indent, alignment, dll)
- Format daftar isi
- Format footer/header
- Hal lain yang relevan dengan formatting

OUTPUT:
Berikan HANYA JSON VALID tanpa penjelasan apapun. Jika tidak ada informasi, gunakan default yang logis:

{
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
 * Call OpenAI API untuk ekstrak aturan (generic)
 */
async function callLLM(prompt: string, systemMessage: string): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      "OPENAI_API_KEY tidak ditemukan dalam environment variables",
    );
  }

  console.log(`[LLM] Using model: ${MODEL} | base: ${BASE_URL}`);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
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
 * Call OpenAI API untuk ekstrak aturan SKRIPSI
 */
export async function extractRulesFromAI(
  guidelineText: string,
): Promise<FormattingRules> {
  try {
    const prompt = buildSkripsiPrompt(guidelineText);
    const content = await callLLM(
      prompt,
      "Kamu adalah expert dalam membaca dan mengekstrak aturan formatting dokumen skripsi. Selalu output JSON VALID.",
    );
    return extractJSON(content) as FormattingRules;
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
): Promise<JournalFormattingRules> {
  try {
    const prompt = buildJurnalPrompt(guidelineText);
    const content = await callLLM(
      prompt,
      "Kamu adalah expert dalam membaca dan mengekstrak aturan formatting jurnal ilmiah. Selalu output JSON VALID.",
    );
    return extractJSON(content) as JournalFormattingRules;
  } catch (error) {
    console.error("Error extracting journal rules:", error);
    throw error;
  }
}

/**
 * Unified extractor — pilih berdasarkan documentType
 */
export async function extractRulesByType(
  guidelineText: string,
  documentType: DocumentType,
): Promise<AnyFormattingRules> {
  if (documentType === "jurnal") {
    return extractJournalRulesFromAI(guidelineText);
  }
  return extractRulesFromAI(guidelineText);
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
