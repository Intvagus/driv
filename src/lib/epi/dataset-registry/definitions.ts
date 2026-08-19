import { DatasetDefinition } from "@/types/epi/dataset";

const geoColumns = [
  {
    key: "district",
    label: "District",
    required: true,
    dataType: "category" as const,
    aliases: ["district", "district_name", "district name", "zila"],
  },
  {
    key: "tehsil",
    label: "Tehsil",
    required: false,
    dataType: "category" as const,
    aliases: ["tehsil", "sub-district", "subdistrict", "taluka", "tehsil_name"],
  },
  {
    key: "facility",
    label: "Facility",
    required: false,
    dataType: "category" as const,
    aliases: ["facility", "facility_name", "health facility", "hf name", "site"],
  },
];

export const MR_LINELIST: DatasetDefinition = {
  id: "MR_LINELIST",
  name: "MR / Measles-Rubella Linelist",
  description: "Individual patient/child-level line list of MR case or vaccination records.",
  status: "supported",
  detection: {
    strongSignals: ["patient_id", "dob", "vaccination_date"],
    supportingSignals: ["age", "sex", "district", "vaccine", "dose", "vaccination_status"],
  },
  columns: [
    { key: "patient_id", label: "Child/Patient ID", required: false, dataType: "string", aliases: ["patient id", "child id", "id", "record id", "epid"] },
    { key: "name", label: "Name", required: false, dataType: "string", aliases: ["name", "child name", "patient name"] },
    { key: "dob", label: "Date of Birth", required: false, dataType: "date", aliases: ["dob", "date of birth", "birth date"] },
    { key: "age", label: "Age", required: false, dataType: "number", aliases: ["age", "age (months)", "age in months", "age_months", "age_years"] },
    { key: "sex", label: "Sex", required: true, dataType: "category", aliases: ["sex", "gender"], allowedValues: ["Male", "Female", "Other"] },
    ...geoColumns,
    { key: "vaccination_status", label: "Vaccination Status", required: true, dataType: "category", aliases: ["vaccination status", "status", "vaccinated"], allowedValues: ["Vaccinated", "Unvaccinated", "Unknown"] },
    { key: "vaccine", label: "Vaccine", required: false, dataType: "category", aliases: ["vaccine", "antigen", "vaccine name"] },
    { key: "dose", label: "Dose", required: false, dataType: "category", aliases: ["dose", "dose number"] },
    { key: "vaccination_date", label: "Vaccination Date", required: false, dataType: "date", aliases: ["vaccination date", "vacc date", "date vaccinated", "date"] },
    { key: "campaign", label: "Campaign", required: false, dataType: "category", aliases: ["campaign", "campaign name", "round"] },
    { key: "case_status", label: "Case Status", required: false, dataType: "category", aliases: ["case status", "case classification", "outcome"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "geographic_analysis", "trends", "key_findings", "recommendations", "limitations", "annex"],
};

export const COVERAGE: DatasetDefinition = {
  id: "COVERAGE",
  name: "Immunization Coverage",
  description: "Aggregated target population, vaccinated population and coverage by geography, antigen and period.",
  status: "supported",
  detection: {
    strongSignals: ["target_population", "vaccinated_population"],
    supportingSignals: ["district", "antigen", "reporting_period", "coverage"],
  },
  columns: [
    ...geoColumns,
    { key: "antigen", label: "Vaccine/Antigen", required: true, dataType: "category", aliases: ["antigen", "vaccine", "vaccine/antigen"] },
    { key: "dose", label: "Dose", required: false, dataType: "category", aliases: ["dose", "dose number"] },
    { key: "target_population", label: "Target Population", required: true, dataType: "number", aliases: ["target", "target population", "target_pop"] },
    { key: "vaccinated_population", label: "Vaccinated Population", required: true, dataType: "number", aliases: ["vaccinated", "vaccinated population", "achieved"] },
    { key: "coverage", label: "Coverage", required: false, dataType: "number", aliases: ["coverage", "coverage %", "coverage percent"] },
    { key: "reporting_period", label: "Reporting Period", required: true, dataType: "string", aliases: ["reporting period", "period", "month", "quarter", "year"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "geographic_analysis", "vaccine_analysis", "trends", "inequalities", "key_findings", "recommendations", "limitations", "annex"],
};

export const SESSION_MONITORING: DatasetDefinition = {
  id: "SESSION_MONITORING",
  name: "Session Monitoring",
  description: "Planned vs conducted immunization session data by facility/district and session type.",
  status: "supported",
  detection: {
    strongSignals: ["planned_sessions", "conducted_sessions"],
    supportingSignals: ["district", "facility", "session_type", "cancellation_reason"],
  },
  columns: [
    ...geoColumns,
    { key: "session_type", label: "Session Type", required: false, dataType: "category", aliases: ["session type", "type"], allowedValues: ["Fixed", "Outreach", "Mobile"] },
    { key: "planned_sessions", label: "Planned Sessions", required: true, dataType: "number", aliases: ["planned sessions", "planned", "target sessions"] },
    { key: "conducted_sessions", label: "Conducted Sessions", required: true, dataType: "number", aliases: ["conducted sessions", "conducted", "held sessions"] },
    { key: "cancelled_sessions", label: "Cancelled Sessions", required: false, dataType: "number", aliases: ["cancelled sessions", "cancelled"] },
    { key: "cancellation_reason", label: "Cancellation Reason", required: false, dataType: "category", aliases: ["cancellation reason", "reason"] },
    { key: "reporting_period", label: "Reporting Period", required: true, dataType: "string", aliases: ["reporting period", "period", "month"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "geographic_analysis", "trends", "key_findings", "recommendations", "limitations", "annex"],
};

export const ZERO_DOSE: DatasetDefinition = {
  id: "ZERO_DOSE",
  name: "Zero-Dose / Defaulter",
  description: "Children who have received no doses of a scheduled vaccine, or defaulted after a first dose.",
  status: "supported",
  detection: {
    strongSignals: ["zero_dose_status"],
    supportingSignals: ["age", "sex", "district", "follow_up_status"],
  },
  columns: [
    { key: "patient_id", label: "Child/Patient ID", required: false, dataType: "string", aliases: ["patient id", "child id", "id"] },
    { key: "age", label: "Age", required: false, dataType: "number", aliases: ["age", "age (months)", "age_months"] },
    { key: "sex", label: "Sex", required: true, dataType: "category", aliases: ["sex", "gender"], allowedValues: ["Male", "Female", "Other"] },
    ...geoColumns,
    { key: "zero_dose_status", label: "Zero-Dose Status", required: true, dataType: "category", aliases: ["zero dose status", "zero-dose", "status"], allowedValues: ["Zero-Dose", "Defaulter", "Vaccinated"] },
    { key: "follow_up_status", label: "Follow-up Status", required: false, dataType: "category", aliases: ["follow up status", "follow-up", "followup"] },
    { key: "reporting_period", label: "Reporting Period", required: false, dataType: "string", aliases: ["reporting period", "period", "month"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "geographic_analysis", "trends", "key_findings", "recommendations", "limitations", "annex"],
};

export const DEFAULTER: DatasetDefinition = {
  ...ZERO_DOSE,
  id: "DEFAULTER",
  name: "Defaulter Tracking",
  description: "Children who started but did not complete the vaccination schedule.",
};

export const AEFI: DatasetDefinition = {
  id: "AEFI",
  name: "AEFI (Adverse Events Following Immunization)",
  description: "Descriptive analysis of reported adverse events following immunization. No causality determination.",
  status: "coming_soon",
  detection: { strongSignals: ["event_category"], supportingSignals: ["vaccine", "age", "sex", "district", "report_date"] },
  columns: [
    { key: "event_category", label: "Event Category", required: true, dataType: "category", aliases: ["event category", "event type", "aefi type"] },
    { key: "vaccine", label: "Vaccine/Antigen", required: false, dataType: "category", aliases: ["vaccine", "antigen"] },
    { key: "age", label: "Age Group", required: false, dataType: "category", aliases: ["age group", "age"] },
    { key: "sex", label: "Sex", required: false, dataType: "category", aliases: ["sex", "gender"] },
    ...geoColumns,
    { key: "report_date", label: "Report Date", required: false, dataType: "date", aliases: ["report date", "date reported"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "key_findings", "limitations"],
};

export const STOCK: DatasetDefinition = {
  id: "STOCK",
  name: "Vaccine Stock / Logistics",
  description: "Opening stock, receipts, consumption, closing stock and wastage by facility/district.",
  status: "coming_soon",
  detection: { strongSignals: ["opening_stock", "closing_stock"], supportingSignals: ["receipts", "consumption", "wastage", "district"] },
  columns: [
    ...geoColumns,
    { key: "vaccine", label: "Vaccine", required: true, dataType: "category", aliases: ["vaccine", "antigen"] },
    { key: "opening_stock", label: "Opening Stock", required: true, dataType: "number", aliases: ["opening stock", "opening balance"] },
    { key: "receipts", label: "Receipts", required: false, dataType: "number", aliases: ["receipts", "received"] },
    { key: "consumption", label: "Consumption", required: false, dataType: "number", aliases: ["consumption", "used", "issued"] },
    { key: "closing_stock", label: "Closing Stock", required: true, dataType: "number", aliases: ["closing stock", "closing balance"] },
    { key: "wastage", label: "Wastage", required: false, dataType: "number", aliases: ["wastage", "wasted"] },
    { key: "reporting_period", label: "Reporting Period", required: false, dataType: "string", aliases: ["reporting period", "period", "month"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "key_findings", "limitations"],
};

export const ROUTINE_IMMUNIZATION: DatasetDefinition = {
  ...COVERAGE,
  id: "ROUTINE_IMMUNIZATION",
  name: "Routine Immunization",
  description: "Routine immunization service data (coming soon as a distinct module; currently analyzed via the Coverage module).",
  status: "coming_soon",
};

export const VPD_SURVEILLANCE: DatasetDefinition = {
  id: "VPD_SURVEILLANCE",
  name: "VPD Surveillance",
  description: "Vaccine-preventable disease surveillance case data.",
  status: "coming_soon",
  detection: { strongSignals: ["disease", "case_classification"], supportingSignals: ["district", "onset_date", "age", "sex"] },
  columns: [
    { key: "disease", label: "Disease", required: true, dataType: "category", aliases: ["disease", "disease name"] },
    { key: "case_classification", label: "Case Classification", required: false, dataType: "category", aliases: ["case classification", "classification"] },
    ...geoColumns,
    { key: "onset_date", label: "Onset Date", required: false, dataType: "date", aliases: ["onset date", "date of onset"] },
    { key: "age", label: "Age", required: false, dataType: "number", aliases: ["age"] },
    { key: "sex", label: "Sex", required: false, dataType: "category", aliases: ["sex", "gender"] },
  ],
  reportSections: ["executive_summary", "data_quality", "kpi_dashboard", "key_findings", "limitations"],
};

export const ALL_DATASET_DEFINITIONS: DatasetDefinition[] = [
  MR_LINELIST,
  COVERAGE,
  SESSION_MONITORING,
  ZERO_DOSE,
  DEFAULTER,
  AEFI,
  STOCK,
  ROUTINE_IMMUNIZATION,
  VPD_SURVEILLANCE,
];
