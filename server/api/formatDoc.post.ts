// API endpoint untuk format dokumen (Skripsi + Jurnal)
import { formatAndGenerateByType } from "~/utils/formatter";
import type {
  DocumentType,
  AnyFormattingRules,
} from "~/utils/types";

/**
 * POST /api/formatDoc
 * Format dokumen dengan rules yang sudah diekstrak
 *
 * Body:
 * {
 *   thesisText: string        (text dari dokumen),
 *   rules: AnyFormattingRules (rules hasil ekstrak),
 *   documentType?: 'skripsi' | 'jurnal'   // default: 'skripsi'
 * }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      thesisText: string;
      rules: AnyFormattingRules;
      documentType?: DocumentType;
    }>(event);

    if (!body?.thesisText) {
      return {
        success: false,
        error: "thesisText diperlukan",
      };
    }

    if (!body?.rules) {
      return {
        success: false,
        error: "rules diperlukan",
      };
    }

    // Validate rules
    if (!body.rules.font || !body.rules.size || !body.rules.spacing) {
      return {
        success: false,
        error: "Rules tidak lengkap (font, size, spacing diperlukan)",
      };
    }

    const docType: DocumentType = body.documentType || "skripsi";
    console.log(`Memformat dokumen [${docType}] dengan rules:`, body.rules);

    // Generate formatted document berdasarkan tipe
    const docxBuffer = await formatAndGenerateByType(
      body.thesisText,
      body.rules,
      docType,
    );

    // Convert buffer ke base64 untuk transfer via HTTP
    const base64 = docxBuffer.toString("base64");

    return {
      success: true,
      document: base64,
      size: docxBuffer.length,
      documentType: docType,
      message: `Dokumen ${docType} berhasil diformat`,
    };
  } catch (error) {
    console.error("Format doc error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Format dokumen gagal",
    };
  }
});
