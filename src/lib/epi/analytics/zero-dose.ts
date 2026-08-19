import { CleanedRecord } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { KpiValue } from "@/types/epi/indicator";
import { round1, pct, groupBy, toRankedItems } from "./helpers";

export function analyzeZeroDose(records: CleanedRecord[]): AnalysisResult {
  const total = records.length;
  const zeroDose = records.filter((r) => r.zero_dose_status === "Zero-Dose").length;
  const defaulter = records.filter((r) => r.zero_dose_status === "Defaulter").length;
  const zeroDoseSharePct = round1(pct(zeroDose, total));

  const byDistrict = groupBy(records, (r) => r.district as string | null);
  const districtBreakdown = [...byDistrict.entries()]
    .map(([district, rows]) => ({ district, value: rows.filter((r) => r.zero_dose_status === "Zero-Dose").length }))
    .sort((a, b) => b.value - a.value);

  const byPeriod = groupBy(records, (r) => r.reporting_period as string | null);
  const timeBreakdown = [...byPeriod.entries()]
    .map(([period, rows]) => ({ period, value: rows.filter((r) => r.zero_dose_status === "Zero-Dose").length }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const sexMap = new Map<string, number>();
  const followUpMap = new Map<string, number>();
  for (const r of records) {
    if (r.zero_dose_status !== "Zero-Dose") continue;
    const s = (r.sex as string | null) ?? "Unknown";
    sexMap.set(s, (sexMap.get(s) ?? 0) + 1);
    const f = (r.follow_up_status as string | null) ?? "Not recorded";
    followUpMap.set(f, (followUpMap.get(f) ?? 0) + 1);
  }

  const kpis: KpiValue[] = [
    { key: "total_records", label: "Total Records", value: total, format: "integer" },
    { key: "zero_dose_count", label: "Zero-Dose Children", value: zeroDose, format: "integer" },
    { key: "defaulter_count", label: "Defaulters", value: defaulter, format: "integer" },
    { key: "zero_dose_share", label: "Zero-Dose Share (of records)", value: zeroDoseSharePct, unit: "%", format: "percent" },
    { key: "districts_reported", label: "Districts Reported", value: byDistrict.size, format: "integer" },
  ];

  return {
    datasetId: "ZERO_DOSE",
    recordCount: total,
    kpis,
    districtMetricLabel: "Zero-dose count",
    districtMetricUnit: "count",
    districtBreakdown,
    timeMetricLabel: "Zero-dose count",
    timeBreakdown,
    categoryBreakdowns: [
      { dimensionKey: "sex", dimensionLabel: "Sex (zero-dose)", items: toRankedItems(sexMap) },
      { dimensionKey: "follow_up_status", dimensionLabel: "Follow-up Status (zero-dose)", items: toRankedItems(followUpMap) },
    ],
    notes: ["This share reflects the uploaded dataset only; it is not necessarily zero-dose prevalence in the full target population unless the dataset represents the complete population."],
  };
}
