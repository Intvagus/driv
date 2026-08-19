export type ValidationSeverity = "critical" | "warning" | "info";

export type ValidationCategory =
  | "completeness"
  | "validity"
  | "consistency"
  | "duplicate"
  | "geographic"
  | "logical";

export interface ValidationIssue {
  ruleId: string;
  category: ValidationCategory;
  description: string;
  severity: ValidationSeverity;
  affectedRecordCount: number;
  affectedRecordIndices: number[];
  recommendedAction: string;
}

export interface DataQualityDimensionScore {
  dimension: "completeness" | "validity" | "consistency" | "uniqueness";
  score: number; // 0-100
  methodology: string;
}

export interface DataQualityReport {
  dimensions: DataQualityDimensionScore[];
  overallScore: number; // 0-100
  issues: ValidationIssue[];
  totalRecords: number;
  methodologyNote: string;
}
