import { DatasetTypeId } from "./dataset";
import { KpiValue, ThresholdBand } from "./indicator";

export interface DistrictMetric {
  district: string;
  value: number;
  target?: number;
  band?: ThresholdBand;
}

export interface TimePoint {
  period: string;
  value: number;
}

export interface CategoryBreakdown {
  dimensionKey: string;
  dimensionLabel: string;
  items: { label: string; value: number }[];
}

/** Common shape every dataset's analytics module produces, consumed generically by
 *  the visualization engine, findings engine, recommendation engine and report engine. */
export interface AnalysisResult {
  datasetId: DatasetTypeId;
  recordCount: number;
  kpis: KpiValue[];
  /** Primary geographic indicator broken down by district (e.g. coverage %, completion %). */
  districtMetricLabel: string;
  districtMetricUnit: "%" | "count";
  districtBreakdown: DistrictMetric[];
  /** Primary trend indicator over reporting period. */
  timeMetricLabel: string;
  timeBreakdown: TimePoint[];
  categoryBreakdowns: CategoryBreakdown[];
  /** Extra dataset-specific factual notes, not causal claims. */
  notes: string[];
}
