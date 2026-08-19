import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  ImageRun,
  PageBreak,
  AlignmentType,
  BorderStyle,
} from "docx";
import { ReportModel, ReportSection } from "@/types/epi/report";
import { KpiValue } from "@/types/epi/indicator";
import { TableSpec } from "@/types/epi/visualization";
import { renderChartToPng } from "./render-chart-png";

const PAGE = { width: 12240, height: 15840 }; // US Letter, DXA
const TABLE_WIDTH = 9360; // total usable width in DXA

function bodyParagraphs(body: string): Paragraph[] {
  return body
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => new Paragraph({ text: p, spacing: { after: 160 } }));
}

function kpiTable(kpis: KpiValue[]): Table {
  const colWidth = TABLE_WIDTH / 2;
  const headerRow = new TableRow({
    children: ["Indicator", "Value"].map(
      (h) =>
        new TableCell({
          width: { size: colWidth, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
        }),
    ),
  });
  const rows = kpis.map(
    (k) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: colWidth, type: WidthType.DXA }, children: [new Paragraph(k.label)] }),
          new TableCell({ width: { size: colWidth, type: WidthType.DXA }, children: [new Paragraph(`${k.value}${k.unit === "%" ? "%" : ""}`)] }),
        ],
      }),
  );
  return new Table({ width: { size: TABLE_WIDTH, type: WidthType.DXA }, columnWidths: [colWidth, colWidth], rows: [headerRow, ...rows] });
}

function dataTable(t: TableSpec): (Paragraph | Table)[] {
  const n = t.columns.length;
  const colWidth = Math.floor(TABLE_WIDTH / n);
  const widths = new Array(n).fill(colWidth);
  const headerRow = new TableRow({
    children: t.columns.map(
      (c) =>
        new TableCell({
          width: { size: colWidth, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
          children: [new Paragraph({ children: [new TextRun({ text: c.label, bold: true })] })],
        }),
    ),
  });
  const rows = t.rows.slice(0, 60).map(
    (r) =>
      new TableRow({
        children: t.columns.map(
          (c) =>
            new TableCell({
              width: { size: colWidth, type: WidthType.DXA },
              children: [new Paragraph(r[c.key] === null || r[c.key] === undefined ? "—" : String(r[c.key]))],
            }),
        ),
      }),
  );
  return [
    new Paragraph({ children: [new TextRun({ text: t.title, bold: true, size: 20 })], spacing: { before: 120, after: 80 } }),
    new Table({ width: { size: TABLE_WIDTH, type: WidthType.DXA }, columnWidths: widths, rows: [headerRow, ...rows] }),
    new Paragraph({ children: [new TextRun({ text: t.sourceNote, italics: true, size: 16, color: "6B7280" })], spacing: { before: 60, after: 160 } }),
  ];
}

async function chartImage(buffer: Buffer, w: number, h: number): Promise<Paragraph> {
  const displayWidth = 560;
  const displayHeight = Math.round((h / w) * displayWidth);
  return new Paragraph({
    children: [
      new ImageRun({
        data: buffer,
        transformation: { width: displayWidth, height: displayHeight },
        type: "png",
      }),
    ],
    spacing: { before: 100, after: 100 },
  });
}

async function sectionContent(section: ReportSection): Promise<(Paragraph | Table)[]> {
  const content: (Paragraph | Table)[] = [
    new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }),
    ...bodyParagraphs(section.body),
  ];

  if (section.kpis?.length) {
    content.push(kpiTable(section.kpis));
  }

  for (const chart of section.charts ?? []) {
    const { buffer, width, height } = await renderChartToPng(chart, 720);
    content.push(new Paragraph({ children: [new TextRun({ text: chart.title, bold: true, size: 20 })], spacing: { before: 160, after: 60 } }));
    content.push(await chartImage(buffer, width, height));
    content.push(new Paragraph({ children: [new TextRun({ text: chart.sourceNote, italics: true, size: 16, color: "6B7280" })], spacing: { after: 160 } }));
  }

  for (const table of section.tables ?? []) {
    content.push(...dataTable(table));
  }

  return content;
}

export async function buildDocxBuffer(report: ReportModel): Promise<Buffer> {
  const included = report.sections.filter((s) => s.included);
  const sectionContents = await Promise.all(included.map(sectionContent));

  const coverChildren: Paragraph[] = [
    new Paragraph({ text: report.title, heading: HeadingLevel.TITLE, alignment: AlignmentType.LEFT }),
    new Paragraph({ text: report.subtitle, spacing: { after: 300 } }),
    new Paragraph({ text: `Organization: ${report.organization || "—"}` }),
    new Paragraph({ text: `Programme: ${report.programme || "—"}` }),
    new Paragraph({ text: `Prepared by: ${report.preparedBy || "—"}` }),
    new Paragraph({ text: `Date: ${report.reportDate}` }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  const provenanceChildren: Paragraph[] = [
    new Paragraph({ text: "Data Source & Methodology", heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }),
    new Paragraph(`Data source: ${report.provenance.dataSource}`),
    new Paragraph(`Dataset: ${report.provenance.datasetLabel}`),
    new Paragraph(`Reporting period: ${report.provenance.reportingPeriod}`),
    new Paragraph(`Records: ${report.provenance.recordCount.toLocaleString()}`),
    new Paragraph(`Analysis date: ${report.provenance.analysisDate}`),
    ...report.provenance.calculationNotes.map((n) => new Paragraph(n)),
    new Paragraph({
      spacing: { before: 200 },
      children: [
        new TextRun({
          text: "Designed with reference to publicly available WHO data-visualization, immunization-monitoring and data-quality guidance. This is not an official WHO product and is not WHO-certified.",
          italics: true,
          size: 16,
          color: "6B7280",
        }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: { page: { size: PAGE, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
        headers: {
          default: new Header({
            children: [new Paragraph({ children: [new TextRun({ text: `${report.organization || ""}  ${report.title}`.trim(), size: 16, color: "6B7280" })] })],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" } },
                children: [
                  new TextRun({ text: "Page ", size: 16, color: "6B7280" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "6B7280" }),
                  new TextRun({ text: " of ", size: 16, color: "6B7280" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "6B7280" }),
                ],
              }),
            ],
          }),
        },
        children: [...coverChildren, ...sectionContents.flat(), ...provenanceChildren],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
