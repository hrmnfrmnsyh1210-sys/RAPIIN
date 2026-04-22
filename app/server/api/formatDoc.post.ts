// API endpoint untuk format dokumen skripsi
import { formatAndGenerateDocx } from "~/app/utils/formatter";
import type { FormattingRules } from "~/app/utils/types";

/**
 * POST /api/formatDoc
 * Format dokumen skripsi dengan rules yang sudah diekstrak
 *
 * Body:
 * {
 *   thesisText: string (text dari dokumen skripsi),
 *   rules: FormattingRules (rules hasil ekstrak)
 * }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      thesisText: string;
      rules: FormattingRules;
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

    console.log("Memformat dokumen dengan rules:", body.rules);

    // Generate formatted document
    const docxBuffer = await formatAndGenerateDocx(body.thesisText, body.rules);

    // Convert buffer ke base64 untuk transfer via HTTP
    const base64 = docxBuffer.toString("base64");

    return {
      success: true,
      document: base64,
      size: docxBuffer.length,
      message: "Dokumen berhasil diformat",
    };
  } catch (error) {
    console.error("Format doc error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Format dokumen gagal",
    };
  }
});
