import { CleanedRecord, DatasetTypeId } from "@/types/epi/dataset";
import { AnalysisResult } from "@/types/epi/analysis";
import { DataQualityReport } from "@/types/epi/validation";
import { ThresholdOverrides } from "../threshold-registry";
import { analyzeCoverage } from "./coverage";
import { analyzeMrLinelist } from "./mr-linelist";
import { analyzeSessionMonitoring } from "./session-monitoring";
import { analyzeZeroDose } from "./zero-dose";

/**
 * Dispatches to the dataset-specific analytics module. Datasets marked
 * "coming_soon" in the registry have no analyzer here by design — the UI
 * must not fabricate KPIs for a module that hasn't been implemented.
 */
export function analyzeDataset(
  datasetId: DatasetTypeId,
  records: CleanedRecord[],
  quality: DataQualityReport,
  overrides?: ThresholdOverrides,
): AnalysisResult {
  switch (datasetId) {
    case "COVERAGE":
    case "ROUTINE_IMMUNIZATION":
      return analyzeCoverage(records, overrides);
    case "MR_LINELIST":
      return analyzeMrLinelist(records, quality, overrides);
    case "SESSION_MONITORING":
      return analyzeSessionMonitoring(records, overrides);
    case "ZERO_DOSE":
    case "DEFAULTER":
      return analyzeZeroDose(records);
    default:
      throw new Error(
        `Analysis for dataset type "${datasetId}" is not yet implemented. This dataset type is registered for detection and column mapping, but its analytics module is marked "coming soon".`,
      );
  }
}

export function isAnalysisSupported(datasetId: DatasetTypeId): boolean {
  return ["COVERAGE", "ROUTINE_IMMUNIZATION", "MR_LINELIST", "SESSION_MONITORING", "ZERO_DOSE", "DEFAULTER"].includes(datasetId);
}
