"use client";

import { useMemo } from "react";
import { CleanedDataset } from "@/types/epi/dataset";
import { ThresholdOverrides, getThreshold } from "@/lib/epi/threshold-registry";
import { assessDataQuality } from "@/lib/epi/validation/quality-engine";
import { analyzeDataset, isAnalysisSupported } from "@/lib/epi/analytics";
import { buildDataQualityChart, buildVisualizations } from "@/lib/epi/visualization-engine";
import { buildFindings } from "@/lib/epi/findings-engine";
import { buildRecommendations } from "@/lib/epi/recommendation-engine";
import { getDatasetDefinition } from "@/lib/epi/dataset-registry";
import { Button, Card, CardHeader, SectionHeading } from "@/components/epi/ui/primitives";
import { KpiGrid } from "./KpiGrid";
import { DataQualityCard } from "./DataQualityCard";
import { ChartCard } from "./ChartCard";
import { ThresholdSettings } from "./ThresholdSettings";
import { KeyFindingCallout, PriorityAreaCallout } from "./Callouts";

interface Props {
  cleaned: CleanedDataset;
  reportingPeriod: string;
  overrides: ThresholdOverrides;
  onOverridesChange: (overrides: ThresholdOverrides) => void;
  onGenerateReport: () => void;
  onBack: () => void;
}

export function DashboardStep({ cleaned, reportingPeriod, overrides, onOverridesChange, onGenerateReport, onBack }: Props) {
  const def = getDatasetDefinition(cleaned.datasetId);

  const quality = useMemo(() => assessDataQuality(cleaned.datasetId, cleaned.records), [cleaned]);
  const supported = isAnalysisSupported(cleaned.datasetId);
  const analysis = useMemo(() => (supported ? analyzeDataset(cleaned.datasetId, cleaned.records, quality, overrides) : null), [cleaned, quality, overrides, supported]);
  const meta = useMemo(() => ({ datasetLabel: def.name, period: reportingPeriod, sourceLabel: `Uploaded file: ${cleaned.sourceFileName}` }), [def, reportingPeriod, cleaned.sourceFileName]);
  const { charts, tables } = useMemo(() => (analysis ? buildVisualizations(analysis, meta) : { charts: [], tables: [] }), [analysis, meta]);
  const qualityChart = useMemo(() => buildDataQualityChart(quality, meta), [quality, meta]);
  const findings = useMemo(() => (analysis ? buildFindings(analysis, quality, overrides) : []), [analysis, quality, overrides]);
  const recommendations = useMemo(() => (analysis ? buildRecommendations(analysis, quality, overrides) : []), [analysis, quality, overrides]);

  if (!analysis) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <p className="text-sm text-slate-600">
            Detection and column mapping succeeded for <strong>{def.name}</strong>, but the analytics module for this dataset type is marked &ldquo;coming soon&rdquo;. We do not display fabricated
            KPIs for unimplemented modules. Currently supported for full analysis: MR Linelist, Coverage, Session Monitoring, Zero-Dose/Defaulter.
          </p>
          <Button variant="secondary" className="mt-4" onClick={onBack}>
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  const primaryIndicatorKey = analysis.kpis.find((k) => k.band !== undefined)?.key;

  const tableFor = (chartId: string) => tables.find((t) => t.id === (chartId === "district-comparison" ? "district-table" : `${chartId}-table`));

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      <div>
        <SectionHeading>{def.name} — Analytics Dashboard</SectionHeading>
        <p className="text-sm text-slate-500">{cleaned.records.length.toLocaleString()} records · {reportingPeriod} · {cleaned.sourceFileName}</p>
      </div>

      {(findings[0] || analysis.districtBreakdown.some((d) => d.band === "critical" || d.band === "needs_attention")) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {findings[0] && <KeyFindingCallout finding={findings[0]} />}
          <PriorityAreaCallout analysis={analysis} />
        </div>
      )}

      <KpiGrid kpis={analysis.kpis} />

      <DataQualityCard quality={quality} />

      {primaryIndicatorKey && (
        <ThresholdSettings
          indicatorKey={primaryIndicatorKey}
          indicatorLabel={analysis.kpis.find((k) => k.key === primaryIndicatorKey)!.label}
          threshold={getThreshold(primaryIndicatorKey, overrides)}
          onChange={(t) => onOverridesChange({ ...overrides, [primaryIndicatorKey]: t })}
        />
      )}

      <div>
        <SectionHeading>Visualizations</SectionHeading>
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard chart={qualityChart} />
          {charts.map((c) => (
            <ChartCard key={c.id} chart={c} table={tableFor(c.id)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Key Findings" subtitle="Generated from this dataset only" />
          <ol className="list-decimal space-y-2 px-9 py-4 text-sm text-slate-700">
            {findings.map((f) => (
              <li key={f.id}>{f.text}</li>
            ))}
            {findings.length === 0 && <p className="text-slate-400">No notable findings were generated.</p>}
          </ol>
        </Card>
        <Card>
          <CardHeader title="Recommendations" subtitle="Editable in the report builder" />
          <ol className="list-decimal space-y-2 px-9 py-4 text-sm text-slate-700">
            {recommendations.map((r) => (
              <li key={r.id}>{r.text}</li>
            ))}
            {recommendations.length === 0 && <p className="text-slate-400">No recommendations were generated.</p>}
          </ol>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-epi-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={onGenerateReport}>Generate Report →</Button>
        </div>
      </div>
    </div>
  );
}
