import { DatasetTypeId, ParsedTable } from "@/types/epi/dataset";
import { generateMrLinelistDemo } from "./mr-linelist";
import { generateCoverageDemo } from "./coverage";
import { generateSessionMonitoringDemo } from "./session-monitoring";
import { generateZeroDoseDemo } from "./zero-dose";

export interface DemoDatasetOption {
  datasetId: DatasetTypeId;
  label: string;
  description: string;
  generate: () => ParsedTable;
}

export const DEMO_DATASETS: DemoDatasetOption[] = [
  { datasetId: "MR_LINELIST", label: "MR Linelist", description: "140 fictional child-level MR vaccination records.", generate: generateMrLinelistDemo },
  { datasetId: "COVERAGE", label: "Immunization Coverage", description: "District × antigen × quarter coverage data.", generate: generateCoverageDemo },
  { datasetId: "SESSION_MONITORING", label: "Session Monitoring", description: "Planned vs conducted outreach sessions by district.", generate: generateSessionMonitoringDemo },
  { datasetId: "ZERO_DOSE", label: "Zero-Dose", description: "Fictional zero-dose and defaulter tracking records.", generate: generateZeroDoseDemo },
];
