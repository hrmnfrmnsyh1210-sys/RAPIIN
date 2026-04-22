// API endpoint untuk ekstrak aturan dari panduan
import {
  extractRulesFromAI,
  mergeWithDefaults,
  validateRules,
} from "~/app/utils/llm";
import { parseFile, cleanText } from "~/app/utils/parser";
import type { FormattingRules } from "~/app/utils/types";

/**
 * POST /api/extractRules
 * Extract rules dari panduan PDF menggunakan LLM
 *
 * Body:
 * {
 *   guidelineText: string (text hasil parsing dari PDF panduan)
 * }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ guidelineText: string }>(event);

    if (!body?.guidelineText) {
      return {
        success: false,
        error: "guidelineText diperlukan",
      };
    }

    // Clean text untuk LLM
    const cleanedText = cleanText(body.guidelineText);

    if (cleanedText.length < 50) {
      return {
        success: false,
        error: "Panduan terlalu singkat atau kosong",
      };
    }

    console.log(`Mengekstrak rules dari text ${cleanedText.length} chars...`);

    // Call LLM untuk ekstrak aturan
    const extractedRules = await extractRulesFromAI(cleanedText.slice(0, 3000)); // Limit untuk API

    // Validate rules
    if (!validateRules(extractedRules)) {
      console.warn("Rules tidak valid, merge dengan defaults");
    }

    // Merge dengan defaults
    const finalRules = mergeWithDefaults(extractedRules);

    return {
      success: true,
      rules: finalRules,
      message: "Rules berhasil diekstrak dari panduan",
    };
  } catch (error) {
    console.error("Extract rules error:", error);

    // Return error dengan pesan yang informatif
    const errorMessage =
      error instanceof Error ? error.message : "Ekstrak rules gagal";

    return {
      success: false,
      error: errorMessage,
      message: "Gagal mengekstrak rules. Silakan cek API key dan coba lagi.",
    };
  }
});
