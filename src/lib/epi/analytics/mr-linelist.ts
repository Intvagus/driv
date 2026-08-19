import { CleanedRecord } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { KpiValue } from "@/types/epi/indicator";
import { DataQualityReport } from "@/types/epi/validation";
import { ThresholdOverrides, evaluateBand } from "../threshold-registry";
import { groupBy, pct, round1, toRankedItems } from "./helpers";

export function analyzeMrLinelist(
  records: CleanedRecord[],
  quality: DataQualityReport,
  overrides?: ThresholdOverrides,
): AnalysisResult {
  const total = records.length;
  const requiredFields = ["sex", "district", "vaccination_status"];
  const complete = records.filter((r) => requiredFields.every((f) => r[f] !== null && r[f] !== undefined && r[f] !== "")).length;
  const duplicateIssue = quality.issues.find((i) => i.ruleId === "DUP-EXACT");
  const duplicates = duplicateIssue?.affectedRecordCount ?? 0;
  const missing = total - complete;

  const byDistrict = groupBy(records, (r) => r.district as string | null);
  const vaccinatedTotal = records.filter((r) => r.vaccination_status === "Vaccinated").length;
  const districtBreakdown = [...byDistrict.entries()]
    .map(([district, rows]) => {
      const v = rows.filter((r) => r.vaccination_status === "Vaccinated").length;
      const value = round1(pct(v, rows.length));
      return { district, value, band: evaluateBand("coverage_pct", value, overrides).band };
    })
    .sort((a, b) => b.value - a.value);

  const byDate = groupBy(records, (r) => {
    const d = r.vaccination_date as string | null;
    return d ? d.slice(0, 7) : null;
  });
  const timeBreakdown = [...byDate.entries()].map(([period, rows]) => ({ period, value: rows.length })).sort((a, b) => a.period.localeCompare(b.period));

  const sexMap = new Map<string, number>();
  for (const r of records) {
    const s = (r.sex as string | null) ?? "Unknown";
    sexMap.set(s, (sexMap.get(s) ?? 0) + 1);
  }
  const vaxStatusMap = new Map<string, number>();
  for (const r of records) {
    const s = (r.vaccination_status as string | null) ?? "Unknown";
    vaxStatusMap.set(s, (vaxStatusMap.get(s) ?? 0) + 1);
  }

  const kpis: KpiValue[] = [
    { key: "total_records", label: "Total Records", value: total, format: "integer" },
    { key: "complete_records", label: "Complete Records", value: complete, format: "integer" },
    { key: "duplicates", label: "Duplicates", value: duplicates, format: "integer" },
    { key: "missing_data", label: "Missing Data", value: missing, format: "integer" },
    { key: "data_quality", label: "Data Quality", value: quality.overallScore, unit: "%", format: "percent", band: evaluateBand("data_quality_score", quality.overallScore, overrides).band, bandLabel: evaluateBand("data_quality_score", quality.overallScore, overrides).label },
    { key: "vaccinated_share", label: "Vaccinated (of records)", value: round1(pct(vaccinatedTotal, total)), unit: "%", format: "percent" },
  ];

  return {
    datasetId: "MR_LINELIST",
    recordCount: total,
    kpis,
    districtMetricLabel: "Vaccinated share",
    districtMetricUnit: "%",
    districtBreakdown,
    timeMetricLabel: "Records",
    timeBreakdown,
    categoryBreakdowns: [
      { dimensionKey: "sex", dimensionLabel: "Sex", items: toRankedItems(sexMap) },
      { dimensionKey: "vaccination_status", dimensionLabel: "Vaccination Status", items: toRankedItems(vaxStatusMap) },
    ],
    notes: [],
  };
}
