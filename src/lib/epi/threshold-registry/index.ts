import { ThresholdBand, ThresholdDefinition } from "@/types/epi/indicator";

/**
 * Starter/example thresholds — explicitly sourced as "Custom", never presented
 * as an official WHO cutoff. Users must review and adjust these in Settings
 * before thresholds are treated as "configured"; until then the UI must not
 * label anything Good/Needs attention/Critical (see evaluateBand).
 */
export const DEFAULT_THRESHOLDS: Record<string, ThresholdDefinition> = {
  coverage_pct: {
    indicatorKey: "coverage_pct",
    source: "Custom",
    goodMin: 90,
    attentionMin: 80,
    direction: "higher_is_better",
    configured: true,
  },
  session_completion_pct: {
    indicatorKey: "session_completion_pct",
    source: "Custom",
    goodMin: 90,
    attentionMin: 75,
    direction: "higher_is_better",
    configured: true,
  },
  data_quality_score: {
    indicatorKey: "data_quality_score",
    source: "Custom",
    goodMin: 90,
    attentionMin: 75,
    direction: "higher_is_better",
    configured: true,
  },
  dropout_rate: {
    indicatorKey: "dropout_rate",
    source: "Custom",
    goodMin: 5,
    attentionMin: 10,
    direction: "lower_is_better",
    configured: true,
  },
};

export type ThresholdOverrides = Record<string, ThresholdDefinition>;

export function getThreshold(indicatorKey: string, overrides?: ThresholdOverrides): ThresholdDefinition {
  return (
    overrides?.[indicatorKey] ??
    DEFAULT_THRESHOLDS[indicatorKey] ?? {
      indicatorKey,
      source: "Not configured",
      direction: "higher_is_better",
      configured: false,
    }
  );
}

export interface BandResult {
  band?: ThresholdBand;
  label: string;
}

/** Never auto-labels Good/Needs attention/Critical unless a threshold is actually configured. */
export function evaluateBand(indicatorKey: string, value: number, overrides?: ThresholdOverrides): BandResult {
  const t = getThreshold(indicatorKey, overrides);
  if (!t.configured || t.goodMin === undefined || t.attentionMin === undefined) {
    return { band: undefined, label: "No threshold configured" };
  }
  const better = t.direction === "higher_is_better" ? (a: number, b: number) => a >= b : (a: number, b: number) => a <= b;
  if (better(value, t.goodMin)) return { band: "good", label: "Good" };
  if (better(value, t.attentionMin)) return { band: "needs_attention", label: "Needs attention" };
  return { band: "critical", label: "Critical" };
}
