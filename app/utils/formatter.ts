// Document Formatter Engine — Skripsi + Jurnal
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  HeadingLevel,
  SectionType,
  PageSize,
} from "docx";
import type {
  FormattingRules,
  JournalFormattingRules,
  DocumentType,
  AnyFormattingRules,
} from "./types";

// ═══════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Convert cm ke twip (word units)
 */
function cmToTwip(cm: number): number {
  return Math.round((cm / 2.54) * 1440);
}

/**
 * Parse alignment string ke AlignmentType
 */
function parseAlignment(align?: string): AlignmentType {
  switch (align?.toLowerCase()) {
    case "center":
      return AlignmentType.CENTER;
    case "right":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.JUSTIFIED;
    case "left":
    default:
      return AlignmentType.LEFT;
  }
}

// ═══════════════════════════════════════════════════════════
//  SKRIPSI FORMATTER (existing)
// ═══════════════════════════════════════════════════════════

/**
 * Format konten dokumen skripsi berdasarkan rules
 */
export async function formatDocument(
  content: string,
  rules: FormattingRules,
): Promise<Document> {
  const paragraphs = content.split("\n").filter((p) => p.trim());
  const formattedParagraphs: Paragraph[] = [];

  const lineSpacing = Math.round(rules.spacing * 240);
  const fontSize = (rules.size || 12) * 2;

  for (const text of paragraphs) {
    const trimmed = text.trim();
    // Klasifikasi baris: BAB / sub-bab / sub-sub-bab / paragraf biasa. Heading
    // di-set lewat `heading:` supaya dokumen punya struktur outline (berguna
    // untuk daftar isi otomatis di Word), tampilannya tetap mengikuti rules.
    const lineType = classifySkripsiLine(trimmed);

    if (lineType === "bab") {
      formattedParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: rules.bab?.uppercase ? trimmed.toUpperCase() : trimmed,
              bold: rules.bab?.bold ?? true,
              font: rules.font,
              size: fontSize,
            }),
          ],
          spacing: { line: lineSpacing, before: 240, after: 120 },
          alignment: parseAlignment(rules.bab?.align || "center"),
        }),
      );
    } else if (lineType === "subBab") {
      const sb = rules.subBab;
      formattedParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: sb?.uppercase ? trimmed.toUpperCase() : trimmed,
              bold: sb?.bold ?? true,
              italics: sb?.italic ?? false,
              font: rules.font,
              size: fontSize,
            }),
          ],
          spacing: { line: lineSpacing, before: 200, after: 80 },
          alignment: parseAlignment(sb?.align || "left"),
        }),
      );
    } else if (lineType === "subSubBab") {
      const ssb = rules.subSubBab;
      formattedParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              text: ssb?.uppercase ? trimmed.toUpperCase() : trimmed,
              bold: ssb?.bold ?? true,
              italics: ssb?.italic ?? false,
              font: rules.font,
              size: fontSize,
            }),
          ],
          spacing: { line: lineSpacing, before: 160, after: 60 },
          alignment: parseAlignment(ssb?.align || "left"),
        }),
      );
    } else {
      formattedParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              font: rules.font,
              size: fontSize,
            }),
          ],
          spacing: { line: lineSpacing },
          alignment: parseAlignment(rules.paragraf?.align || "left"),
          indent: {
            firstLine: rules.paragraf?.indent
              ? cmToTwip(rules.paragraf.indent)
              : convertInchesToTwip(0.5),
          },
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: cmToTwip(rules.margin.top || 4),
              bottom: cmToTwip(rules.margin.bottom || 3),
              left: cmToTwip(rules.margin.left || 4),
              right: cmToTwip(rules.margin.right || 3),
            },
          },
        },
        children: formattedParagraphs,
      },
    ],
  });

  return doc;
}

/**
 * Deteksi apakah sebuah baris adalah judul BAB skripsi.
 * Dipakai bersama oleh formatter docx & preview HTML supaya konsisten.
 */
function isSkripsiChapter(line: string): boolean {
  return /^(BAB|CHAPTER|BAGIAN)\s+([IVXLCDM]+|\d+)\b/i.test(line.trim());
}

export type SkripsiLineType = "bab" | "subBab" | "subSubBab" | "body";

