import { AnalysisResult } from "@/types/epi/analysis";
import { ColumnMapping, DatasetDefinition, DatasetTypeId } from "@/types/epi/dataset";
import { ChartSpec, TableSpec } from "@/types/epi/visualization";
import { DataQualityReport } from "@/types/epi/validation";
import { ReportModel, ReportSection, ReportSectionType, ReportTemplateId } from "@/types/epi/report";
import { ThresholdOverrides } from "../threshold-registry";
import { buildFindings } from "../findings-engine";
import { buildRecommendations } from "../recommendation-engine";
import { buildDataQualityChart, buildVisualizations } from "../visualization-engine";
import { getTemplate, SECTION_LABELS } from "./templates";
import { buildLimitations } from "./limitations";

export interface BuildReportInput {
  datasetId: DatasetTypeId;
  def: DatasetDefinition;
  analysis: AnalysisResult;
  quality: DataQualityReport;
  mappings: ColumnMapping[];
  sourceFileName: string;
  reportingPeriod: string;
  organization: string;
  programme: string;
  preparedBy: string;
  logoDataUrl?: string;
  template: ReportTemplateId;
  overrides?: ThresholdOverrides;
  sampleRecords: Record<string, unknown>[];
}

function fmtKpi(v: number | string, unit?: string): string {
  if (typeof v !== "number") return String(v);
  return unit === "%" ? `${v.toFixed(1)}%` : v.toLocaleString();
}

export function buildReportModel(input: BuildReportInput): ReportModel {
  const { datasetId, def, analysis, quality, mappings, sourceFileName, reportingPeriod, template, overrides } = input;
  const sourceLabel = `Uploaded file: ${sourceFileName}`;
  const meta = { datasetLabel: def.name, period: reportingPeriod, sourceLabel };

  const { charts: analysisCharts, tables: analysisTables } = buildVisualizations(analysis, meta);
  const qualityChart = buildDataQualityChart(quality, meta);

  const findings = buildFindings(analysis, quality, overrides);
  const recommendations = buildRecommendations(analysis, quality, overrides);
  const limitations = buildLimitations(quality, analysis, mappings, def);

  const primaryKpi = analysis.kpis.find((k) => k.band !== undefined) ?? analysis.kpis[0];
  const executiveSummary = [
    `This report presents analysis of ${analysis.recordCount.toLocaleString()} record(s) from the ${def.name} dataset for the reporting period ${reportingPeriod}, sourced from "${sourceFileName}".`,
    primaryKpi ? `Overall ${primaryKpi.label.toLowerCase()} was ${fmtKpi(primaryKpi.value, primaryKpi.unit)}.` : "",
    `Overall data quality was assessed at ${quality.overallScore.toFixed(1)}% (see Data Quality Assessment for methodology).`,
    `${findings.length} key finding(s) and ${recommendations.length} recommendation(s) are presented below.`,
  ]
    .filter(Boolean)
    .join(" ");

  const mappedList = mappings
    .filter((m) => m.uploadedHeader)
    .map((m) => `${def.columns.find((c) => c.key === m.systemField)?.label ?? m.systemField} ← "${m.uploadedHeader}"`)
    .join("; ");
  const methodologyBody = [
    `Dataset type: ${def.name}. ${def.description}`,
    `Column mapping applied: ${mappedList || "none"}.`,
    primaryKpi?.guidance
      ? `Primary indicator calculation — ${primaryKpi.guidance.label}: ${primaryKpi.guidance.calculationMethod}. Source: ${primaryKpi.guidance.source}.`
      : "",
    "Designed with reference to publicly available WHO data-design and immunization-monitoring principles; this is not an official WHO output and has not been certified by WHO.",
  ]
    .filter(Boolean)
    .join(" ");

  const sectionBuilders: Partial<Record<ReportSectionType, () => ReportSection>> = {
    executive_summary: () => ({ id: "executive_summary", type: "executive_summary", title: SECTION_LABELS.executive_summary, body: executiveSummary, included: true }),
    methodology: () => ({ id: "methodology", type: "methodology", title: SECTION_LABELS.methodology, body: methodologyBody, included: true }),
    data_quality: () => ({
      id: "data_quality",
      type: "data_quality",
      title: SECTION_LABELS.data_quality,
      body: quality.methodologyNote,
      included: true,
      charts: [qualityChart],
      tables: [issuesTable(quality)],
    }),
    kpi_dashboard: () => ({ id: "kpi_dashboard", type: "kpi_dashboard", title: SECTION_LABELS.kpi_dashboard, body: "", included: true, kpis: analysis.kpis }),
    key_findings: () => ({
      id: "key_findings",
      type: "key_findings",
      title: SECTION_LABELS.key_findings,
      body: findings.map((f, i) => `${i + 1}. ${f.text}`).join("\n\n"),
      included: true,
    }),
    geographic_analysis: () =>
      analysis.districtBreakdown.length > 0
        ? {
            id: "geographic_analysis",
            type: "geographic_analysis",
            title: SECTION_LABELS.geographic_analysis,
            body: `${analysis.districtMetricLabel} by district for ${reportingPeriod}.`,
            included: true,
            charts: analysisCharts.filter((c) => c.id === "district-comparison"),
            tables: analysisTables.filter((t) => t.id === "district-table"),
          }
        : skip("geographic_analysis"),
    vaccine_analysis: () => {
      const antigenCb = analysis.categoryBreakdowns.find((c) => c.dimensionKey === "antigen");
      return antigenCb
        ? {
            id: "vaccine_analysis",
            type: "vaccine_analysis",
            title: SECTION_LABELS.vaccine_analysis,
            body: `${antigenCb.dimensionLabel} coverage for ${reportingPeriod}.`,
            included: true,
            charts: analysisCharts.filter((c) => c.id === "composition-antigen"),
          }
        : skip("vaccine_analysis");
    },
    trends: () =>
      analysis.timeBreakdown.length >= 2
        ? {
            id: "trends",
            type: "trends",
            title: SECTION_LABELS.trends,
            body: `${analysis.timeMetricLabel} trend across ${analysis.timeBreakdown.length} reporting periods.`,
            included: true,
            charts: analysisCharts.filter((c) => c.id === "trend"),
          }
        : skip("trends"),
    inequalities: () => {
      if (analysis.districtBreakdown.length < 2) return skip("inequalities");
      const sorted = [...analysis.districtBreakdown].sort((a, b) => b.value - a.value);
      const gap = sorted[0].value - sorted[sorted.length - 1].value;
      return {
        id: "inequalities",
        type: "inequalities",
        title: SECTION_LABELS.inequalities,
        body: `The gap between the highest- and lowest-performing districts was ${gap.toFixed(1)}${analysis.districtMetricUnit === "%" ? " percentage points" : ""} (${sorted[0].district}: ${fmtKpi(sorted[0].value, analysis.districtMetricUnit)} vs ${sorted[sorted.length - 1].district}: ${fmtKpi(sorted[sorted.length - 1].value, analysis.districtMetricUnit)}). This describes the observed spread and does not by itself establish its cause.`,
        included: true,
      };
    },
    recommendations: () => ({
      id: "recommendations",
      type: "recommendations",
      title: SECTION_LABELS.recommendations,
      body: recommendations.map((r, i) => `${i + 1}. ${r.text}`).join("\n\n"),
      included: true,
    }),
    limitations: () => ({
      id: "limitations",
      type: "limitations",
      title: SECTION_LABELS.limitations,
      body: limitations.length > 0 ? limitations.map((l) => `• ${l}`).join("\n\n") : "No material data limitations were automatically identified for this dataset.",
      included: true,
    }),
    annex: () => ({
      id: "annex",
      type: "annex",
      title: SECTION_LABELS.annex,
      body: `A sample of the cleaned dataset is shown below (first ${Math.min(50, input.sampleRecords.length)} of ${analysis.recordCount.toLocaleString()} records). Export to Excel for the complete dataset.`,
      included: true,
      tables: [annexTable(input, def)],
    }),
    programme_performance: () => skip("programme_performance"),
  };

  function skip(id: ReportSectionType): ReportSection {
    return { id, type: id, title: SECTION_LABELS[id], body: "", included: false };
  }

  const tmpl = getTemplate(template);
  const sections = tmpl.sections
    .filter((s) => s !== "cover")
    .map((s) => sectionBuilders[s]?.())
    .filter((s): s is ReportSection => !!s);

  return {
    id: `report-${Date.now()}`,
    template,
    title: `${def.name} Report`,
    subtitle: `${input.programme} — ${reportingPeriod}`,
    organization: input.organization,
    programme: input.programme,
    preparedBy: input.preparedBy,
    reportDate: new Date().toISOString().slice(0, 10),
    logoDataUrl: input.logoDataUrl,
    sections,
    findings,
    recommendations,
    limitations,
    provenance: {
      dataSource: input.organization || "EPI MIS",
      datasetLabel: def.name,
      reportingPeriod,
      recordCount: analysis.recordCount,
      analysisDate: new Date().toISOString().slice(0, 10),
      calculationNotes: primaryKpi?.guidance ? [`${primaryKpi.guidance.label}: ${primaryKpi.guidance.calculationMethod}`] : [],
    },
    dataQuality: quality,
    generatedAt: new Date().toISOString(),
  };
}

