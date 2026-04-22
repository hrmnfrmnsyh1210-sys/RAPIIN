// Document Formatter Engine
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  Table,
  TableCell,
  TableRow,
  BorderStyle,
  UnderlineType,
} from "docx";
import type { FormattingRules } from "./types";

/**
 * Convert cm ke twip (word units)
 */
function cmToTwip(cm: number): number {
  // 1 inch = 2.54 cm, 1 inch = 1440 twip
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

/**
 * Format konten dokumen berdasarkan rules
 */
export async function formatDocument(
  content: string,
  rules: FormattingRules,
): Promise<Document> {
  // Split content by paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim());

  const formattedParagraphs: Paragraph[] = [];

  for (const text of paragraphs) {
    const trimmed = text.trim();
    const isChapter = /^(BAB|CHAPTER|BAGIAN|\d+\.)\s+/i.test(trimmed);

    if (isChapter) {
      // Format chapter heading
      const chapterText = rules.bab?.uppercase
        ? trimmed.toUpperCase()
        : trimmed;

      formattedParagraphs.push(
        new Paragraph({
          text: chapterText,
          spacing: {
            line: Math.round(rules.spacing * 240), // Convert to twip
            lineRule: "atLeast",
          },
          alignment: parseAlignment(rules.bab?.align),
          run: {
            bold: rules.bab?.bold,
            font: rules.font,
            size: (rules.size || 12) * 2, // docx uses half-points
          },
        }),
      );
    } else {
      // Format regular paragraph
      formattedParagraphs.push(
        new Paragraph({
          text: trimmed,
          spacing: {
            line: Math.round(rules.spacing * 240),
            lineRule: "atLeast",
          },
          alignment: parseAlignment(rules.paragraf?.align || "left"),
          indent: {
            firstLine: rules.paragraf?.indent
              ? cmToTwip(rules.paragraf.indent)
              : convertInchesToTwip(0.5),
          },
          run: {
            font: rules.font,
            size: (rules.size || 12) * 2,
          },
        }),
      );
    }
  }

  // Create document dengan margin yang sesuai rules
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margins: {
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
 * Generate DOCX file dan return sebagai buffer
 */
export async function generateDocx(document: Document): Promise<Buffer> {
  const buffer = await Packer.toBuffer(document);
  return buffer;
}

/**
 * Format dan generate file dalam satu function
 */
export async function formatAndGenerateDocx(
  content: string,
  rules: FormattingRules,
): Promise<Buffer> {
  const doc = await formatDocument(content, rules);
  const buffer = await generateDocx(doc);
  return buffer;
}

/**
 * Apply rules dengan cara simple (untuk testing)
 */
export function applyRulesSimple(
  content: string,
  rules: FormattingRules,
): string {
  // Ini adalah fallback sederhana jika ingin generate tanpa docx library
  let formatted = content;

  // Tambah informasi formatting dalam comment
  formatted = `
<!-- FORMATTED WITH RAPIIN -->
<!-- Font: ${rules.font} -->
<!-- Size: ${rules.size}pt -->
<!-- Spacing: ${rules.spacing} -->

${formatted}
`;

  return formatted;
}