/**
 * Klasifikasi satu baris skripsi → BAB / sub-bab / sub-sub-bab / paragraf biasa.
 *   BAB         : "BAB I", "BAB 2 PENDAHULUAN"   → Heading 1
 *   sub-bab     : "1.1 Latar Belakang"           → Heading 2
 *   sub-sub-bab : "1.1.1 Ruang Lingkup"          → Heading 3
 * Penomoran wajib diikuti spasi lalu huruf KAPITAL, supaya kalimat biasa yang
 * kebetulan diawali angka desimal (mis. "3.14 adalah ...") tidak ikut tertangkap.
 */
export function classifySkripsiLine(line: string): SkripsiLineType {
  const t = line.trim();
  if (isSkripsiChapter(t)) return "bab";
  if (/^\d{1,2}\.\d{1,2}\.\d{1,2}\.?\s+[A-Z]/.test(t)) return "subSubBab";
  if (/^\d{1,2}\.\d{1,2}\.?\s+[A-Z]/.test(t)) return "subBab";
  return "body";
}

/**
 * Escape karakter HTML supaya teks dokumen aman ditaruh via v-html.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render perkiraan tampilan dokumen skripsi sebagai HTML — dipakai untuk
 * preview gratis sebelum user membayar. Bukan file final, hanya gambaran
 * visual seberapa "rapi" hasilnya mengikuti aturan yang dikonfirmasi.
 */
export function formatSkripsiPreviewHtml(
  content: string,
  rules: FormattingRules,
): string {
  const paragraphs = content.split("\n").filter((p) => p.trim());
  const font = rules.font || "Times New Roman";
  const size = rules.size || 12;
  const spacing = rules.spacing || 1.5;
  const indentCm = rules.paragraf?.indent ?? 0.75;
  const paragraphAlign = rules.paragraf?.align || "justify";

  // Style satu baris heading (bab/sub-bab/sub-sub-bab) untuk preview HTML.
  const headingHtml = (
    text: string,
    cfg: { uppercase?: boolean; bold?: boolean; italic?: boolean; align?: string },
    defaultAlign: string,
  ): string => {
    const shown = cfg.uppercase ? text.toUpperCase() : text;
    const weight = cfg.bold ?? true ? "700" : "400";
    const fontStyle = cfg.italic ? "italic" : "normal";
    const align = cfg.align || defaultAlign;
    return `<p style="text-align:${align};font-weight:${weight};font-style:${fontStyle};margin:${
      spacing * 0.5
    }em 0 ${spacing * 0.25}em;">${escapeHtml(shown)}</p>`;
  };

  const body = paragraphs
    .map((text) => {
      const trimmed = text.trim();
      const lineType = classifySkripsiLine(trimmed);
      if (lineType === "bab") {
        return headingHtml(trimmed, rules.bab || {}, "center");
      }
      if (lineType === "subBab") {
        return headingHtml(trimmed, rules.subBab || {}, "left");
      }
      if (lineType === "subSubBab") {
        return headingHtml(trimmed, rules.subSubBab || {}, "left");
      }
      return `<p style="text-align:${paragraphAlign};text-indent:${indentCm}cm;margin:0;">${escapeHtml(
        trimmed,
      )}</p>`;
    })
    .join("");

  // "Kertas" A4 dengan margin sesuai rules. Lebar dibatasi, biar bisa di-scroll.
  return `<div style="background:#fff;color:#111;font-family:'${font}',serif;font-size:${size}pt;line-height:${spacing};padding:${
    rules.margin.top || 4
  }cm ${rules.margin.right || 3}cm ${rules.margin.bottom || 3}cm ${
    rules.margin.left || 4
  }cm;box-sizing:border-box;">${body}</div>`;
}

// ═══════════════════════════════════════════════════════════
//  JURNAL FORMATTER (new)
// ═══════════════════════════════════════════════════════════

/**
 * Deteksi struktur jurnal dari teks
 */
interface JournalSection {
  type:
    | "title"
    | "author"
    | "affiliation"
    | "abstract"
    | "keywords"
    | "heading1"
    | "heading2"
    | "heading3"
    | "reference"
    | "body";
  text: string;
}

