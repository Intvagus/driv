import { AnalysisResult } from "@/types/epi/analysis";
import { DataQualityReport } from "@/types/epi/validation";
import { ReportRecommendation } from "@/types/epi/report";
import { ThresholdOverrides, getThreshold } from "../threshold-registry";

let counter = 0;
function nextId(): string {
  counter += 1;
  return `rec-${counter}`;
}

/**
 * Generates recommendations tied to specific evidence (a threshold breach, a
 * data-quality issue), using cautious non-causal language. Never claims the
 * data proves a cause.
 */
export function buildRecommendations(
  analysis: AnalysisResult,
  quality: DataQualityReport,
  overrides?: ThresholdOverrides,
): ReportRecommendation[] {
  const recs: ReportRecommendation[] = [];
  const push = (findingRef: string, text: string) => recs.push({ id: nextId(), findingRef, text, editable: true });

  const indicatorKey = analysis.kpis.find((k) => k.band !== undefined)?.key;
  if (indicatorKey) {
    const threshold = getThreshold(indicatorKey, overrides);
    if (threshold.configured) {
      const critical = [...analysis.districtBreakdown]
        .filter((d) => d.band === "critical")
        .sort((a, b) => a.value - b.value)
        .slice(0, 5);
      for (const d of critical) {
        push(
          "district-threshold",
          `${d.district} had ${analysis.districtMetricLabel.toLowerCase()} of ${d.value}${analysis.districtMetricUnit === "%" ? "%" : ""}, below the configured threshold (source: ${threshold.source}). This may indicate access, demand, or reporting-related barriers and requires further investigation; prioritize ${d.district} for programme review.`,
        );
      }
    } else {
      push(
        "no-threshold",
        `No threshold is currently configured for ${analysis.districtMetricLabel.toLowerCase()}. Configure a threshold (with its source) in Settings so districts can be transparently prioritized against a defined benchmark.`,
      );
    }
  }

  const completeness = quality.dimensions.find((d) => d.dimension === "completeness");
  if (completeness && completeness.score < 90) {
    push(
      "data-completeness",
      `Data completeness was ${completeness.score.toFixed(1)}%. Strengthen completion of required fields at the point of data entry before using this dataset for programme decisions.`,
    );
  }

  const uniqueness = quality.dimensions.find((d) => d.dimension === "uniqueness");
  if (uniqueness && uniqueness.score < 95) {
    push(
      "duplicates",
      `Potential duplicate records were identified (uniqueness score ${uniqueness.score.toFixed(1)}%). Review flagged records in the Data Quality Assessment and resolve duplicates before final reporting.`,
    );
  }

  const validity = quality.dimensions.find((d) => d.dimension === "validity");
  if (validity && validity.score < 95) {
    push(
      "validity",
      `Some values could not be parsed as valid dates or numbers, or fell outside plausible ranges (validity score ${validity.score.toFixed(1)}%). Correct these at source and re-upload for a fully validated analysis.`,
    );
  }

  return recs;
}
