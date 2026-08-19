export type ChartKind =
  | "line"
  | "bar_horizontal"
  | "bar_vertical"
  | "stacked_bar"
  | "gauge_gap"
  | "ranked_list"
  | "histogram";

export interface ChartSeriesPoint {
  label: string;
  value: number;
  /** Secondary value, e.g. target, for target-vs-achievement charts. */
  reference?: number;
  flagged?: boolean;
}

export interface ChartSpec {
  id: string;
  kind: ChartKind;
  /** Self-explanatory title including indicator + geography + time period. */
  title: string;
  subtitle?: string;
  unit?: string;
  data: ChartSeriesPoint[];
  series2Label?: string;
  sourceNote: string;
  methodNote?: string;
  /** Rationale for why this chart type was chosen (analytical purpose). */
  rationale: string;
}

export interface TableColumnSpec {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  format?: "integer" | "percent" | "decimal1" | "text";
}

export interface TableSpec {
  id: string;
  title: string;
  columns: TableColumnSpec[];
  rows: Record<string, string | number | null>[];
  sourceNote: string;
  footnotes?: string[];
}
