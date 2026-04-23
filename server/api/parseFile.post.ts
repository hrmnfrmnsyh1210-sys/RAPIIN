import mammoth from "mammoth";
import path from "path";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, message: "File diperlukan" });
  }

  const file = files[0];
  const filename = file.filename || "unknown";
  const ext = path.extname(filename).toLowerCase();

  try {
    let text = "";

    if (ext === ".pdf") {
      // Dynamic import to avoid pdf-parse ESM issues
      const { default: pdfParse } = await import("pdf-parse");
      const result = await pdfParse(file.data);
      text = result.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ buffer: file.data });
      text = result.value;
    } else {
      throw createError({
        statusCode: 400,
        message: "Format tidak didukung. Gunakan PDF atau DOCX.",
      });
    }

    return { success: true, text };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "statusCode" in (error as object)
    ) {
      throw error;
    }
    console.error("Parse file error:", error);
    throw createError({ statusCode: 500, message: "Gagal membaca isi file" });
  }
});
