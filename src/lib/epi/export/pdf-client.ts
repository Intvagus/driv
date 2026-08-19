import { ReportModel } from "@/types/epi/report";
import { downloadBlob, slugify } from "./download";

/** Same privacy posture as exportDocx: only the aggregated report model is sent. */
export async function exportPdf(report: ReportModel) {
  const res = await fetch("/api/epi/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });
  if (!res.ok) throw new Error("PDF export failed. Please try again.");
  const blob = await res.blob();
  downloadBlob(blob, `${slugify(report.title)}.pdf`);
}