function parseJournalStructure(content: string): JournalSection[] {
  const lines = content.split("\n").filter((l) => l.trim());
  const sections: JournalSection[] = [];

  // Pattern detectors
  const abstractPattern =
    /^(abstrak|abstract|ringkasan|intisari)\s*[:.]?\s*/i;
  const keywordsPattern =
    /^(kata\s*kunci|keywords?|key\s*words?)\s*[:.]?\s*/i;
  const referencePattern =
    /^(daftar\s*pustaka|referensi|references?|bibliography)\s*$/i;
  const heading1Pattern = /^(\d+\.)\s+[A-Z]/;
  const heading1RomanPattern = /^(I{1,3}|IV|V|VI{0,3}|IX|X)\.\s+/;
  const heading2Pattern = /^(\d+\.\d+)\s+/;
  const heading3Pattern = /^(\d+\.\d+\.\d+)\s+/;
  const emailPattern = /[@]/;
  const affiliationPattern =
    /\b(universitas|university|institut|institute|fakultas|faculty|departemen|department|jurusan|prodi|program\s*studi)\b/i;

  let inReferences = false;
  let inAbstract = false;
  let titleDone = false;
  let authorDone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // References section — everything after is a reference
    if (referencePattern.test(line)) {
      inReferences = true;
      sections.push({ type: "heading1", text: line });
      continue;
    }
    if (inReferences) {
      sections.push({ type: "reference", text: line });
      continue;
    }

    // Abstract detection
    if (abstractPattern.test(line)) {
      inAbstract = true;
      const rest = line.replace(abstractPattern, "").trim();
      if (rest) sections.push({ type: "abstract", text: rest });
      continue;
    }
    if (inAbstract) {
      if (
        keywordsPattern.test(line) ||
        heading1Pattern.test(line) ||
        heading1RomanPattern.test(line)
      ) {
        inAbstract = false;
        // fall through to detect type below
      } else {
        sections.push({ type: "abstract", text: line });
        continue;
      }
    }

    // Keywords
    if (keywordsPattern.test(line)) {
      const rest = line.replace(keywordsPattern, "").trim();
      sections.push({ type: "keywords", text: rest || line });
      continue;
    }

    // Headings
    if (heading3Pattern.test(line)) {
      sections.push({ type: "heading3", text: line });
      continue;
    }
    if (heading2Pattern.test(line)) {
      sections.push({ type: "heading2", text: line });
      continue;
    }
    if (heading1Pattern.test(line) || heading1RomanPattern.test(line)) {
      sections.push({ type: "heading1", text: line });
      continue;
    }
    // ALL-CAPS short line = possibly heading1
    if (
      line === line.toUpperCase() &&
      line.length < 80 &&
      /[A-Z]/.test(line) &&
      titleDone
    ) {
      sections.push({ type: "heading1", text: line });
      continue;
    }

    // Title (first meaningful line before authors)
    if (!titleDone) {
      sections.push({ type: "title", text: line });
      titleDone = true;
      continue;
    }

    // Authors / affiliations (lines before abstract)
    if (!authorDone && !heading1Pattern.test(line)) {
      if (
        emailPattern.test(line) ||
        affiliationPattern.test(line)
      ) {
        sections.push({ type: "affiliation", text: line });
        continue;
      }
      // Short non-heading lines after title → likely author
      if (line.length < 120 && !abstractPattern.test(line)) {
        sections.push({ type: "author", text: line });
        continue;
      }
      authorDone = true;
    }

    // Default body text
    sections.push({ type: "body", text: line });
  }

  return sections;
}

/**
 * Format konten dokumen jurnal berdasarkan rules
 */
