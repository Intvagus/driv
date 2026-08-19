// Core dataset architecture types for the EPI Data Analytics Platform.

export type DatasetTypeId =
  | "MR_LINELIST"
  | "COVERAGE"
  | "SESSION_MONITORING"
  | "ZERO_DOSE"
  | "DEFAULTER"
  | "AEFI"
  | "STOCK"
  | "ROUTINE_IMMUNIZATION"
  | "VPD_SURVEILLANCE";

/** A raw parsed spreadsheet/table: header row + string-keyed record rows. */
export interface ParsedTable {
  fileName: string;
  sheetName?: string;
  headers: string[];
  rows: Record<string, unknown>[];
  /** Row count before any cleaning (e.g. blank-row removal). */
  rawRowCount: number;
}

export type ColumnDataType = "string" | "number" | "date" | "boolean" | "category";

/** Definition of one logical field a dataset type cares about (e.g. "District"). */
export interface ColumnDefinition {
  /** Canonical system field key, e.g. "district". */
  key: string;
  /** Human label, e.g. "District". */
  label: string;
  required: boolean;
  dataType: ColumnDataType;
  /** Case-insensitive header aliases used for auto-mapping. */
  aliases: string[];
  description?: string;
  /** Allowed categorical values, if dataType === "category". */
  allowedValues?: string[];
}

/** A resolved mapping from an uploaded header to a system field. */
export interface ColumnMapping {
  systemField: string;
  uploadedHeader: string | null;
  confidence: number; // 0-1
  isManualOverride: boolean;
}

export interface DatasetDetectionRule {
  /** System field keys that, if present, strongly indicate this dataset type. */
  strongSignals: string[];
  /** System field keys that provide weaker supporting evidence. */
  supportingSignals: string[];
}

/** Everything the registry needs to know to detect, validate, analyze and report a dataset type. */
export interface DatasetDefinition {
  id: DatasetTypeId;
  name: string;
  description: string;
  status: "supported" | "coming_soon";
  detection: DatasetDetectionRule;
  columns: ColumnDefinition[];
  reportSections: string[];
}

export interface DatasetDetectionCandidate {
  datasetId: DatasetTypeId;
  name: string;
  confidence: number; // 0-1
  matchedFields: { key: string; label: string; matched: boolean }[];
}

export interface DetectionResult {
  candidates: DatasetDetectionCandidate[];
  best: DatasetDetectionCandidate | null;
  isConfident: boolean; // true if best.confidence >= CONFIDENCE_THRESHOLD
}

/** A single row after cleaning: raw values keyed by canonical system field. */
export type CleanedRecord = Record<string, unknown>;

export interface CleanedDataset {
  datasetId: DatasetTypeId;
  mappings: ColumnMapping[];
  records: CleanedRecord[];
  sourceFileName: string;
  totalUploadedRows: number;
}
