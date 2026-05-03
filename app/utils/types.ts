// Type definitions untuk sistem formatter (Skripsi + Jurnal)

// ── Document type selector ──────────────────────────────
export type DocumentType = 'skripsi' | 'jurnal';

// ── Shared formatting rules (used by both) ──────────────
export interface FormattingRules {
  font: string;
  size: number;
  spacing: number;
  margin: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  bab?: {
    uppercase?: boolean;
    bold?: boolean;
    align?: "center" | "left" | "right";
  };
  paragraf?: {
    align?: string;
    indent?: number;
  };
  [key: string]: any;
}

// ── Journal-specific formatting rules ───────────────────
export interface JournalFormattingRules {
  font: string;
  size: number;
  spacing: number;
  margin: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  title?: {
    font?: string;
    size?: number;
    bold?: boolean;
    uppercase?: boolean;
    align?: "center" | "left" | "right";
    maxWords?: number;
  };
  authors?: {
    font?: string;
    size?: number;
    align?: "center" | "left" | "right";
    affiliationStyle?: "superscript" | "inline" | "footnote";
  };
  abstract?: {
    font?: string;
    size?: number;
    maxWords?: number;
    minWords?: number;
    bold?: boolean;
    italic?: boolean;
    indent?: number;
    languages?: string[]; // e.g. ['id', 'en']
  };
  keywords?: {
    separator?: string;
    maxCount?: number;
    italic?: boolean;
  };
  sections?: {
    level1?: {
      bold?: boolean;
      uppercase?: boolean;
      numbering?: boolean;
      align?: "center" | "left" | "right";
      font?: string;
      size?: number;
    };
    level2?: {
      bold?: boolean;
      italic?: boolean;
      numbering?: boolean;
      align?: "left" | "center" | "right";
      font?: string;
      size?: number;
    };
    level3?: {
      bold?: boolean;
      italic?: boolean;
      numbering?: boolean;
      align?: "left" | "center" | "right";
      font?: string;
      size?: number;
    };
  };
  columns?: {
    count: number; // 1 or 2
    gap?: number; // in cm
  };
  references?: {
    style?: "APA" | "IEEE" | "Vancouver" | "Chicago" | "Harvard" | "other";
    font?: string;
    size?: number;
    hangingIndent?: number;
    spacing?: number;
  };
  pageSize?: "A4" | "Letter";
  lineNumbering?: boolean;
  paragraf?: {
    align?: string;
    indent?: number;
  };
  [key: string]: any;
}

// ── Union type for any formatting rules ─────────────────
export type AnyFormattingRules = FormattingRules | JournalFormattingRules;

// ── File types ──────────────────────────────────────────
export interface UploadedFile {
  name: string;
  type: "pdf" | "docx";
  content: Buffer | string;
  text?: string;
}

export interface ProcessingResult {
  success: boolean;
  documentType?: DocumentType;
  rules?: AnyFormattingRules;
  formattedDocPath?: string;
  error?: string;
  message?: string;
}

export interface RulesExtractionResponse {
  rules: AnyFormattingRules;
  confidence?: number;
  extractedElements?: string[];
}
