import { GuidanceEntry } from "@/types/epi/indicator";

/**
 * GuidanceRegistry — centralizes indicator definitions, calculation methods
 * and sources so nothing is hard-coded as "WHO says X" throughout the app.
 * Administrators can extend/update this list as guidance changes; the UI
 * reads only from here.
 */
export const GuidanceRegistry: GuidanceEntry[] = [
  {
    datasetId: "COVERAGE",
    indicatorKey: "coverage_pct",
    label: "Coverage %",
    definition: "The proportion of the target population that received the specified vaccine/dose during the reporting period.",
    calculationMethod: "Vaccinated population ÷ target population × 100",
    recommendedVisualization: "Ranked horizontal bar chart by district; line chart for trend over time.",
    reportingGuidance: "Report alongside the target population, denominator source and reporting period. Avoid comparing coverage across periods with different denominators without noting the change.",
    source: "Configured by programme administrator (see Settings). Aligned in structure with common EPI monitoring practice; not an official WHO publication.",
    version: "1.0",
  },
  {
    datasetId: "COVERAGE",
    indicatorKey: "dropout_rate",
    label: "Dropout Rate",
    definition: "The proportion of children who received an earlier dose in a series but did not receive a later dose.",
    calculationMethod: "(First-dose vaccinated − later-dose vaccinated) ÷ first-dose vaccinated × 100",
    recommendedVisualization: "Horizontal bar chart by district or antigen pair.",
    reportingGuidance: "Only calculate where both dose fields are present for the same denominator population.",
    source: "Configured by programme administrator (see Settings).",
    version: "1.0",
  },
  {
    datasetId: "SESSION_MONITORING",
    indicatorKey: "session_completion_pct",
    label: "Session Completion %",
    definition: "The proportion of planned immunization sessions that were actually conducted.",
    calculationMethod: "Conducted sessions ÷ planned sessions × 100",
    recommendedVisualization: "Ranked horizontal bar chart by district/facility; line chart for monthly trend.",
    reportingGuidance: "Report cancellation reasons alongside completion rate where available.",
    source: "Configured by programme administrator (see Settings).",
    version: "1.0",
  },
  {
    datasetId: "MR_LINELIST",
    indicatorKey: "data_completeness_pct",
    label: "Data Completeness",
    definition: "The proportion of required fields that are present across all records in the line list.",
    calculationMethod: "1 − (missing required-field cells ÷ total required-field cells)",
    recommendedVisualization: "Data-quality infographic with completeness, validity, consistency and uniqueness bars.",
    reportingGuidance: "Distinguish completeness (a data-quality measure) from vaccination coverage (a programme-performance measure).",
    source: "Configured by programme administrator (see Settings).",
    version: "1.0",
  },
  {
    datasetId: "ZERO_DOSE",
    indicatorKey: "zero_dose_share_pct",
    label: "Zero-Dose Share",
    definition: "The proportion of records in this dataset classified as zero-dose (no doses received).",
    calculationMethod: "Zero-dose records ÷ total records × 100",
    recommendedVisualization: "Ranked horizontal bar chart by district; bar chart by age group/sex.",
    reportingGuidance: "This is a share of the uploaded dataset, not necessarily of the full target population, unless the dataset represents the full target population.",
    source: "Configured by programme administrator (see Settings).",
    version: "1.0",
  },
];

export function getGuidance(datasetId: string, indicatorKey: string): GuidanceEntry | undefined {
  return GuidanceRegistry.find((g) => g.datasetId === datasetId && g.indicatorKey === indicatorKey);
}

export function listGuidanceForDataset(datasetId: string): GuidanceEntry[] {
  return GuidanceRegistry.filter((g) => g.datasetId === datasetId);
}
