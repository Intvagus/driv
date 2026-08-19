import { CleanedDataset, CleanedRecord, ColumnMapping, DatasetTypeId, ParsedTable } from "@/types/epi/dataset";
import { getDatasetDefinition } from "../dataset-registry";
import { findAllHeaderMatches } from "../dataset-registry/matching";

const MIN_CONFIDENCE = 0.5;

/**
 * Suggests a mapping from every system field of a dataset type to the
 * best-matching uploaded header, using a global greedy assignment so a
 * single uploaded column is never auto-mapped to more than one system
 * field. Without this, a dataset with many similarly-named columns (e.g.
 * one per-antigen coverage % column) can collapse Target Population,
 * Vaccinated Population, Coverage, Dose etc. onto the same source column,
 * silently corrupting every downstream calculation.
 */
export function suggestColumnMappings(datasetId: DatasetTypeId, headers: string[]): ColumnMapping[] {
  const def = getDatasetDefinition(datasetId);

  type Candidate = { systemField: string; header: string; confidence: number; required: boolean };
  const candidates: Candidate[] = [];
  for (const col of def.columns) {
    for (const match of findAllHeaderMatches(col, headers)) {
      if (match.confidence >= MIN_CONFIDENCE) {
        candidates.push({ systemField: col.key, header: match.header, confidence: match.confidence, required: col.required });
      }
    }
  }

  // Required fields get first claim on a tied/near-tied header; otherwise strongest match wins.
  candidates.sort((a, b) => (Number(b.required) - Number(a.required)) || b.confidence - a.confidence);

  const assignedField = new Map<string, { header: string; confidence: number }>();
  const usedHeaders = new Set<string>();
  for (const c of candidates) {
    if (assignedField.has(c.systemField) || usedHeaders.has(c.header)) continue;
    assignedField.set(c.systemField, { header: c.header, confidence: c.confidence });
    usedHeaders.add(c.header);
  }

  return def.columns.map((col) => {
    const assigned = assignedField.get(col.key);
    return {
      systemField: col.key,
      uploadedHeader: assigned?.header ?? null,
      confidence: assigned?.confidence ?? 0,
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

/**
 * Fields still missing before analysis can proceed: every individually
 * required column, plus — if the dataset defines requiredAlternatives —
 * at least one alternative group must be fully mapped (e.g. Coverage
 * datasets need either a direct "coverage" column, or both Target and
 * Vaccinated Population; not necessarily all three).
 */
export function getMissingRequiredFields(datasetId: DatasetTypeId, mappings: ColumnMapping[]): string[] {
  const def = getDatasetDefinition(datasetId);
  const mappedFields = new Set(mappings.filter((m) => m.uploadedHeader).map((m) => m.systemField));
  const missing = def.columns.filter((c) => c.required && !mappedFields.has(c.key)).map((c) => c.label);

  if (def.requiredAlternatives && def.requiredAlternatives.length > 0) {
    const anySatisfied = def.requiredAlternatives.some((group) => group.every((key) => mappedFields.has(key)));
    if (!anySatisfied) {
      const groupDescriptions = def.requiredAlternatives.map((group) =>
        group.map((key) => def.columns.find((c) => c.key === key)?.label ?? key).join(" and "),
      );
      missing.push(`Either ${groupDescriptions.join(", or ")}`);
    }
  }

  return missing;
}
