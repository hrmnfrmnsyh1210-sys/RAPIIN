// API endpoint untuk format dokumen (Skripsi + Jurnal)
import { createClient } from "@supabase/supabase-js";
import {
  formatAndGenerateByType,
  formatSkripsiPreviewHtml,
} from "~/utils/formatter";
import type {
  DocumentType,
  AnyFormattingRules,
  FormattingRules,
} from "~/utils/types";

/**
 * POST /api/formatDoc
 * Format dokumen dengan rules yang sudah diekstrak.
 *
 * Body:
 * {
 *   thesisText: string        (text dari dokumen),
 *   rules: AnyFormattingRules (rules hasil ekstrak),
 *   documentType?: 'skripsi' | 'jurnal'   // default: 'skripsi'
 *   mode?: 'preview' | 'full'             // default: 'full'
 *   orderId?: string          (wajib untuk skripsi mode 'full')
 * }
 *
 * mode 'preview' → kembalikan HTML perkiraan tampilan (gratis, tanpa .docx).
 * mode 'full'    → kembalikan file .docx base64. Untuk skripsi, butuh orderId
 *                  pembayaran yang valid supaya file tidak bisa diunduh gratis.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      thesisText: string;
      rules: AnyFormattingRules;
      documentType?: DocumentType;
      mode?: "preview" | "full";
      orderId?: string;
    }>(event);

    if (!body?.thesisText) {
      return { success: false, error: "thesisText diperlukan" };
    }

    if (!body?.rules) {
      return { success: false, error: "rules diperlukan" };
    }

    // Validate rules
    if (!body.rules.font || !body.rules.size || !body.rules.spacing) {
      return {
        success: false,
        error: "Rules tidak lengkap (font, size, spacing diperlukan)",
      };
    }

    const docType: DocumentType = body.documentType || "skripsi";
    const mode = body.mode || "full";

    // ── Mode PREVIEW — gratis, hanya HTML perkiraan tampilan ──────────
    if (mode === "preview") {
      if (docType === "jurnal") {
        return {
          success: false,
          error: "Preview belum tersedia untuk dokumen jurnal",
        };
      }
      const preview = formatSkripsiPreviewHtml(
        body.thesisText,
        body.rules as FormattingRules,
      );
      return {
        success: true,
        mode: "preview",
        preview,
        documentType: docType,
        message: "Preview dokumen skripsi berhasil dibuat",
      };
    }

    // ── Mode FULL — hasilkan .docx ───────────────────────────────────
    // Skripsi: file final hanya boleh dibuat setelah pembayaran terverifikasi.
    if (docType === "skripsi") {
      const orderId = body.orderId?.trim();
      if (!orderId) {
        return {
          success: false,
          error: "Pembayaran diperlukan sebelum mengunduh dokumen",
        };
      }

      const config = useRuntimeConfig(event);
      const supabase = createClient(
        config.supabaseUrl,
        config.supabaseServiceKey,
      );
      const { data: trx } = await supabase
        .from("transactions")
        .select("id, status")
        .eq("order_id", orderId)
        .single();

      if (!trx) {
        return {
          success: false,
          error: "Transaksi pembayaran tidak ditemukan",
        };
      }
    }

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
      mode: "full",
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