export async function formatJournalDocument(
  content: string,
  rules: JournalFormattingRules,
): Promise<Document> {
  const structure = parseJournalStructure(content);

  // Front matter (title/authors/abstract/keywords) membentang penuh 1 kolom,
  // sedangkan body & referensi mengikuti layout kolom dari rules. Keduanya
  // dipisah jadi 2 section docx supaya layout jurnal 2 kolom tampil benar.
  const frontMatter: Paragraph[] = [];
  const body: Paragraph[] = [];
  let bodyStarted = false;
  const FRONT_TYPES = ["title", "author", "affiliation", "abstract", "keywords"];

  const baseFont = rules.font || "Times New Roman";
  const baseSize = rules.size || 12;
  const baseSpacing = Math.round((rules.spacing || 1.0) * 240);

  for (const section of structure) {
    // Begitu ketemu heading/body/reference pertama, semua sisanya masuk body.
    if (!FRONT_TYPES.includes(section.type)) bodyStarted = true;
    const target = bodyStarted ? body : frontMatter;
    switch (section.type) {
      case "title":
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: rules.title?.uppercase
                  ? section.text.toUpperCase()
                  : section.text,
                bold: rules.title?.bold ?? true,
                font: rules.title?.font || baseFont,
                size: (rules.title?.size || 14) * 2,
              }),
            ],
            spacing: { line: baseSpacing, after: 120 },
            alignment: parseAlignment(rules.title?.align || "center"),
          }),
        );
        break;

      case "author":
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                font: rules.authors?.font || baseFont,
                size: (rules.authors?.size || baseSize) * 2,
              }),
            ],
            spacing: { line: baseSpacing, after: 40 },
            alignment: parseAlignment(rules.authors?.align || "center"),
          }),
        );
        break;

      case "affiliation":
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                font: rules.authors?.font || baseFont,
                size: (rules.authors?.size || 10) * 2,
                italics: true,
              }),
            ],
            spacing: { line: baseSpacing, after: 40 },
            alignment: parseAlignment(rules.authors?.align || "center"),
          }),
        );
        break;

      case "abstract":
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                font: rules.abstract?.font || baseFont,
                size: (rules.abstract?.size || 10) * 2,
                italics: rules.abstract?.italic ?? false,
                bold: rules.abstract?.bold ?? false,
              }),
            ],
            spacing: { line: baseSpacing },
            alignment: parseAlignment("justify"),
            indent: rules.abstract?.indent
              ? {
                  left: cmToTwip(rules.abstract.indent),
                  right: cmToTwip(rules.abstract.indent),
                }
              : undefined,
          }),
        );
        break;

      case "keywords":
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Kata Kunci: ",
                bold: true,
                font: baseFont,
                size: (rules.abstract?.size || 10) * 2,
              }),
              new TextRun({
                text: section.text,
                italics: rules.keywords?.italic ?? true,
                font: baseFont,
                size: (rules.abstract?.size || 10) * 2,
              }),
            ],
            spacing: { line: baseSpacing, after: 200 },
            alignment: parseAlignment("justify"),
          }),
        );
        break;

      case "heading1": {
        const s1 = rules.sections?.level1;
        const headingText = s1?.uppercase
          ? section.text.toUpperCase()
          : section.text;
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: headingText,
                bold: s1?.bold ?? true,
                font: s1?.font || baseFont,
                size: (s1?.size || baseSize) * 2,
              }),
            ],
            spacing: { line: baseSpacing, before: 240, after: 120 },
            alignment: parseAlignment(s1?.align || "left"),
          }),
        );
        break;
      }

      case "heading2": {
        const s2 = rules.sections?.level2;
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                bold: s2?.bold ?? true,
                italics: s2?.italic ?? false,
                font: s2?.font || baseFont,
                size: (s2?.size || baseSize) * 2,
              }),
            ],
            spacing: { line: baseSpacing, before: 200, after: 80 },
            alignment: parseAlignment(s2?.align || "left"),
          }),
        );
        break;
      }

      case "heading3": {
        const s3 = rules.sections?.level3;
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                bold: s3?.bold ?? false,
                italics: s3?.italic ?? true,
                font: s3?.font || baseFont,
                size: (s3?.size || baseSize) * 2,
              }),
            ],
            spacing: { line: baseSpacing, before: 160, after: 60 },
            alignment: parseAlignment(s3?.align || "left"),
          }),
        );
        break;
      }

      case "reference": {
        const ref = rules.references;
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                font: ref?.font || baseFont,
                size: (ref?.size || 10) * 2,
              }),
            ],
            spacing: {
              line: Math.round((ref?.spacing || 1.0) * 240),
              after: 60,
            },
            indent: ref?.hangingIndent
              ? {
                  hanging: cmToTwip(ref.hangingIndent),
                  left: cmToTwip(ref.hangingIndent),
                }
              : undefined,
            alignment: parseAlignment("justify"),
          }),
        );
        break;
      }

      default:
        // body text
        target.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                font: baseFont,
                size: baseSize * 2,
              }),
            ],
            spacing: { line: baseSpacing },
            alignment: parseAlignment(rules.paragraf?.align || "justify"),
            indent: {
              firstLine: rules.paragraf?.indent
                ? cmToTwip(rules.paragraf.indent)
                : convertInchesToTwip(0.5),
            },
          }),
        );
        break;
    }
  }

  // Determine page size
  const isLetter = rules.pageSize === "Letter";
  const pageWidth = isLetter ? 12240 : 11906; // twips
  const pageHeight = isLetter ? 15840 : 16838;

  // Jumlah kolom — di-coerce ke number karena LLM kadang mengembalikan string
  // ("2") yang membuat perbandingan === 2 gagal & layout jatuh ke 1 kolom.
  const columnCount = Number(rules.columns?.count) || 1;

  const pageProps = {
    size: { width: pageWidth, height: pageHeight },
    margin: {
      top: cmToTwip(rules.margin.top || 2.54),
      bottom: cmToTwip(rules.margin.bottom || 2.54),
      left: cmToTwip(rules.margin.left || 2.54),
      right: cmToTwip(rules.margin.right || 2.54),
    },
  };

  const bodyColumn =
    columnCount >= 2
      ? {
          count: columnCount,
          space: cmToTwip(rules.columns?.gap || 0.5),
          equalWidth: true,
        }
      : undefined;

  const sections: any[] = [];

  // Section 1: front matter — selalu 1 kolom penuh.
  if (frontMatter.length > 0) {
    sections.push({
      properties: { page: pageProps },
      children: frontMatter,
    });
  }

  // Section 2: body — lanjut di halaman yang sama (CONTINUOUS) saat ada
  // front matter, dengan layout kolom sesuai rules.
  if (body.length > 0) {
    sections.push({
      properties: {
        type: frontMatter.length > 0 ? SectionType.CONTINUOUS : undefined,
        page: pageProps,
        column: bodyColumn,
      },
      children: body,
    });
  }

  // Fallback: dokumen kosong → tetap kirim 1 section valid.
  if (sections.length === 0) {
    sections.push({ properties: { page: pageProps }, children: [] });
  }

  const doc = new Document({ sections });

  return doc;
}

