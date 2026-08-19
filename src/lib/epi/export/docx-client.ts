import { ReportModel } from "@/types/epi/report";
import { downloadBlob, slugify } from "./download";

/**
 * Sends only the already-aggregated report model (KPIs, chart data, tables,
 * narrative text) to the server for Word generation. No per-record/patient
 * data is included — the report model never contains raw record rows
 * beyond the capped Annex sample the user has already reviewed on-screen.
 */
export async function exportDocx(report: ReportModel) {
  const res = await fetch("/api/epi/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });
  if (!res.ok) throw new Error("Word export failed. Please try again.");
  const blob = await res.blob();
  downloadBlob(blob, `${slugify(report.title)}.docx`);
}
