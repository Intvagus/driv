import ExcelJS from "exceljs";
import { ReportModel } from "@/types/epi/report";
import { CleanedDataset } from "@/types/epi/dataset";
import { getDatasetDefinition } from "../dataset-registry";
import { downloadBlob, slugify } from "./download";

/** Builds a genuine editable multi-sheet workbook entirely client-side. */
export async function exportXlsx(report: ReportModel, cleaned: CleanedDataset) {
  const wb = new ExcelJS.Workbook();
  wb.creator = report.preparedBy || "EPI Data Analytics Platform";
  wb.created = new Date();

  const summary = wb.addWorksheet("Summary");
  summary.columns = [{ width: 28 }, { width: 60 }];
  summary.addRows([
    ["Report title", report.title],
    ["Organization", report.organization],
    ["Programme", report.programme],
    ["Dataset", report.provenance.datasetLabel],
    ["Reporting period", report.provenance.reportingPeriod],
    ["Records", report.provenance.recordCount],
    ["Analysis date", report.provenance.analysisDate],
    ["Data quality — overall score (%)", report.dataQuality.overallScore],
    [],
    ["Key Findings"],
    ...report.findings.map((f, i) => [`${i + 1}.`, f.text]),
    [],
    ["Recommendations"],
    ...report.recommendations.map((r, i) => [`${i + 1}.`, r.text]),
  ]);
  summary.getRow(1).font = { bold: true };

  const kpiSheet = wb.addWorksheet("KPI Calculations");
  const kpiSection = report.sections.find((s) => s.type === "kpi_dashboard");
  kpiSheet.columns = [{ header: "Indicator", width: 30 }, { header: "Value", width: 16 }, { header: "Unit", width: 10 }, { header: "Definition", width: 50 }, { header: "Calculation", width: 50 }];
  kpiSheet.addRow(["Indicator", "Value", "Unit", "Definition", "Calculation"]).font = { bold: true };
  for (const k of kpiSection?.kpis ?? []) {
    kpiSheet.addRow([k.label, k.value, k.unit ?? "", k.guidance?.definition ?? "", k.guidance?.calculationMethod ?? ""]);
  }

  const def = getDatasetDefinition(cleaned.datasetId);
  const dataSheet = wb.addWorksheet("Clean Data");
  const cols = def.columns.filter((c) => cleaned.mappings.some((m) => m.systemField === c.key && m.uploadedHeader));
  dataSheet.columns = cols.map((c) => ({ header: c.label, key: c.key, width: 18 }));
  dataSheet.getRow(1).font = { bold: true };
  for (const r of cleaned.records) {
    dataSheet.addRow(cols.map((c) => (r[c.key] as string | number | null) ?? ""));
  }

  const qualitySheet = wb.addWorksheet("Data Quality Issues");
  qualitySheet.columns = [
    { header: "Rule", key: "ruleId", width: 26 },
    { header: "Category", key: "category", width: 16 },
    { header: "Description", key: "description", width: 50 },
    { header: "Severity", key: "severity", width: 12 },
    { header: "Affected Records", key: "affectedRecordCount", width: 16 },
    { header: "Recommended Action", key: "recommendedAction", width: 50 },
  ];
  qualitySheet.getRow(1).font = { bold: true };
  for (const i of report.dataQuality.issues) {
    qualitySheet.addRow(i);
  }

  const geoSection = report.sections.find((s) => s.type === "geographic_analysis");
  const geoTable = geoSection?.tables?.[0];
  if (geoTable) {
    const geoSheet = wb.addWorksheet("District Analysis");
    geoSheet.columns = geoTable.columns.map((c) => ({ header: c.label, key: c.key, width: 22 }));
    geoSheet.getRow(1).font = { bold: true };
    for (const row of geoTable.rows) geoSheet.addRow(row);
  }

  const trendSection = report.sections.find((s) => s.type === "trends");
  const trendChart = trendSection?.charts?.[0];
  if (trendChart) {
    const trendSheet = wb.addWorksheet("Trend Analysis");
    trendSheet.columns = [{ header: "Period", key: "period", width: 18 }, { header: trendChart.title, key: "value", width: 18 }];
    trendSheet.getRow(1).font = { bold: true };
    for (const p of trendChart.data) trendSheet.addRow({ period: p.label, value: p.value });
  }

  const buffer = await wb.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${slugify(report.title)}.xlsx`);
}
