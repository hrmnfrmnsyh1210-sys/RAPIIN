import type { FormattingRules, RulesExtractionResponse } from "./types";

const API_KEY =
  process.env.OPENAI_API_KEY || process.env.NUXT_PUBLIC_OPENAI_API_KEY;
const BASE_URL =
  process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const API_URL = `${BASE_URL}/chat/completions`;
const MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

/**
 * Prompt template untuk ekstrak aturan formatting
 */
function buildPrompt(guidelineText: string): string {
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
 * Call OpenAI API untuk ekstrak aturan
 */
export async function extractRulesFromAI(
  guidelineText: string,
): Promise<FormattingRules> {
  if (!API_KEY) {
    throw new Error(
      "OPENAI_API_KEY tidak ditemukan dalam environment variables",
    );
  }

  console.log(`[LLM] Using model: ${MODEL} | base: ${BASE_URL}`);

  try {
    const prompt = buildPrompt(guidelineText);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah expert dalam membaca dan mengekstrak aturan formatting dokumen. Selalu output JSON VALID.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lebih low = lebih konsisten
        max_tokens: 1500,
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
      throw new Error("Tidak ada response dari OpenAI");
    }

    // Extract JSON dari response (kadang ada text sebelum/sesudah)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Response dari LLM:", content);
      throw new Error("Tidak bisa extract JSON dari response LLM");
    }

    const rules = JSON.parse(jsonMatch[0]) as FormattingRules;
    return rules;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

/**
 * Validate rules yang di-ekstrak
 */
export function validateRules(rules: FormattingRules): boolean {
  const required = ["font", "size", "spacing", "margin"];
  return required.every((key) => key in rules);
}

/**
 * Merge rules dengan defaults
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
