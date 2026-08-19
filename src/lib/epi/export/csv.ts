import { CleanedDataset } from "@/types/epi/dataset";
import { getDatasetDefinition } from "../dataset-registry";
import { downloadBlob, slugify } from "./download";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Exports the cleaned dataset as CSV entirely client-side — no data leaves the browser. */
export function exportCsv(cleaned: CleanedDataset) {
  const def = getDatasetDefinition(cleaned.datasetId);
  const cols = def.columns.filter((c) => cleaned.mappings.some((m) => m.systemField === c.key && m.uploadedHeader));
  const header = cols.map((c) => csvEscape(c.label)).join(",");
  const rows = cleaned.records.map((r) => cols.map((c) => csvEscape(r[c.key])).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `${slugify(def.name)}-clean-data.csv`);
}