function issuesTable(quality: DataQualityReport): TableSpec {
  return {
    id: "quality-issues",
    title: "Data quality issues",
    columns: [
      { key: "ruleId", label: "Rule", align: "left" },
      { key: "description", label: "Description", align: "left" },
      { key: "severity", label: "Severity", align: "left" },
      { key: "affectedRecordCount", label: "Affected Records", align: "right", format: "integer" },
      { key: "recommendedAction", label: "Recommended Action", align: "left" },
    ],
    rows: quality.issues.map((i) => ({
      ruleId: i.ruleId,
      description: i.description,
      severity: i.severity,
      affectedRecordCount: i.affectedRecordCount,
      recommendedAction: i.recommendedAction,
    })),
    sourceNote: quality.methodologyNote,
  };
}

function annexTable(input: BuildReportInput, def: DatasetDefinition): TableSpec {
  const cols = def.columns.filter((c) => input.mappings.some((m) => m.systemField === c.key && m.uploadedHeader));
  return {
    id: "annex-sample",
    title: "Detailed data table (sample)",
    columns: cols.map((c) => ({ key: c.key, label: c.label, align: c.dataType === "number" ? "right" : "left" })),
    rows: input.sampleRecords.slice(0, 50).map((r) => {
      const row: Record<string, string | number | null> = {};
      for (const c of cols) {
        const v = r[c.key];
        row[c.key] = v === null || v === undefined ? null : (v as string | number);
      }
      return row;
    }),
    sourceNote: `Source: ${input.sourceFileName}. Full dataset available via Excel export.`,
  };
}
