export type ThresholdBand = "good" | "needs_attention" | "critical";

export interface ThresholdDefinition {
  indicatorKey: string;
  source: "Country programme" | "WHO guidance" | "Custom" | "Not configured";
  /** Value at/above which the indicator is "good". Undefined = not configured. */
  goodMin?: number;
  /** Value at/above which the indicator is "needs attention" (below goodMin). */
  attentionMin?: number;
  /** Direction: higher-is-better (coverage) vs lower-is-better (dropout, wastage). */
  direction: "higher_is_better" | "lower_is_better";
  configured: boolean;
}

export interface GuidanceEntry {
  datasetId: string;
  indicatorKey: string;
  label: string;
  definition: string;
  calculationMethod: string;
  recommendedVisualization: string;
  reportingGuidance: string;
  source: string;
  version: string;
}

export interface KpiValue {
  key: string;
  label: string;
  value: number | string;
  unit?: "%" | "count" | "pp" | "";
  format?: "integer" | "percent" | "decimal1" | "text";
  band?: ThresholdBand;
  bandLabel?: string;
  guidance?: GuidanceEntry;
}
