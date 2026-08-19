import { AnalysisResult } from "@/types/epi/analysis";
import { ColumnMapping, DatasetDefinition } from "@/types/epi/dataset";
import { DataQualityReport } from "@/types/epi/validation";

const SMALL_DENOMINATOR_THRESHOLD = 30;

/** Automatically surfaces relevant, evidence-based limitations — never a generic boilerplate list. */
export function buildLimitations(
  quality: DataQualityReport,
  analysis: AnalysisResult,
  mappings: ColumnMapping[],
  def: DatasetDefinition,
): string[] {
  const limitations: string[] = [];

  const completeness = quality.dimensions.find((d) => d.dimension === "completeness");
  if (completeness && completeness.score < 100) {
    limitations.push(`Missing values: required fields were incomplete for some records (completeness score: ${completeness.score.toFixed(1)}%). See Data Quality Assessment for the affected fields.`);
  }

  const geoIssues = quality.issues.filter((i) => i.category === "geographic");
  if (geoIssues.length > 0) {
    limitations.push("Unknown or inconsistent geographic records: some district/tehsil values could not be reconciled to a single consistent hierarchy.");
  }

  const dupIssues = quality.issues.filter((i) => i.category === "duplicate" && i.affectedRecordCount > 0);
  if (dupIssues.length > 0) {
    const total = dupIssues.reduce((s, i) => s + i.affectedRecordCount, 0);
    limitations.push(`Possible duplicate records: ${total} record(s) were flagged as exact or potential duplicates and may overstate totals if not resolved.`);
  }

  if (analysis.timeBreakdown.length <= 1) {
    limitations.push("Inconsistent or insufficient reporting periods: only one reporting period was present, which limits trend analysis.");
  }

  const avgRecordsPerDistrict = analysis.districtBreakdown.length > 0 ? analysis.recordCount / analysis.districtBreakdown.length : Infinity;
  if (analysis.districtMetricUnit === "%" && avgRecordsPerDistrict < SMALL_DENOMINATOR_THRESHOLD) {
    limitations.push("Small denominators: some districts have a small number of underlying records, which can make percentages volatile and should be interpreted cautiously.");
  }

  const unmappedOptional = def.columns.filter((c) => !c.required && !mappings.some((m) => m.systemField === c.key && m.uploadedHeader)).map((c) => c.label);
  if (unmappedOptional.length > 0) {
    limitations.push(`Unavailable variables: the following optional fields were not present in the uploaded data and could not be analyzed: ${unmappedOptional.join(", ")}.`);
  }

  if (quality.issues.some((i) => i.severity === "critical")) {
    limitations.push("Critical data-quality issues were identified (see Data Quality Assessment); findings and KPIs derived from affected records should be interpreted with caution.");
  }

  return limitations;
}
