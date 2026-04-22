// API endpoint untuk upload files
import path from "path";
import fs from "fs/promises";
import type { UploadedFile } from "~/utils/types";

/**
 * POST /api/upload
 * Upload panduan dan dokumen skripsi
 */
export default defineEventHandler(async (event) => {
  try {
    // Parse multipart form data
    const files = await readMultipartFormData(event);

    if (!files || files.length === 0) {
      return {
        success: false,
        error: "Tidak ada file yang diunggah",
      };
    }

    // Validasi dan simpan files
    const uploadedFiles = {
      guideline: null as string | null,
      thesis: null as string | null,
    };

    for (const file of files) {
      const filename = file.filename || "unknown";
      const ext = path.extname(filename).toLowerCase();

      // Validasi format file
      if (![".pdf", ".docx"].includes(ext)) {
        return {
          success: false,
          error: `Format file tidak valid: ${filename}. Gunakan PDF atau DOCX`,
        };
      }

      // Tentukan tipe file berdasarkan field name
      const fieldName = file.name || "";

      if (fieldName.includes("guideline") && ext === ".pdf") {
        uploadedFiles.guideline = filename;
      } else if (fieldName.includes("thesis")) {
        uploadedFiles.thesis = filename;
      }

      // TODO: Simpan ke temporary folder atau process langsung
      console.log(`File ${filename} diterima: ${file.data.length} bytes`);
    }

    return {
      success: true,
      message: "Files berhasil diunggah",
      files: uploadedFiles,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload gagal",
    };
  }
});
