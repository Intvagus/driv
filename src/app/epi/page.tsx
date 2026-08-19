"use client";

import { useState } from "react";
import { CleanedDataset, ColumnMapping, DatasetTypeId, ParsedTable } from "@/types/epi/dataset";
import { ReportModel } from "@/types/epi/report";
import { ThresholdOverrides } from "@/lib/epi/threshold-registry";
import { applyColumnMapping } from "@/lib/epi/mapping";
import { UploadStep } from "@/components/epi/upload/UploadStep";
import { DetectionStep } from "@/components/epi/detection/DetectionStep";
import { MappingStep } from "@/components/epi/column-mapping/MappingStep";
import { DashboardStep } from "@/components/epi/dashboard/DashboardStep";
import { ReportEditorStep } from "@/components/epi/report-editor/ReportEditorStep";
import { ReportPreview } from "@/components/epi/report-preview/ReportPreview";

type Step = "upload" | "detect" | "map" | "dashboard" | "report-editor" | "preview";

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "detect", label: "Detect" },
  { id: "map", label: "Map Columns" },
  { id: "dashboard", label: "Analyze" },
  { id: "report-editor", label: "Build Report" },
  { id: "preview", label: "Preview & Export" },
];

export default function EpiHomePage() {
  const [step, setStep] = useState<Step>("upload");
  const [tables, setTables] = useState<ParsedTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<ParsedTable | null>(null);
  const [datasetId, setDatasetId] = useState<DatasetTypeId | null>(null);
  const [cleaned, setCleaned] = useState<CleanedDataset | null>(null);
  const [overrides, setOverrides] = useState<ThresholdOverrides>({});
  const [report, setReport] = useState<ReportModel | null>(null);
  const reportingPeriod = "Current reporting period";

  const stepIndex = STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <div>
      <nav aria-label="Progress" className="mx-auto mb-8 max-w-5xl">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-slate-500">
          {STEP_LABELS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  i < stepIndex ? "bg-epi-good text-white" : i === stepIndex ? "bg-epi-primary text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <span className={i === stepIndex ? "font-medium text-epi-ink" : ""}>{s.label}</span>
              {i < STEP_LABELS.length - 1 && <span className="mx-1 text-slate-300">—</span>}
            </li>
          ))}
        </ol>
      </nav>

      {step === "upload" && (
        <UploadStep
          onParsed={(t) => {
            setTables(t);
            setStep("detect");
          }}
          onDemo={(table) => {
            setTables([table]);
            setStep("detect");
          }}
        />
      )}

      {step === "detect" && tables.length > 0 && (
        <DetectionStep
          tables={tables}
          onConfirm={(table, id) => {
            setSelectedTable(table);
            setDatasetId(id);
            setStep("map");
          }}
          onBack={() => setStep("upload")}
        />
      )}

      {step === "map" && selectedTable && datasetId && (
        <MappingStep
          table={selectedTable}
          datasetId={datasetId}
          onConfirm={(mappings: ColumnMapping[]) => {
            const c = applyColumnMapping(selectedTable, datasetId, mappings);
            setCleaned(c);
            setStep("dashboard");
          }}
          onBack={() => setStep("detect")}
        />
      )}

      {step === "dashboard" && cleaned && (
        <DashboardStep
          cleaned={cleaned}
          reportingPeriod={reportingPeriod}
          overrides={overrides}
          onOverridesChange={setOverrides}
          onGenerateReport={() => setStep("report-editor")}
          onBack={() => setStep("map")}
        />
      )}

      {step === "report-editor" && cleaned && (
        <ReportEditorStep
          cleaned={cleaned}
          reportingPeriod={reportingPeriod}
          overrides={overrides}
          onPreview={(r) => {
            setReport(r);
            setStep("preview");
          }}
          onBack={() => setStep("dashboard")}
        />
      )}

      {step === "preview" && report && cleaned && <ReportPreview report={report} cleaned={cleaned} onBack={() => setStep("report-editor")} />}
    </div>
  );
}
