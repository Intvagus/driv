import { ChartSpec, TableSpec } from "./visualization";
import { KpiValue } from "./indicator";
import { DataQualityReport } from "./validation";

export type ReportTemplateId =
  | "who_professional"
  | "executive"
  | "technical"
  | "field_monitoring"
  | "custom";

export type ReportSectionType =
  | "cover"
  | "executive_summary"
  | "methodology"
  | "data_quality"
  | "kpi_dashboard"
  | "key_findings"
  | "programme_performance"
  | "geographic_analysis"
  | "vaccine_analysis"
  | "trends"
  | "inequalities"
  | "recommendations"
  | "limitations"
  | "annex"
  | "custom_text";

export interface ReportFinding {
  id: string;
  text: string;
  editable: boolean;
}

export interface ReportRecommendation {
  id: string;
  findingRef: string;
  text: string;
  editable: boolean;
}

export interface ReportSection {
  id: string;
  type: ReportSectionType;
  title: string;
  /** Editable narrative body (markdown-lite: paragraphs separated by \n\n). */
  body: string;
  included: boolean;
  charts?: ChartSpec[];
  tables?: TableSpec[];
  kpis?: KpiValue[];
}

export interface ReportProvenance {
  dataSource: string;
  datasetLabel: string;
  reportingPeriod: string;
  recordCount: number;
  analysisDate: string;
  calculationNotes: string[];
}

export interface ReportModel {
  id: string;
  template: ReportTemplateId;
  title: string;
  subtitle: string;
  organization: string;
  programme: string;
  preparedBy: string;
  reportDate: string;
  logoDataUrl?: string;
  sections: ReportSection[];
  findings: ReportFinding[];
  recommendations: ReportRecommendation[];
  limitations: string[];
  provenance: ReportProvenance;
  dataQuality: DataQualityReport;
  generatedAt: string;
}
