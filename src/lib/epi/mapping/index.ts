import { CleanedDataset, CleanedRecord, ColumnMapping, DatasetTypeId, ParsedTable } from "@/types/epi/dataset";
import { getDatasetDefinition } from "../dataset-registry";
import { findBestHeaderMatch } from "../dataset-registry/matching";

/** Suggests a mapping from every system field of a dataset type to the best-matching uploaded header. */
export function suggestColumnMappings(datasetId: DatasetTypeId, headers: string[]): ColumnMapping[] {
  const def = getDatasetDefinition(datasetId);
  return def.columns.map((col) => {
    const match = findBestHeaderMatch(col, headers);
    return {
      systemField: col.key,
      uploadedHeader: match && match.confidence >= 0.5 ? match.header : null,
      confidence: match?.confidence ?? 0,
      isManualOverride: false,
    };
  });
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/,/g, "").replace(/%/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function coerceDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function coerceString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

/**
 * Applies a resolved column mapping to raw parsed rows, coercing values to
 * the declared type of each system field. Unmapped fields are omitted
 * (not fabricated) so downstream code can distinguish "missing" from "0".
 */
export function applyColumnMapping(
  table: ParsedTable,
  datasetId: DatasetTypeId,
  mappings: ColumnMapping[],
): CleanedDataset {
  const def = getDatasetDefinition(datasetId);
  const colByKey = new Map(def.columns.map((c) => [c.key, c]));

  const records: CleanedRecord[] = table.rows.map((row) => {
    const record: CleanedRecord = {};
    const invalidFields: string[] = [];
    for (const mapping of mappings) {
      if (!mapping.uploadedHeader) continue;
      const col = colByKey.get(mapping.systemField);
      if (!col) continue;
      const raw = row[mapping.uploadedHeader];
      const rawPresent = raw !== null && raw !== undefined && String(raw).trim() !== "";
      let coerced: unknown;
      switch (col.dataType) {
        case "number":
          coerced = coerceNumber(raw);
          break;
        case "date":
          coerced = coerceDate(raw);
          break;
        default:
          coerced = coerceString(raw);
      }
      if (rawPresent && coerced === null) invalidFields.push(mapping.systemField);
      record[mapping.systemField] = coerced;
    }
    record.__invalidFields = invalidFields;
    return record;
  });

  return {
    datasetId,
    mappings,
    records,
    sourceFileName: table.fileName,
    totalUploadedRows: table.rawRowCount,
  };
}

export function getMissingRequiredFields(datasetId: DatasetTypeId, mappings: ColumnMapping[]): string[] {
  const def = getDatasetDefinition(datasetId);
  const mappedFields = new Set(mappings.filter((m) => m.uploadedHeader).map((m) => m.systemField));
  return def.columns.filter((c) => c.required && !mappedFields.has(c.key)).map((c) => c.label);
}
