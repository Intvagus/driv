"use client";

import { ThresholdDefinition } from "@/types/epi/indicator";
import { Button, Card, CardHeader } from "@/components/epi/ui/primitives";

interface Props {
  indicatorKey: string;
  indicatorLabel: string;
  threshold: ThresholdDefinition;
  onChange: (t: ThresholdDefinition) => void;
}

export function ThresholdSettings({ indicatorKey, indicatorLabel, threshold, onChange }: Props) {
  return (
    <Card>
      <CardHeader title="Threshold configuration" subtitle={`Never auto-labelled "Good/Needs attention/Critical" unless a threshold is configured here.`} />
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block text-slate-500">Indicator</span>
          <input disabled value={indicatorLabel} className="w-full rounded-md border border-epi-border bg-epi-bg px-3 py-1.5 text-sm text-slate-600" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-500">Threshold source</span>
          <select
            className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
            value={threshold.source}
            onChange={(e) => onChange({ ...threshold, source: e.target.value as ThresholdDefinition["source"], configured: true })}
          >
            <option>Custom</option>
            <option>Country programme</option>
            <option>WHO guidance</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-500">Good (≥)</span>
          <input
            type="number"
            className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
            value={threshold.goodMin ?? ""}
            onChange={(e) => onChange({ ...threshold, goodMin: Number(e.target.value), configured: true })}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-500">Needs attention (≥)</span>
          <input
            type="number"
            className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
            value={threshold.attentionMin ?? ""}
            onChange={(e) => onChange({ ...threshold, attentionMin: Number(e.target.value), configured: true })}
          />
        </label>
      </div>
      <div className="flex justify-end gap-2 border-t border-epi-border px-5 py-3">
        <Button variant="secondary" size="sm" onClick={() => onChange({ indicatorKey, source: "Not configured", direction: threshold.direction, configured: false })}>
          Clear threshold
        </Button>
      </div>
    </Card>
  );
}
