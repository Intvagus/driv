"use client";

import { useState } from "react";
import Image from "next/image";
import { ReportModel } from "@/types/epi/report";
import { CleanedDataset } from "@/types/epi/dataset";
import { ChartSvg } from "@/components/epi/charts/ChartSvg";
import { KpiGrid } from "@/components/epi/dashboard/KpiGrid";
import { Button, Card } from "@/components/epi/ui/primitives";
import { SimpleTable } from "./SimpleTable";
import { exportCsv } from "@/lib/epi/export/csv";
import { exportXlsx } from "@/lib/epi/export/xlsx";
import { exportPptx } from "@/lib/epi/export/pptx";
import { exportDocx } from "@/lib/epi/export/docx-client";
import { exportPdf } from "@/lib/epi/export/pdf-client";

interface Props {
  report: ReportModel;
  cleaned: CleanedDataset;
  onBack: () => void;
}

export function ReportPreview({ report, cleaned, onBack }: Props) {
  const [busy, setBusy] = useState<string | null>(null);

  async function run(name: string, fn: () => Promise<void> | void) {
    setBusy(name);
    try {
      await fn();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          ← Back to editor
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => run("csv", () => exportCsv(cleaned))}>
            {busy === "csv" ? "Exporting…" : "CSV"}
          </Button>
          <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => run("xlsx", () => exportXlsx(report, cleaned))}>
            {busy === "xlsx" ? "Exporting…" : "Excel"}
          </Button>
          <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => run("pptx", () => exportPptx(report))}>
            {busy === "pptx" ? "Exporting…" : "PowerPoint"}
          </Button>
          <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => run("docx", () => exportDocx(report))}>
            {busy === "docx" ? "Exporting…" : "Word"}
          </Button>
          <Button size="sm" disabled={!!busy} onClick={() => run("pdf", () => exportPdf(report))}>
            {busy === "pdf" ? "Exporting…" : "PDF"}
          </Button>
        </div>
      </div>

      <Card className="p-8 sm:p-10">
        <div className="flex items-start justify-between border-b border-epi-border pb-6">
          <div>
            {report.logoDataUrl && <Image src={report.logoDataUrl} alt="Organization logo" width={120} height={48} unoptimized className="mb-3 h-12 w-auto object-contain" />}
            <h1 className="text-2xl font-bold text-epi-ink">{report.title}</h1>
            <p className="text-slate-500">{report.subtitle}</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            {report.organization && <p>{report.organization}</p>}
            {report.preparedBy && <p>Prepared by {report.preparedBy}</p>}
            <p>{report.reportDate}</p>
          </div>
        </div>

        <div className="prose prose-sm mt-6 max-w-none">
          {report.sections
            .filter((s) => s.included)
            .map((section) => (
              <section key={section.id} className="mb-8">
                <h2 className="text-base font-semibold text-epi-ink">{section.title}</h2>
                {section.body && section.body.split("\n\n").map((p, i) => <p key={i} className="text-sm leading-relaxed text-slate-700">{p}</p>)}
                {section.kpis && <div className="mt-3"><KpiGrid kpis={section.kpis} /></div>}
                {section.charts?.map((c) => (
                  <div key={c.id} className="my-4 rounded-md border border-epi-border p-3">
                    <ChartSvg spec={c} />
                  </div>
                ))}
                {section.tables?.map((t) => <SimpleTable key={t.id} table={t} />)}
              </section>
            ))}

          <section className="mt-8 border-t border-epi-border pt-6 text-xs text-slate-500">
            <h2 className="text-sm font-semibold text-epi-ink">Data Source &amp; Methodology</h2>
            <p>Data source: {report.provenance.dataSource}</p>
            <p>Dataset: {report.provenance.datasetLabel}</p>
            <p>Reporting period: {report.provenance.reportingPeriod}</p>
            <p>Records: {report.provenance.recordCount.toLocaleString()}</p>
            <p>Analysis date: {report.provenance.analysisDate}</p>
            {report.provenance.calculationNotes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
            <p className="mt-3">Designed with reference to publicly available WHO data-visualization, immunization-monitoring and data-quality guidance. This is not an official WHO product and is not WHO-certified.</p>
          </section>
        </div>
      </Card>
    </div>
  );
}