// ═══════════════════════════════════════════════════════════
//  SHARED / EXPORTS
// ═══════════════════════════════════════════════════════════

/**
 * Generate DOCX file dan return sebagai buffer
 */
export async function generateDocx(document: Document): Promise<Buffer> {
  const buffer = await Packer.toBuffer(document);
  return buffer;
}

/**
 * Format dan generate file dalam satu function (SKRIPSI)
 */
export async function formatAndGenerateDocx(
  content: string,
  rules: FormattingRules,
): Promise<Buffer> {
  const doc = await formatDocument(content, rules);
  return generateDocx(doc);
}

/**
 * Format dan generate file dalam satu function (JURNAL)
 */
export async function formatAndGenerateJournalDocx(
  content: string,
  rules: JournalFormattingRules,
): Promise<Buffer> {
  const doc = await formatJournalDocument(content, rules);
  return generateDocx(doc);
}

/**
 * Unified formatter — pilih berdasarkan documentType
 */
export async function formatAndGenerateByType(
  content: string,
  rules: AnyFormattingRules,
  documentType: DocumentType,
): Promise<Buffer> {
  if (documentType === "jurnal") {
    return formatAndGenerateJournalDocx(
      content,
      rules as JournalFormattingRules,
    );
  }
  return formatAndGenerateDocx(content, rules as FormattingRules);
}

/**
 * Apply rules dengan cara simple (untuk testing)
 */
export function applyRulesSimple(
  content: string,
  rules: AnyFormattingRules,
): string {
  let formatted = content;
  formatted = `
<!-- FORMATTED WITH RAPIIN -->
<!-- Font: ${rules.font} -->
<!-- Size: ${rules.size}pt -->
<!-- Spacing: ${rules.spacing} -->

${formatted}
`;
  return formatted;
}
