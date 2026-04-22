// Type definitions untuk sistem formatter

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

export interface UploadedFile {
  name: string;
  type: "pdf" | "docx";
  content: Buffer | string;
  text?: string;
}

export interface ProcessingResult {
  success: boolean;
  rules?: FormattingRules;
  formattedDocPath?: string;
  error?: string;
  message?: string;
}

export interface RulesExtractionResponse {
  rules: FormattingRules;
  confidence?: number;
  extractedElements?: string[];
}
