import React from "react";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { ReportModel, ReportSection } from "@/types/epi/report";
import { TableSpec } from "@/types/epi/visualization";
import { renderChartToPng } from "./render-chart-png";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#1F2937" },
  h1: { fontSize: 22, fontWeight: 700, color: "#0F2A3A", marginBottom: 6 },
  subtitle: { fontSize: 12, color: "#4B5563", marginBottom: 16 },
  metaLine: { fontSize: 10, color: "#4B5563", marginBottom: 2 },
  h2: { fontSize: 14, fontWeight: 700, color: "#0F2A3A", marginTop: 18, marginBottom: 8 },
  paragraph: { fontSize: 10, lineHeight: 1.5, marginBottom: 8 },
  chartTitle: { fontSize: 11, fontWeight: 700, marginTop: 10, marginBottom: 4 },
  sourceNote: { fontSize: 8, color: "#6B7280", marginTop: 4, marginBottom: 10, fontStyle: "italic" },
  image: { marginVertical: 4 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  kpiCard: { width: 140, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 4, padding: 8, marginRight: 8, marginBottom: 8 },
  kpiLabel: { fontSize: 8, color: "#6B7280" },
  kpiValue: { fontSize: 14, fontWeight: 700, color: "#0F2A3A" },
  table: { borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 10 },
  tr: { flexDirection: "row" },
  th: { flex: 1, backgroundColor: "#F1F5F9", padding: 4, fontSize: 8, fontWeight: 700, borderRightWidth: 1, borderColor: "#E2E8F0" },
  td: { flex: 1, padding: 4, fontSize: 8, borderTopWidth: 1, borderRightWidth: 1, borderColor: "#E2E8F0" },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, fontSize: 8, color: "#6B7280", textAlign: "center", borderTopWidth: 1, borderColor: "#E2E8F0", paddingTop: 4 },
});

function PdfTable({ table }: { table: TableSpec }) {
  return (
    <View style={styles.table}>
      <View style={styles.tr}>
        {table.columns.map((c) => (
          <Text key={c.key} style={styles.th}>
            {c.label}
          </Text>
        ))}
      </View>
      {table.rows.slice(0, 40).map((row, i) => (
        <View style={styles.tr} key={i}>
          {table.columns.map((c) => (
            <Text key={c.key} style={styles.td}>
              {row[c.key] === null || row[c.key] === undefined ? "—" : String(row[c.key])}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

async function SectionBlock({ section }: { section: ReportSection }) {
  const chartImages = await Promise.all((section.charts ?? []).map(async (c) => ({ chart: c, ...(await renderChartToPng(c, 680)) })));
  return (
    <View>
      <Text style={styles.h2}>{section.title}</Text>
      {section.body
        .split("\n\n")
        .filter((p) => p.trim())
        .map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}
      {section.kpis && (
        <View style={styles.kpiGrid}>
          {section.kpis.map((k) => (
            <View key={k.key} style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={styles.kpiValue}>
                {k.value}
                {k.unit === "%" ? "%" : ""}
              </Text>
            </View>
          ))}
        </View>
      )}
      {chartImages.map(({ chart, buffer, width, height }) => (
        <View key={chart.id}>
          <Image src={{ data: buffer, format: "png" }} style={{ ...styles.image, width: 480, height: (height / width) * 480 }} />
          <Text style={styles.sourceNote}>{chart.sourceNote}</Text>
        </View>
      ))}
      {(section.tables ?? []).map((t) => (
        <View key={t.id}>
          <Text style={styles.chartTitle}>{t.title}</Text>
          <PdfTable table={t} />
          <Text style={styles.sourceNote}>{t.sourceNote}</Text>
        </View>
      ))}
    </View>
  );
}

export async function buildPdfBuffer(report: ReportModel): Promise<Buffer> {
  const included = report.sections.filter((s) => s.included);
  const sectionElements = await Promise.all(included.map((s) => SectionBlock({ section: s })));

  const doc = (
    <Document title={report.title} creator="EPI Data Analytics Platform">
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.h1}>{report.title}</Text>
        <Text style={styles.subtitle}>{report.subtitle}</Text>
        <Text style={styles.metaLine}>Organization: {report.organization || "—"}</Text>
        <Text style={styles.metaLine}>Programme: {report.programme || "—"}</Text>
        <Text style={styles.metaLine}>Prepared by: {report.preparedBy || "—"}</Text>
        <Text style={styles.metaLine}>Date: {report.reportDate}</Text>

        {sectionElements}

        <View style={{ marginTop: 16 }}>
          <Text style={styles.h2}>Data Source & Methodology</Text>
          <Text style={styles.paragraph}>Data source: {report.provenance.dataSource}</Text>
          <Text style={styles.paragraph}>Dataset: {report.provenance.datasetLabel}</Text>
          <Text style={styles.paragraph}>Reporting period: {report.provenance.reportingPeriod}</Text>
          <Text style={styles.paragraph}>Records: {report.provenance.recordCount.toLocaleString()}</Text>
          <Text style={styles.paragraph}>Analysis date: {report.provenance.analysisDate}</Text>
          {report.provenance.calculationNotes.map((n, i) => (
            <Text key={i} style={styles.paragraph}>
              {n}
            </Text>
          ))}
          <Text style={styles.sourceNote}>
            Designed with reference to publicly available WHO data-visualization, immunization-monitoring and data-quality guidance. This is not an official WHO product and is not WHO-certified.
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
