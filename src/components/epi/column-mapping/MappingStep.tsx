"use client";

import { useMemo, useState } from "react";
import { ColumnMapping, DatasetTypeId, ParsedTable } from "@/types/epi/dataset";
import { getDatasetDefinition } from "@/lib/epi/dataset-registry";
import { suggestColumnMappings, getMissingRequiredFields } from "@/lib/epi/mapping";
import { Badge, Button, Card, CardHeader } from "@/components/epi/ui/primitives";

interface Props {
  table: ParsedTable;
  datasetId: DatasetTypeId;
  onConfirm: (mappings: ColumnMapping[]) => void;
  onBack: () => void;
}

export function MappingStep({ table, datasetId, onConfirm, onBack }: Props) {
  const def = getDatasetDefinition(datasetId);
  const [mappings, setMappings] = useState<ColumnMapping[]>(() => suggestColumnMappings(datasetId, table.headers));

  const missing = useMemo(() => getMissingRequiredFields(datasetId, mappings), [datasetId, mappings]);

  function update(systemField: string, uploadedHeader: string | null) {
    setMappings((prev) =>
      prev.map((m) => (m.systemField === systemField ? { ...m, uploadedHeader, isManualOverride: true, confidence: uploadedHeader ? 1 : 0 } : m)),
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardHeader title="Column mapping" subtitle={`Confirm how columns in "${table.fileName}" map to ${def.name} fields.`} />
        <div className="divide-y divide-epi-border">
          {def.columns.map((col) => {
            const mapping = mappings.find((m) => m.systemField === col.key)!;
            return (
              <div key={col.key} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-epi-ink">{col.label}</span>
                  {col.required && <Badge tone="attention">Required</Badge>}
                  {!mapping.isManualOverride && mapping.uploadedHeader && mapping.confidence < 0.8 && <Badge tone="neutral">Low-confidence match</Badge>}
                </div>
                <select
                  className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm sm:w-64"
                  value={mapping.uploadedHeader ?? ""}
                  onChange={(e) => update(col.key, e.target.value || null)}
                  aria-label={`Uploaded column for ${col.label}`}
                >
                  <option value="">— Not mapped —</option>
                  {table.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </Card>

      {missing.length > 0 && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Required fields not mapped: {missing.join(", ")}.</p>
          <p className="mt-1">Analysis cannot proceed as though this data is complete until these are mapped.</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={() => onConfirm(mappings)} disabled={missing.length > 0}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
