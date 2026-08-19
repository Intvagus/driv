import { CleanedRecord } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { KpiValue } from "@/types/epi/indicator";
import { evaluateBand, ThresholdOverrides } from "../threshold-registry";
import { getGuidance } from "../guidance-registry";
import { avgBy, groupBy, pct, round1, sumBy, toRankedItems } from "./helpers";

export function analyzeCoverage(records: CleanedRecord[], overrides?: ThresholdOverrides): AnalysisResult {
  const target = sumBy(records, "target_population");
  const vaccinated = sumBy(records, "vaccinated_population");
  // Some datasets only supply a pre-computed coverage % per row (no raw
  // Target/Vaccinated counts) — e.g. wide-format facility exports. When
  // that's the case, derive coverage as the mean of reported values
  // instead of fabricating counts that were never in the source data.
  const hasCounts = target > 0;

  const coveragePct = hasCounts ? round1(pct(vaccinated, target)) : round1(avgBy(records, "coverage") ?? 0);
  const coverageBand = evaluateBand("coverage_pct", coveragePct, overrides);

  const byDistrict = groupBy(records, (r) => r.district as string | null);
  const districtBreakdown = [...byDistrict.entries()]
    .map(([district, rows]) => {
      const value = hasCounts ? round1(pct(sumBy(rows, "vaccinated_population"), sumBy(rows, "target_population"))) : round1(avgBy(rows, "coverage") ?? 0);
      return { district, value, target: 90, band: evaluateBand("coverage_pct", value, overrides).band };
    })
    .sort((a, b) => b.value - a.value);

  const lowCoverageAreas = districtBreakdown.filter((d) => d.band === "critical" || d.band === "needs_attention").length;

  const byPeriod = groupBy(records, (r) => r.reporting_period as string | null);
  const timeBreakdown = [...byPeriod.entries()]
    .map(([period, rows]) => ({
      period,
      value: hasCounts ? round1(pct(sumBy(rows, "vaccinated_population"), sumBy(rows, "target_population"))) : round1(avgBy(rows, "coverage") ?? 0),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const byAntigen = groupBy(records, (r) => r.antigen as string | null);
  const antigenItems = toRankedItems(
    new Map(
      [...byAntigen.entries()].map(([label, rows]) => [
        label,
        hasCounts ? round1(pct(sumBy(rows, "vaccinated_population"), sumBy(rows, "target_population"))) : round1(avgBy(rows, "coverage") ?? 0),
      ]),
    ),
  );

  const kpis: KpiValue[] = hasCounts
    ? [
        { key: "target_population", label: "Target Population", value: target, format: "integer", guidance: getGuidance("COVERAGE", "coverage_pct") },
        { key: "vaccinated_population", label: "Vaccinated Population", value: vaccinated, format: "integer" },
        { key: "coverage_pct", label: "Coverage", value: coveragePct, unit: "%", format: "percent", band: coverageBand.band, bandLabel: coverageBand.label, guidance: getGuidance("COVERAGE", "coverage_pct") },
        { key: "low_coverage_areas", label: "Low Coverage Areas", value: lowCoverageAreas, format: "integer" },
        { key: "districts_reported", label: "Districts Reported", value: byDistrict.size, format: "integer" },
      ]
    : [
        { key: "coverage_pct", label: "Average Coverage", value: coveragePct, unit: "%", format: "percent", band: coverageBand.band, bandLabel: coverageBand.label, guidance: getGuidance("COVERAGE", "coverage_pct") },
        { key: "low_coverage_areas", label: "Low Coverage Areas", value: lowCoverageAreas, format: "integer" },
        { key: "districts_reported", label: "Districts Reported", value: byDistrict.size, format: "integer" },
        { key: "record_count", label: "Records", value: records.length, format: "integer" },
      ];

  const notes: string[] = [];
  if (!hasCounts) {
    notes.push(
      "This dataset did not include Target Population and Vaccinated Population counts, only a pre-computed coverage percentage per record. Coverage figures above are simple (unweighted) averages of those percentages, not a population-weighted calculation — districts or antigens with more records are not proportionally represented.",
    );
  }

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
