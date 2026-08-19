import { CleanedRecord } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { KpiValue } from "@/types/epi/indicator";
import { evaluateBand, ThresholdOverrides } from "../threshold-registry";
import { getGuidance } from "../guidance-registry";
import { groupBy, pct, round1, sumBy, toRankedItems } from "./helpers";

export function analyzeCoverage(records: CleanedRecord[], overrides?: ThresholdOverrides): AnalysisResult {
  const target = sumBy(records, "target_population");
  const vaccinated = sumBy(records, "vaccinated_population");
  const coveragePct = round1(pct(vaccinated, target));
  const coverageBand = evaluateBand("coverage_pct", coveragePct, overrides);

  const byDistrict = groupBy(records, (r) => r.district as string | null);
  const districtBreakdown = [...byDistrict.entries()]
    .map(([district, rows]) => {
      const t = sumBy(rows, "target_population");
      const v = sumBy(rows, "vaccinated_population");
      const value = round1(pct(v, t));
      return { district, value, target: 90, band: evaluateBand("coverage_pct", value, overrides).band };
    })
    .sort((a, b) => b.value - a.value);

  const lowCoverageAreas = districtBreakdown.filter((d) => d.band === "critical" || d.band === "needs_attention").length;

  const byPeriod = groupBy(records, (r) => r.reporting_period as string | null);
  const timeBreakdown = [...byPeriod.entries()]
    .map(([period, rows]) => ({ period, value: round1(pct(sumBy(rows, "vaccinated_population"), sumBy(rows, "target_population"))) }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const byAntigen = groupBy(records, (r) => r.antigen as string | null);
  const antigenItems = toRankedItems(
    new Map([...byAntigen.entries()].map(([label, rows]) => [label, round1(pct(sumBy(rows, "vaccinated_population"), sumBy(rows, "target_population")))])),
  );

  const kpis: KpiValue[] = [
    { key: "target_population", label: "Target Population", value: target, format: "integer", guidance: getGuidance("COVERAGE", "coverage_pct") },
    { key: "vaccinated_population", label: "Vaccinated Population", value: vaccinated, format: "integer" },
    { key: "coverage_pct", label: "Coverage", value: coveragePct, unit: "%", format: "percent", band: coverageBand.band, bandLabel: coverageBand.label, guidance: getGuidance("COVERAGE", "coverage_pct") },
    { key: "low_coverage_areas", label: "Low Coverage Areas", value: lowCoverageAreas, format: "integer" },
    { key: "districts_reported", label: "Districts Reported", value: byDistrict.size, format: "integer" },
  ];

  const notes: string[] = [];
  if (target === 0) notes.push("Target population totals to zero across all rows; coverage % could not be meaningfully calculated for some records.");

  return {
    datasetId: "COVERAGE",
    recordCount: records.length,
    kpis,
    districtMetricLabel: "Coverage",
    districtMetricUnit: "%",
    districtBreakdown,
    timeMetricLabel: "Coverage",
    timeBreakdown,
    categoryBreakdowns: [{ dimensionKey: "antigen", dimensionLabel: "Antigen", items: antigenItems }],
    notes,
  };
}
