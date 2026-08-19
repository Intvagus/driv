import { AnalysisResult } from "@/types/epi/analysis";
import { DataQualityReport } from "@/types/epi/validation";
import { ReportFinding } from "@/types/epi/report";
import { ThresholdOverrides, getThreshold } from "../threshold-registry";

const PRIMARY_PCT_KEYS = ["coverage_pct", "session_completion_pct", "vaccinated_share", "zero_dose_share"];

let counter = 0;
function nextId(): string {
  counter += 1;
  return `finding-${counter}`;
}

function fmtUnit(value: number | string, unit?: string): string {
  if (typeof value !== "number") return String(value);
  return unit === "%" ? `${value.toFixed(1)}%` : value.toLocaleString();
}

/**
 * Generates findings strictly from computed values in `analysis` and
 * `quality` — never invented. Every sentence traces back to a specific
 * number already present in the KPI set, district/time/category
 * breakdowns, or the data-quality report.
 */
export function buildFindings(
  analysis: AnalysisResult,
  quality: DataQualityReport,
  overrides?: ThresholdOverrides,
): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const push = (text: string) => findings.push({ id: nextId(), text, editable: true });

  const primaryKpi = analysis.kpis.find((k) => PRIMARY_PCT_KEYS.includes(k.key));
  if (primaryKpi && typeof primaryKpi.value === "number") {
    push(`Overall ${primaryKpi.label.toLowerCase()} was ${fmtUnit(primaryKpi.value, primaryKpi.unit)}.`);
  }

  if (analysis.districtBreakdown.length >= 2) {
    const sorted = [...analysis.districtBreakdown].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    push(`${highest.district} had the highest reported ${analysis.districtMetricLabel.toLowerCase()} (${fmtUnit(highest.value, analysis.districtMetricUnit)}).`);
    push(`${lowest.district} had the lowest reported ${analysis.districtMetricLabel.toLowerCase()} (${fmtUnit(lowest.value, analysis.districtMetricUnit)}).`);
  }

  const firstCategory = analysis.categoryBreakdowns.find((c) => c.items.length >= 2);
  if (firstCategory) {
    const sorted = [...firstCategory.items].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    if (top.label !== bottom.label) {
      push(
        `The largest gap across ${firstCategory.dimensionLabel.toLowerCase()} categories was between ${top.label} (${top.value.toLocaleString()}) and ${bottom.label} (${bottom.value.toLocaleString()}).`,
      );
    }
  }

  const completeness = quality.dimensions.find((d) => d.dimension === "completeness");
  if (completeness) {
    push(`Data completeness was ${completeness.score.toFixed(1)}%.`);
  }

  const indicatorKey = analysis.kpis.find((k) => k.band !== undefined)?.key;
  if (indicatorKey) {
    const threshold = getThreshold(indicatorKey, overrides);
    if (threshold.configured) {
      const belowCount = analysis.districtBreakdown.filter((d) => d.band === "critical" || d.band === "needs_attention").length;
      if (belowCount > 0) {
        push(
          `${belowCount} of ${analysis.districtBreakdown.length} districts were below the configured threshold for ${analysis.districtMetricLabel.toLowerCase()} (source: ${threshold.source}).`,
        );
      }
    }
  }

  const criticalIssues = quality.issues.filter((i) => i.severity === "critical");
  if (criticalIssues.length > 0) {
    const affected = criticalIssues.reduce((s, i) => s + i.affectedRecordCount, 0);
    push(`${criticalIssues.length} critical data-quality issue(s) were identified, affecting ${affected} record(s) in total.`);
  }

  return findings;
}
