"use client";

import { useMemo, useRef, useState } from "react";
import { CleanedDataset } from "@/types/epi/dataset";
import { ReportModel, ReportTemplateId } from "@/types/epi/report";
import { ThresholdOverrides } from "@/lib/epi/threshold-registry";
import { assessDataQuality } from "@/lib/epi/validation/quality-engine";
import { analyzeDataset } from "@/lib/epi/analytics";
import { getDatasetDefinition } from "@/lib/epi/dataset-registry";
import { buildReportModel } from "@/lib/epi/report-engine/build-report";
import { REPORT_TEMPLATES } from "@/lib/epi/report-engine/templates";
import { Button, Card, CardHeader, SectionHeading } from "@/components/epi/ui/primitives";

interface Props {
  cleaned: CleanedDataset;
  reportingPeriod: string;
  overrides: ThresholdOverrides;
  onPreview: (report: ReportModel) => void;
  onBack: () => void;
}

export function ReportEditorStep({ cleaned, reportingPeriod, overrides, onPreview, onBack }: Props) {
  const def = getDatasetDefinition(cleaned.datasetId);
  const [template, setTemplate] = useState<ReportTemplateId>("who_professional");
  const [organization, setOrganization] = useState("");
  const [programme, setProgramme] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = useMemo(() => {
    const quality = assessDataQuality(cleaned.datasetId, cleaned.records);
    const analysis = analyzeDataset(cleaned.datasetId, cleaned.records, quality, overrides);
    return buildReportModel({
      datasetId: cleaned.datasetId,
      def,
      analysis,
      quality,
      mappings: cleaned.mappings,
      sourceFileName: cleaned.sourceFileName,
      reportingPeriod,
      organization,
      programme,
      preparedBy,
      logoDataUrl,
      template,
      overrides,
      sampleRecords: cleaned.records,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const [report, setReport] = useState<ReportModel>(initial);

  function rebuild(nextTemplate: ReportTemplateId) {
    setTemplate(nextTemplate);
    const quality = assessDataQuality(cleaned.datasetId, cleaned.records);
    const analysis = analyzeDataset(cleaned.datasetId, cleaned.records, quality, overrides);
    setReport(
      buildReportModel({
        datasetId: cleaned.datasetId,
        def,
        analysis,
        quality,
        mappings: cleaned.mappings,
        sourceFileName: cleaned.sourceFileName,
        reportingPeriod,
        organization,
        programme,
        preparedBy,
        logoDataUrl,
        template: nextTemplate,
        overrides,
        sampleRecords: cleaned.records,
      }),
    );
  }

  function refreshFromAnalysis() {
    rebuild(template);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <SectionHeading>Report Builder</SectionHeading>

      <Card>
        <CardHeader title="Report details" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Title</span>
            <input className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm" value={report.title} onChange={(e) => setReport({ ...report, title: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Subtitle</span>
            <input className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm" value={report.subtitle} onChange={(e) => setReport({ ...report, subtitle: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Organization</span>
            <input
              className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                setReport({ ...report, organization: e.target.value, provenance: { ...report.provenance, dataSource: e.target.value || "EPI MIS" } });
              }}
              placeholder="e.g. Ministry of Health EPI Programme"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Programme</span>
            <input
              className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
              value={programme}
              onChange={(e) => {
                setProgramme(e.target.value);
                setReport({ ...report, programme: e.target.value });
              }}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Prepared by</span>
            <input
              className="w-full rounded-md border border-epi-border px-3 py-1.5 text-sm"
              value={preparedBy}
              onChange={(e) => {
                setPreparedBy(e.target.value);
                setReport({ ...report, preparedBy: e.target.value });
              }}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Organization logo (optional)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const url = reader.result as string;
                  setLogoDataUrl(url);
                  setReport({ ...report, logoDataUrl: url });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader title="Report template" />
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
          {REPORT_TEMPLATES.map((t) => (
            <label key={t.id} className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${template === t.id ? "border-epi-primary bg-blue-50" : "border-epi-border"}`}>
              <input type="radio" name="template" className="mr-2" checked={template === t.id} onChange={() => rebuild(t.id)} />
              <span className="font-medium text-epi-ink">{t.label}</span>
              <p className="mt-1 text-xs text-slate-500">{t.description}</p>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Sections" subtitle="Edit narrative text. Numbers stay linked to the underlying analysis." action={<Button variant="secondary" size="sm" onClick={refreshFromAnalysis}>Refresh Analysis</Button>} />
        <div className="divide-y divide-epi-border">
          {report.sections.map((section) => (
            <div key={section.id} className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-epi-ink">
                  <input
                    type="checkbox"
                    checked={section.included}
                    onChange={(e) =>
                      setReport({ ...report, sections: report.sections.map((s) => (s.id === section.id ? { ...s, included: e.target.checked } : s)) })
                    }
                  />
                  {section.title}
                </label>
                {(section.charts?.length || section.tables?.length || section.kpis?.length) && (
                  <span className="text-xs text-slate-400">
                    {section.charts?.length ? `${section.charts.length} chart(s) ` : ""}
                    {section.tables?.length ? `${section.tables.length} table(s) ` : ""}
                    {section.kpis?.length ? `${section.kpis.length} KPI(s)` : ""}
                  </span>
                )}
              </div>
              {section.type !== "kpi_dashboard" && (
                <textarea
                  className="w-full rounded-md border border-epi-border px-3 py-2 text-sm"
                  rows={section.type === "key_findings" || section.type === "recommendations" || section.type === "limitations" ? 6 : 3}
                  value={section.body}
                  onChange={(e) => setReport({ ...report, sections: report.sections.map((s) => (s.id === section.id ? { ...s, body: e.target.value } : s)) })}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 border-t border-epi-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={() => onPreview(report)}>Preview →</Button>
        </div>
      </div>
    </div>
  );
}
