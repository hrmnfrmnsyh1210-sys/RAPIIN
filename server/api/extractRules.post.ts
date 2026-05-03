// API endpoint untuk ekstrak aturan dari panduan (Skripsi + Jurnal)
import {
  extractRulesByType,
  mergeRulesByType,
  validateRules,
  validateJournalRules,
} from "~/utils/llm";
import { cleanText } from "~/utils/parser";
import type { DocumentType, AnyFormattingRules } from "~/utils/types";

/**
 * POST /api/extractRules
 * Extract rules dari panduan PDF menggunakan LLM
 *
 * Body:
 * {
 *   guidelineText: string (text hasil parsing dari PDF panduan),
 *   documentType?: 'skripsi' | 'jurnal'   // default: 'skripsi'
 * }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      guidelineText: string;
      documentType?: DocumentType;
    }>(event);

    if (!body?.guidelineText) {
      return {
        success: false,
        error: "guidelineText diperlukan",
      };
    }

    const docType: DocumentType = body.documentType || "skripsi";

    // Clean text untuk LLM
    const cleanedText = cleanText(body.guidelineText);

    if (cleanedText.length < 50) {
      return {
        success: false,
        error: "Panduan terlalu singkat atau kosong",
      };
    }

    console.log(
      `Mengekstrak rules [${docType}] dari text ${cleanedText.length} chars...`,
    );

    // Call LLM untuk ekstrak aturan berdasarkan tipe dokumen
    const extractedRules = await extractRulesByType(
      cleanedText.slice(0, 4000),
      docType,
    );

    // Validate rules
    if (docType === "jurnal") {
      if (!validateJournalRules(extractedRules as any)) {
        console.warn("Journal rules tidak valid, merge dengan defaults");
      }
    } else {
      if (!validateRules(extractedRules as any)) {
        console.warn("Skripsi rules tidak valid, merge dengan defaults");
      }
    }

    // Merge dengan defaults
    const finalRules = mergeRulesByType(extractedRules, docType);

    return {
      success: true,
      rules: finalRules,
      documentType: docType,
      message: `Rules berhasil diekstrak dari panduan ${docType}`,
    };
  } catch (error) {
    console.error("Extract rules error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Ekstrak rules gagal";

    return {
      success: false,
      error: errorMessage,
      message: "Gagal mengekstrak rules. Silakan cek API key dan coba lagi.",
    };
  }
});
