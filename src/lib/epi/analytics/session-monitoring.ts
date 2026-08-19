import { CleanedRecord } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { KpiValue } from "@/types/epi/indicator";
import { ThresholdOverrides, evaluateBand } from "../threshold-registry";
import { groupBy, pct, round1, sumBy, toRankedItems } from "./helpers";

export function analyzeSessionMonitoring(records: CleanedRecord[], overrides?: ThresholdOverrides): AnalysisResult {
  const planned = sumBy(records, "planned_sessions");
  const conducted = sumBy(records, "conducted_sessions");
  const cancelled = sumBy(records, "cancelled_sessions");
  const completionPct = round1(pct(conducted, planned));
  const band = evaluateBand("session_completion_pct", completionPct, overrides);

  const byDistrict = groupBy(records, (r) => r.district as string | null);
  const districtBreakdown = [...byDistrict.entries()]
    .map(([district, rows]) => {
      const value = round1(pct(sumBy(rows, "conducted_sessions"), sumBy(rows, "planned_sessions")));
      return { district, value, band: evaluateBand("session_completion_pct", value, overrides).band };
    })
    .sort((a, b) => b.value - a.value);

  const byPeriod = groupBy(records, (r) => r.reporting_period as string | null);
  const timeBreakdown = [...byPeriod.entries()]
    .map(([period, rows]) => ({ period, value: round1(pct(sumBy(rows, "conducted_sessions"), sumBy(rows, "planned_sessions"))) }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const typeMap = new Map<string, number>();
  for (const r of records) {
    const t = (r.session_type as string | null) ?? "Unspecified";
    typeMap.set(t, (typeMap.get(t) ?? 0) + ((r.conducted_sessions as number | null) ?? 0));
  }
  const reasonMap = new Map<string, number>();
  for (const r of records) {
    if (!r.cancellation_reason) continue;
    const reason = r.cancellation_reason as string;
    reasonMap.set(reason, (reasonMap.get(reason) ?? 0) + 1);
  }

  const kpis: KpiValue[] = [
    { key: "planned_sessions", label: "Planned Sessions", value: planned, format: "integer" },
    { key: "conducted_sessions", label: "Conducted Sessions", value: conducted, format: "integer" },
    { key: "cancelled_sessions", label: "Cancelled Sessions", value: cancelled, format: "integer" },
    { key: "session_completion_pct", label: "Session Completion", value: completionPct, unit: "%", format: "percent", band: band.band, bandLabel: band.label },
  ];

  return {
    datasetId: "SESSION_MONITORING",
    recordCount: records.length,
    kpis,
    districtMetricLabel: "Session completion",
    districtMetricUnit: "%",
    districtBreakdown,
    timeMetricLabel: "Session completion",
    timeBreakdown,
    categoryBreakdowns: [
      { dimensionKey: "session_type", dimensionLabel: "Session Type (conducted)", items: toRankedItems(typeMap) },
      { dimensionKey: "cancellation_reason", dimensionLabel: "Cancellation Reasons", items: toRankedItems(reasonMap) },
    ],
    notes: [],
  };
}
