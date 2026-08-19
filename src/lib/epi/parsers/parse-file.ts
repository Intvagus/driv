import * as XLSX from "xlsx";
import { ParsedTable } from "@/types/epi/dataset";

const SUPPORTED_EXTENSIONS = ["csv", "xls", "xlsx", "htm", "html"];

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isSupportedFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.includes(getFileExtension(fileName));
}

/** Fills merged-cell ranges so every covered cell carries the top-left value. */
function expandMerges(sheet: XLSX.WorkSheet): void {
  const merges = sheet["!merges"];
  if (!merges) return;
  for (const range of merges) {
    const anchor = sheet[XLSX.utils.encode_cell(range.s)];
    if (!anchor) continue;
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!sheet[addr]) sheet[addr] = { ...anchor };
      }
    }
  }
}

function isRowBlank(row: unknown[]): boolean {
  return row.every((cell) => cell === null || cell === undefined || String(cell).trim() === "");
}

/** Finds the most likely header row within the first N rows of a raw AOA sheet. */
function findHeaderRowIndex(aoa: unknown[][]): number {
  const scanLimit = Math.min(aoa.length, 15);
  for (let i = 0; i < scanLimit; i++) {
    const row = aoa[i];
    if (!row || isRowBlank(row)) continue;
    const nonBlank = row.filter((c) => c !== null && c !== undefined && String(c).trim() !== "");
    const stringCells = nonBlank.filter((c) => typeof c === "string" && Number.isNaN(Number(c)));
    if (nonBlank.length >= 2 && stringCells.length / nonBlank.length >= 0.6) {
      return i;
    }
  }
  return 0;
}

function sheetToParsedTable(sheet: XLSX.WorkSheet, fileName: string, sheetName?: string): ParsedTable | null {
  expandMerges(sheet);
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, blankrows: false, raw: true });
  if (aoa.length === 0) return null;

  const headerIdx = findHeaderRowIndex(aoa);
  const rawHeaders = (aoa[headerIdx] ?? []).map((h) => (h === null || h === undefined ? "" : String(h).trim()));
  const headers: string[] = [];
  const seen = new Map<string, number>();
  for (const h of rawHeaders) {
    const base = h || `Column ${headers.length + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headers.push(count === 0 ? base : `${base} (${count + 1})`);
  }

  const dataRows = aoa.slice(headerIdx + 1).filter((row) => row && !isRowBlank(row));
  const rows = dataRows.map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const val = row[i];
      record[h] = val === undefined ? null : val;
    });
    return record;
  });

  return {
    fileName,
    sheetName,
    headers,
    rows,
    rawRowCount: aoa.length - headerIdx - 1,
  };
}

/**
 * Parses CSV / XLS / XLSX / HTML table uploads into one ParsedTable per
 * non-empty sheet (or per <table> element for HTML). Runs entirely
 * client-side — the file never leaves the browser.
 */
export async function parseUploadedFile(file: File): Promise<ParsedTable[]> {
  const ext = getFileExtension(file.name);
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported file type ".${ext}". Supported: ${SUPPORTED_EXTENSIONS.join(", ")}.`);
  }

  if (ext === "htm" || ext === "html") {
    return parseHtmlFile(file);
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const tables: ParsedTable[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const table = sheetToParsedTable(sheet, file.name, workbook.SheetNames.length > 1 ? sheetName : undefined);
    if (table && table.rows.length > 0) tables.push(table);
  }

  if (tables.length === 0) {
    throw new Error("No data rows could be found in this file. Check that it contains a header row and at least one data row.");
  }
  return tables;
}

async function parseHtmlFile(file: File): Promise<ParsedTable[]> {
  const text = await file.text();
  const doc = new DOMParser().parseFromString(text, "text/html");
  const tableEls = Array.from(doc.querySelectorAll("table"));
  if (tableEls.length === 0) {
    throw new Error("No <table> elements were found in this HTML file.");
  }

  const tables: ParsedTable[] = [];
  tableEls.forEach((tableEl, idx) => {
    const aoa: string[][] = [];
    const rowEls = Array.from(tableEl.querySelectorAll("tr"));
    for (const rowEl of rowEls) {
      const cellEls = Array.from(rowEl.querySelectorAll("th,td"));
      aoa.push(cellEls.map((c) => c.textContent?.trim() ?? ""));
    }
    if (aoa.length === 0) return;
    const headerIdx = findHeaderRowIndex(aoa);
    const rawHeaders = aoa[headerIdx] ?? [];
    const headers = rawHeaders.map((h, i) => h || `Column ${i + 1}`);
    const dataRows = aoa.slice(headerIdx + 1).filter((r) => !isRowBlank(r));
    const rows = dataRows.map((row) => {
      const record: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        record[h] = row[i] ?? null;
      });
      return record;
    });
    if (rows.length > 0) {
      tables.push({
        fileName: file.name,
        sheetName: tableEls.length > 1 ? `Table ${idx + 1}` : undefined,
        headers,
        rows,
        rawRowCount: dataRows.length,
      });
    }
  });

  if (tables.length === 0) {
    throw new Error("HTML tables were found but none contained usable data rows.");
  }
  return tables;
}
