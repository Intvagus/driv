import { ReportSectionType, ReportTemplateId } from "@/types/epi/report";

export const REPORT_TEMPLATES: { id: ReportTemplateId; label: string; description: string; sections: ReportSectionType[] }[] = [
  {
    id: "who_professional",
    label: "WHO / Public Health Professional",
    description: "Minimal, analytical, evidence-focused — designed with reference to publicly available WHO data-design principles.",
    sections: ["cover", "executive_summary", "methodology", "data_quality", "kpi_dashboard", "key_findings", "geographic_analysis", "vaccine_analysis", "trends", "inequalities", "recommendations", "limitations", "annex"],
  },
  {
    id: "executive",
    label: "Executive",
    description: "Short and decision-oriented.",
    sections: ["cover", "executive_summary", "kpi_dashboard", "key_findings", "recommendations"],
  },
  {
    id: "technical",
    label: "Technical",
    description: "Detailed methodology, indicators, tables and data-quality information.",
    sections: ["cover", "executive_summary", "methodology", "data_quality", "kpi_dashboard", "geographic_analysis", "vaccine_analysis", "trends", "inequalities", "key_findings", "recommendations", "limitations", "annex"],
  },
  {
    id: "field_monitoring",
    label: "Field Monitoring",
    description: "District/facility-focused.",
    sections: ["cover", "executive_summary", "kpi_dashboard", "geographic_analysis", "key_findings", "recommendations", "limitations"],
  },
  {
    id: "custom",
    label: "Custom",
    description: "Choose your own sections.",
    sections: ["cover", "executive_summary", "kpi_dashboard", "key_findings", "recommendations"],
  },
];

export function getTemplate(id: ReportTemplateId) {
  return REPORT_TEMPLATES.find((t) => t.id === id) ?? REPORT_TEMPLATES[0];
}

export const SECTION_LABELS: Record<ReportSectionType, string> = {
  cover: "Cover Page",
  executive_summary: "Executive Summary",
  methodology: "Dataset & Methodology",
  data_quality: "Data Quality Assessment",
  kpi_dashboard: "KPI Dashboard",
  key_findings: "Key Findings",
  programme_performance: "Programme Performance",
  geographic_analysis: "Geographic Analysis",
  vaccine_analysis: "Vaccine/Antigen Analysis",
  trends: "Trends",
  inequalities: "Inequalities / Gaps",
  recommendations: "Recommendations",
  limitations: "Data Limitations",
  annex: "Annex",
  custom_text: "Custom Section",
};
