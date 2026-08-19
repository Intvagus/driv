import pptxgen from "pptxgenjs";
import { ReportModel } from "@/types/epi/report";
import { ChartSpec } from "@/types/epi/visualization";
import { downloadBlob, slugify } from "./download";

const NAVY = "0F2A3A";
const BLUE = "1170AA";
const GRAY = "6B7280";

function addTitleSlide(pres: pptxgen, report: ReportModel) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.4, fill: { color: NAVY } });
  slide.addText(report.title, { x: 0.5, y: 0.35, w: 9, h: 0.8, fontSize: 24, bold: true, color: "FFFFFF" });
  slide.addText(report.subtitle, { x: 0.5, y: 1.8, w: 9, fontSize: 16, color: GRAY });
  slide.addText(
    [
      { text: `Organization: ${report.organization || "—"}\n`, options: { fontSize: 12 } },
      { text: `Prepared by: ${report.preparedBy || "—"}\n`, options: { fontSize: 12 } },
      { text: `Date: ${report.reportDate}`, options: { fontSize: 12 } },
    ],
    { x: 0.5, y: 2.6, w: 6, color: GRAY },
  );
  slide.addText("Designed with reference to publicly available WHO data-visualization principles. Not an official WHO product.", {
    x: 0.5,
    y: 6.9,
    w: 9,
    fontSize: 8,
    color: GRAY,
    italic: true,
  });
}

function addBulletSlide(pres: pptxgen, title: string, bullets: string[]) {
  if (bullets.length === 0) return;
  const slide = pres.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, fontSize: 20, bold: true, color: NAVY });
  slide.addText(
    bullets.map((b) => ({ text: b, options: { bullet: true, breakLine: true, fontSize: 13, color: "1F2937", paraSpaceAfter: 8 } })),
    { x: 0.5, y: 1.1, w: 9, h: 5.5 },
  );
}

function addKpiSlide(pres: pptxgen, report: ReportModel) {
  const kpis = report.sections.find((s) => s.type === "kpi_dashboard")?.kpis ?? [];
  if (kpis.length === 0) return;
  const slide = pres.addSlide();
  slide.addText("KPI Dashboard", { x: 0.5, y: 0.3, w: 9, fontSize: 20, bold: true, color: NAVY });
  const rows: pptxgen.TableRow[] = [
    [{ text: "Indicator", options: { bold: true } }, { text: "Value", options: { bold: true } }],
    ...kpis.map((k) => [{ text: k.label }, { text: `${k.value}${k.unit === "%" ? "%" : ""}` }]),
  ];
  slide.addTable(rows, { x: 0.5, y: 1.1, w: 9, fontSize: 12, border: { type: "solid", color: "E2E8F0" }, autoPage: false });
}

function addChartSlide(pres: pptxgen, chart: ChartSpec) {
  const slide = pres.addSlide();
  slide.addText(chart.title, { x: 0.5, y: 0.3, w: 9, fontSize: 18, bold: true, color: NAVY });

  if ((chart.kind === "bar_horizontal" || chart.kind === "bar_vertical") && chart.data.length > 0) {
    slide.addChart(
      chart.kind === "bar_horizontal" ? pres.ChartType.bar : pres.ChartType.bar,
      [{ name: chart.title, labels: chart.data.map((d) => d.label), values: chart.data.map((d) => d.value) }],
      { x: 0.5, y: 1.1, w: 9, h: 5, barDir: chart.kind === "bar_horizontal" ? "bar" : "col", chartColors: [BLUE], showValue: true },
    );
  } else if (chart.kind === "line" && chart.data.length > 0) {
    slide.addChart(pres.ChartType.line, [{ name: chart.title, labels: chart.data.map((d) => d.label), values: chart.data.map((d) => d.value) }], {
      x: 0.5,
      y: 1.1,
      w: 9,
      h: 5,
      chartColors: [BLUE],
      showValue: true,
    });
  } else {
    slide.addText(chart.data.map((d) => `${d.label}: ${d.value}${chart.unit ?? ""}`).join("\n"), { x: 0.5, y: 1.1, w: 9, h: 5, fontSize: 12 });
  }
  slide.addText(chart.sourceNote, { x: 0.5, y: 6.9, w: 9, fontSize: 8, color: GRAY, italic: true });
}

/** Builds an editable PowerPoint deck client-side. Bar/line charts use pptxgenjs native
 *  chart objects so they remain editable in PowerPoint (per spec requirement). */
export async function exportPptx(report: ReportModel) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "EPI", width: 10, height: 7.5 });
  pres.layout = "EPI";

  addTitleSlide(pres, report);

  const execSummary = report.sections.find((s) => s.type === "executive_summary");
  if (execSummary?.body) {
    addBulletSlide(pres, "Executive Summary", execSummary.body.split("\n\n"));
  }

  addKpiSlide(pres, report);
  addBulletSlide(pres, "Major Findings", report.findings.map((f) => f.text));

  for (const section of report.sections) {
    for (const chart of section.charts ?? []) {
      addChartSlide(pres, chart);
    }
  }

  addBulletSlide(pres, "Recommendations", report.recommendations.map((r) => r.text));

  const blob = (await pres.write({ outputType: "blob" })) as Blob;
  downloadBlob(blob, `${slugify(report.title)}.pptx`);
}
