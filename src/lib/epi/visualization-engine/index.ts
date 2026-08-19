import { AnalysisResult } from "@/types/epi/analysis";
import { ChartSpec, TableSpec } from "@/types/epi/visualization";
import { DataQualityReport } from "@/types/epi/validation";

export interface VizMeta {
  datasetLabel: string;
  period: string;
  sourceLabel: string;
}

function sourceNote(meta: VizMeta): string {
  return `Source: ${meta.sourceLabel}. Reporting period: ${meta.period}.`;
}

/**
 * Visualization Recommendation Engine: given an AnalysisResult, decides
 * which chart kinds actually communicate each relationship in the data
 * (trend → line, comparison → ranked bars, composition → bars, target vs
 * achievement → gauge/gap) rather than choosing charts for decoration.
 */
export function buildVisualizations(analysis: AnalysisResult, meta: VizMeta): { charts: ChartSpec[]; tables: TableSpec[] } {
  const charts: ChartSpec[] = [];
  const tables: TableSpec[] = [];

  // Target -> Achieved -> Coverage funnel infographic (communicates the headline
  // number before the reader reaches any chart, per the "infographic -> chart ->
  // table -> exact values" pattern).
  const target = analysis.kpis.find((k) => k.key === "target_population");
  const vaccinated = analysis.kpis.find((k) => k.key === "vaccinated_population");
  const coveragePct = analysis.kpis.find((k) => k.key === "coverage_pct");
  if (target && vaccinated && coveragePct && typeof target.value === "number" && typeof vaccinated.value === "number" && typeof coveragePct.value === "number") {
    charts.push({
      id: "coverage-flow",
      kind: "coverage_flow",
      title: `Coverage, ${meta.period}`,
      data: [
        { label: "Target Population", value: target.value },
        { label: "Vaccinated Population", value: vaccinated.value },
        { label: "Coverage", value: coveragePct.value },
      ],
      sourceNote: sourceNote(meta),
      rationale: "A flow infographic communicates the headline target-to-coverage relationship before the reader reaches the detailed chart and table below.",
    });
  }

  // District ranking infographic -> highlights top and priority (lowest/flagged)
  // performers together, ahead of the full ranked bar chart.
  if (analysis.districtBreakdown.length > 3) {
    charts.push({
      id: "district-ranking",
      kind: "ranked_leaderboard",
      title: `District ranking — top and priority districts, ${meta.period}`,
      unit: analysis.districtMetricUnit,
      data: analysis.districtBreakdown.map((d) => ({
        label: d.district,
        value: d.value,
        flagged: d.band === "critical" || d.band === "needs_attention",
      })),
      sourceNote: sourceNote(meta),
      rationale: "Highlighting the strongest and weakest districts together draws attention to where programme action is most needed, before the full ranked comparison below.",
    });
  }

  // Geographic comparison -> ranked horizontal bars (per WHO guidance: avoid pie/donut for comparison).
  if (analysis.districtBreakdown.length > 0) {
    charts.push({
      id: "district-comparison",
      kind: "bar_horizontal",
      title: `${analysis.districtMetricLabel} by district, ${meta.period}`,
      unit: analysis.districtMetricUnit,
      data: analysis.districtBreakdown.map((d) => ({
        label: d.district,
        value: d.value,
        flagged: d.band === "critical" || d.band === "needs_attention",
      })),
      sourceNote: sourceNote(meta),
      rationale: "Ranked horizontal bars support comparing many districts more clearly than a pie/donut chart would.",
    });

    tables.push({
      id: "district-table",
      title: `${analysis.districtMetricLabel} by district — exact values`,
      columns: [
        { key: "district", label: "District", align: "left" },
        { key: "value", label: analysis.districtMetricLabel, align: "right", format: analysis.districtMetricUnit === "%" ? "percent" : "integer" },
      ],
      rows: analysis.districtBreakdown.map((d) => ({ district: d.district, value: d.value })),
      sourceNote: sourceNote(meta),
    });
  }

  // Trend over time -> line chart (needs at least 2 points to show a trend).
  if (analysis.timeBreakdown.length >= 2) {
    charts.push({
      id: "trend",
      kind: "line",
      title: `${analysis.timeMetricLabel} trend, ${meta.period}`,
      data: analysis.timeBreakdown.map((t) => ({ label: t.period, value: t.value })),
      sourceNote: sourceNote(meta),
      rationale: "A line chart is used because the analytical question concerns change over time, not a single-point comparison.",
    });
  } else if (analysis.timeBreakdown.length === 1) {
    tables.push({
      id: "single-period-note",
      title: "Reporting period",
      columns: [
        { key: "period", label: "Period", align: "left" },
        { key: "value", label: analysis.timeMetricLabel, align: "right", format: "integer" },
      ],
      rows: analysis.timeBreakdown.map((t) => ({ period: t.period, value: t.value })),
      sourceNote: "Only one reporting period is present in this dataset; a trend chart requires two or more periods.",
    });
  }

  // Composition -> bar chart per category dimension.
  for (const cb of analysis.categoryBreakdowns) {
    if (cb.items.length === 0) continue;
    charts.push({
      id: `composition-${cb.dimensionKey}`,
      kind: cb.items.length > 6 ? "bar_horizontal" : "bar_vertical",
      title: `${cb.dimensionLabel} distribution, ${meta.period}`,
      data: cb.items.map((i) => ({ label: i.label, value: i.value })),
      sourceNote: sourceNote(meta),
      rationale: `A bar chart shows the composition of ${cb.dimensionLabel.toLowerCase()} without the comparison distortion pie charts introduce.`,
    });
  }

  // Target vs achievement -> gauge/gap, when the KPI set includes a percent-of-target indicator.
  const pctKpi = analysis.kpis.find((k) => k.key === "coverage_pct" || k.key === "session_completion_pct");
  if (pctKpi && typeof pctKpi.value === "number") {
    charts.push({
      id: "target-gap",
      kind: "gauge_gap",
      title: `${pctKpi.label} vs target, ${meta.period}`,
      unit: "%",
      data: [{ label: "Achieved", value: pctKpi.value, reference: 100 }],
      sourceNote: sourceNote(meta),
      rationale: "A target/achievement gap visualization is used because the analytical question is about performance against a defined target, not a ranked comparison.",
    });
  }

  return { charts, tables };
}

export function buildDataQualityChart(quality: DataQualityReport, meta: VizMeta): ChartSpec {
  return {
    id: "data-quality",
    kind: "bar_horizontal",
    title: `Data quality assessment, ${meta.period}`,
    unit: "%",
    data: quality.dimensions.map((d) => ({
      label: d.dimension.charAt(0).toUpperCase() + d.dimension.slice(1),
      value: d.score,
      flagged: d.score < 80,
    })),
    sourceNote: `Source: ${meta.sourceLabel}. ${quality.methodologyNote}`,
    rationale: "A labelled bar per dimension keeps each data-quality component individually legible, rather than collapsing them into one decorative gauge.",
  };
}
