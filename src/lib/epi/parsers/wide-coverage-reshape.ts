import { ParsedTable } from "@/types/epi/dataset";

const ANTIGEN_SUFFIX_PATTERN = /^(.+?)\s*%$/;
const COVERAGE_SUFFIX_PATTERN = /^(.+?)\s+coverage$/i;
const EXCLUDED_PREFIXES = new Set(["total", "overall", "grand total", "coverage", "average", "avg", "grand", "combined", "fic"]);

function extractAntigenName(header: string): string | null {
  const trimmed = header.trim();
  const match = ANTIGEN_SUFFIX_PATTERN.exec(trimmed) ?? COVERAGE_SUFFIX_PATTERN.exec(trimmed);
  if (!match) return null;
  const name = match[1].trim();
  if (!name || EXCLUDED_PREFIXES.has(name.toLowerCase())) return null;
  return name;
}

export interface WideCoverageDetection {
  isWideFormat: boolean;
  antigenColumns: { header: string; antigen: string }[];
  idColumns: string[];
}

/**
 * Detects a "wide" coverage export: one row per geography/facility with a
 * separate coverage-percentage column per antigen (e.g. "BCG %", "Penta1 %",
 * "Measles2 %") rather than the long format (one row per geography+antigen
 * with Target/Vaccinated Population columns) the Coverage module expects.
 */
export function detectWideCoverageFormat(table: ParsedTable): WideCoverageDetection {
  const antigenColumns = table.headers
    .map((header) => ({ header, antigen: extractAntigenName(header) }))
    .filter((c): c is { header: string; antigen: string } => c.antigen !== null);
  const idColumns = table.headers.filter((h) => !antigenColumns.some((a) => a.header === h));
  return {
    isWideFormat: antigenColumns.length >= 2 && idColumns.length >= 1,
    antigenColumns,
    idColumns,
  };
}

const MONTH_NAMES = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December";

/** Best-effort guess of a reporting period from the file name (e.g. "Dec 2025 Coverage.xlsx" -> "Dec 2025"). */
export function guessReportingPeriod(fileName: string): string {
  const monthYear = new RegExp(`(${MONTH_NAMES})\\.?\\s?['-]?\\s?(\\d{4}|\\d{2})`, "i").exec(fileName);
  if (monthYear) return `${monthYear[1]} ${monthYear[2].length === 2 ? `20${monthYear[2]}` : monthYear[2]}`;
  const isoMonth = /(\d{4})[-_](\d{2})(?!\d)/.exec(fileName);
  if (isoMonth) return `${isoMonth[1]}-${isoMonth[2]}`;
  const year = /\b(20\d{2})\b/.exec(fileName);
  if (year) return year[1];
  return "";
}

/**
 * Reshapes a wide per-antigen coverage table into the long format the
 * Coverage module expects: one row per geography+antigen. Blank cells are
 * skipped, never fabricated as zero. Reporting period is a single value
 * supplied by the caller since wide exports of this kind rarely carry a
 * per-row period column.
 */
export function reshapeWideCoverage(table: ParsedTable, detection: WideCoverageDetection, reportingPeriod: string): ParsedTable {
  const headers = [...detection.idColumns, "Antigen", "Coverage %", "Reporting Period"];
  const rows: Record<string, unknown>[] = [];

  for (const row of table.rows) {
    for (const { header, antigen } of detection.antigenColumns) {
      const value = row[header];
      if (value === null || value === undefined || value === "") continue;
      const newRow: Record<string, unknown> = {};
      for (const id of detection.idColumns) newRow[id] = row[id];
      newRow.Antigen = antigen;
      newRow["Coverage %"] = value;
      newRow["Reporting Period"] = reportingPeriod;
      rows.push(newRow);
    }
  }

  return {
    fileName: table.fileName,
    sheetName: table.sheetName,
    headers,
    rows,
    rawRowCount: rows.length,
  };
}
