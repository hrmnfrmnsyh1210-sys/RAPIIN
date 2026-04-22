// Parser untuk ekstrak text dari PDF dan DOCX
import type { UploadedFile } from "./types";

/**
 * Extract text dari PDF menggunakan pdf-parse
 */
export async function extractFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(fileBuffer);
    return data.text || "";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Gagal membaca file PDF");
  }
}

/**
 * Extract text dari DOCX menggunakan mammoth
 */
export async function extractFromDOCX(fileBuffer: Buffer): Promise<string> {
  try {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || "";
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Gagal membaca file DOCX");
  }
}

/**
 * Parse file berdasarkan tipe
 */
export async function parseFile(file: UploadedFile): Promise<string> {
  let text = "";

  if (file.type === "pdf") {
    const buffer = file.content as Buffer;
    text = await extractFromPDF(buffer);
  } else if (file.type === "docx") {
    const buffer = file.content as Buffer;
    text = await extractFromDOCX(buffer);
  } else {
    throw new Error("Format file tidak didukung. Gunakan PDF atau DOCX");
  }

  return text;
}

/**
 * Clean text untuk persiapan ke LLM
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\r\n]+/g, "\n")
    .trim();
}

/**
 * Extract aturan formatting dari text menggunakan regex (fallback)
 */
export function extractFormattingHints(text: string): string[] {
  const hints: string[] = [];
  const patterns = [
    /font[\s:]*([a-z\s]+)/gi,
    /size[\s:]*(\d+)/gi,
    /spasi[\s:]*([0-9.]+)/gi,
    /margin[\s:]*top[\s:]*(\d+)/gi,
    /margin[\s:]*left[\s:]*(\d+)/gi,
    /bold|italic|underline/gi,
    /center|align/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      hints.push(...matches);
    }
  }

  return [...new Set(hints)];
}
