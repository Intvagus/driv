"use client";

import { useMemo, useState } from "react";
import { ParsedTable, DatasetTypeId } from "@/types/epi/dataset";
import { detectDataset } from "@/lib/epi/dataset-registry/detect";
import { listDatasetDefinitions } from "@/lib/epi/dataset-registry";
import { detectWideCoverageFormat, guessReportingPeriod, reshapeWideCoverage } from "@/lib/epi/parsers/wide-coverage-reshape";
import { Badge, Button, Card, CardHeader } from "@/components/epi/ui/primitives";

interface Props {
  tables: ParsedTable[];
  onConfirm: (table: ParsedTable, datasetId: DatasetTypeId) => void;
  onBack: () => void;
}

export function DetectionStep({ tables, onConfirm, onBack }: Props) {
  const [sheetIndex, setSheetIndex] = useState(0);
  const rawTable = tables[sheetIndex];
  const wideDetection = useMemo(() => detectWideCoverageFormat(rawTable), [rawTable]);

  const [reshapeDecision, setReshapeDecision] = useState<"reshape" | "skip" | null>(null);
  const [periodInput, setPeriodInput] = useState(() => guessReportingPeriod(rawTable.fileName));
  const [reshapedTable, setReshapedTable] = useState<ParsedTable | null>(null);

  const table = reshapeDecision === "reshape" && reshapedTable ? reshapedTable : rawTable;
  const detection = useMemo(() => detectDataset(table.headers), [table]);
  const [manualPick, setManualPick] = useState<DatasetTypeId | null>(null);
  const defs = listDatasetDefinitions();

  if (wideDetection.isWideFormat && reshapeDecision === null) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader title="This looks like a wide-format coverage file" subtitle={`Detected in "${rawTable.fileName}"`} />
          <div className="space-y-4 p-5 text-sm text-slate-600">
            <p>
              Instead of one row per district/facility <em>per antigen</em> (with Target and Vaccinated Population columns), this file has one row per
              facility with a separate coverage-percentage column for each antigen:
            </p>
            <p className="rounded-md bg-epi-bg p-3 font-mono text-xs text-epi-ink">{wideDetection.antigenColumns.map((c) => c.header).join(", ")}</p>
            <p>
              This can be reshaped into one row per facility + antigen so it can be analyzed as Immunization Coverage data. Target and Vaccinated
              Population counts are not present in this file, so coverage will be calculated as the average of the reported percentages, not a
              population-weighted figure — this will be noted in the report&apos;s Data Limitations.
            </p>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-epi-ink">Reporting period for this data</span>
              <input
                className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
                value={periodInput}
                onChange={(e) => setPeriodInput(e.target.value)}
                placeholder="e.g. December 2025"
              />
            </label>
          </div>
          <div className="flex justify-between gap-2 border-t border-epi-border px-5 py-3">
            <Button variant="secondary" onClick={() => setReshapeDecision("skip")}>
              Skip — use file as-is
            </Button>
            <Button
              onClick={() => {
                setReshapedTable(reshapeWideCoverage(rawTable, wideDetection, periodInput || "Not specified"));
                setReshapeDecision("reshape");
              }}
              disabled={!periodInput.trim()}
            >
              Reshape for analysis →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {tables.length > 1 && reshapeDecision !== "reshape" && (
        <Card className="p-4">
          <p className="mb-2 text-sm font-medium text-epi-ink">This file has {tables.length} sheets/tables. Which one should be analyzed?</p>
          <div className="flex flex-wrap gap-2">
            {tables.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setSheetIndex(i);
                  setReshapeDecision(null);
                }}
                className={`rounded-md border px-3 py-1.5 text-sm ${i === sheetIndex ? "border-epi-primary bg-blue-50 text-epi-primary" : "border-epi-border text-slate-600"}`}
              >
                {t.sheetName ?? `Sheet ${i + 1}`}
              </button>
            ))}
          </div>
        </Card>
      )}

      {reshapeDecision === "reshape" && (
        <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-epi-ink">
          Reshaped {rawTable.rows.length.toLocaleString()} facility rows × {wideDetection.antigenColumns.length} antigens into{" "}
          {table.rows.length.toLocaleString()} long-format records.{" "}
          <button className="font-medium text-epi-primary underline" onClick={() => setReshapeDecision(null)}>
            Undo
          </button>
        </div>
      )}

      <Card>
        <CardHeader title="Dataset detected" subtitle={`${table.rows.length.toLocaleString()} rows found in "${table.fileName}"`} />
        <div className="space-y-3 p-5">
          {detection.isConfident && detection.best ? (
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-epi-ink">{detection.best.name}</p>
                <Badge tone="good">Confidence: {Math.round(detection.best.confidence * 100)}%</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {detection.best.matchedFields.map((f) => (
                  <li key={f.key} className={f.matched ? "text-epi-good" : "text-slate-400"}>
                    {f.matched ? "✓" : "○"} {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-epi-ink">
              We are not completely sure what type of dataset this is. Please select the closest match below.
            </div>
          )}

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-600">{detection.isConfident ? "Not right? Choose a different dataset type:" : "Select dataset type:"}</legend>
            {detection.candidates
              .filter((c) => defs.find((d) => d.id === c.datasetId)?.status === "supported")
              .map((c) => (
                <label key={c.datasetId} className="flex cursor-pointer items-center justify-between rounded-md border border-epi-border px-3 py-2 text-sm hover:bg-epi-bg">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dataset"
                      checked={(manualPick ?? (detection.isConfident ? detection.best?.datasetId : null)) === c.datasetId}
                      onChange={() => setManualPick(c.datasetId)}
                    />
                    {c.name}
                  </span>
                  <span className="text-xs text-slate-400">{Math.round(c.confidence * 100)}%</span>
                </label>
              ))}
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-epi-border px-3 py-2 text-sm text-slate-500 hover:bg-epi-bg">
              <input type="radio" name="dataset" checked={manualPick === null && !detection.isConfident && false} onChange={() => {}} disabled />
              Other (not yet supported for analysis)
            </label>
          </fieldset>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={() => {
            const chosen = manualPick ?? detection.best?.datasetId;
            if (chosen) onConfirm(table, chosen);
          }}
          disabled={!manualPick && !detection.isConfident}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
