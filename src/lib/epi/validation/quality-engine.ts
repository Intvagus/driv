import { CleanedRecord, DatasetTypeId } from "@/types/epi/dataset";
import { DataQualityReport, ValidationIssue } from "@/types/epi/validation";
import { getDatasetDefinition } from "../dataset-registry";

/** Fields per dataset whose combination should be unique (used for potential-duplicate detection). */
const DUPLICATE_KEY_FIELDS: Partial<Record<DatasetTypeId, string[]>> = {
  MR_LINELIST: ["name", "dob", "district"],
  COVERAGE: ["district", "tehsil", "antigen", "dose", "reporting_period"],
  SESSION_MONITORING: ["facility", "session_type", "reporting_period"],
  ZERO_DOSE: ["district", "sex", "age", "reporting_period"],
  DEFAULTER: ["district", "sex", "age", "reporting_period"],
};

/** Date fields that should never be in the future. */
const NO_FUTURE_DATE_FIELDS = ["dob", "vaccination_date", "report_date", "onset_date"];

function isBlank(v: unknown): boolean {
  return v === null || v === undefined || v === "";
}

function pushIssue(issues: ValidationIssue[], issue: ValidationIssue) {
  if (issue.affectedRecordCount > 0) issues.push(issue);
}

export function assessDataQuality(
  datasetId: DatasetTypeId,
  records: CleanedRecord[],
): DataQualityReport {
  const def = getDatasetDefinition(datasetId);
  const requiredCols = def.columns.filter((c) => c.required);
  const issues: ValidationIssue[] = [];
  const n = records.length;

  // --- Completeness ---
  let missingRequiredCells = 0;
  for (const col of requiredCols) {
    const missingIdx: number[] = [];
    records.forEach((r, i) => {
      if (isBlank(r[col.key])) missingIdx.push(i);
    });
    missingRequiredCells += missingIdx.length;
    pushIssue(issues, {
      ruleId: `COMPLETE-${col.key.toUpperCase()}`,
      category: "completeness",
      description: `Missing required field "${col.label}"`,
      severity: missingIdx.length / n > 0.2 ? "critical" : "warning",
      affectedRecordCount: missingIdx.length,
      affectedRecordIndices: missingIdx,
      recommendedAction: `Review source data and complete "${col.label}" for the affected records before analysis.`,
    });
  }
  const totalRequiredCells = Math.max(requiredCols.length * n, 1);
  const completenessScore = 100 * (1 - missingRequiredCells / totalRequiredCells);

  // --- Validity: coercion failures (invalid dates/numbers), future dates, negative values ---
  let invalidCells = 0;
  let checkedCells = 0;
  const dateFields = def.columns.filter((c) => c.dataType === "date").map((c) => c.key);
  const numberFields = def.columns.filter((c) => c.dataType === "number").map((c) => c.key);

  const invalidIdx: number[] = [];
  records.forEach((r, i) => {
    const inv = (r.__invalidFields as string[] | undefined) ?? [];
    if (inv.length > 0) invalidIdx.push(i);
  });
  invalidCells += records.reduce((sum, r) => sum + ((r.__invalidFields as string[] | undefined)?.length ?? 0), 0);
  checkedCells += (dateFields.length + numberFields.length) * n;
  pushIssue(issues, {
    ruleId: "VALID-UNPARSEABLE",
    category: "validity",
    description: "Values present but not parseable as the expected type (date/number)",
    severity: "warning",
    affectedRecordCount: invalidIdx.length,
    affectedRecordIndices: invalidIdx,
    recommendedAction: "Correct the source values or reformat as a standard date/number before re-upload.",
  });

  for (const field of NO_FUTURE_DATE_FIELDS.filter((f) => dateFields.includes(f))) {
    const today = new Date().toISOString().slice(0, 10);
    const futureIdx: number[] = [];
    records.forEach((r, i) => {
      const v = r[field] as string | null;
      if (v && v > today) futureIdx.push(i);
    });
    invalidCells += futureIdx.length;
    pushIssue(issues, {
      ruleId: `VALID-FUTURE-${field.toUpperCase()}`,
      category: "validity",
      description: `"${field}" contains a date in the future`,
      severity: "critical",
      affectedRecordCount: futureIdx.length,
      affectedRecordIndices: futureIdx,
      recommendedAction: "Verify and correct dates recorded in the future.",
    });
  }

  for (const field of numberFields) {
    const negIdx: number[] = [];
    records.forEach((r, i) => {
      const v = r[field] as number | null;
      if (v !== null && v < 0) negIdx.push(i);
    });
    invalidCells += negIdx.length;
    pushIssue(issues, {
      ruleId: `VALID-NEGATIVE-${field.toUpperCase()}`,
      category: "validity",
      description: `"${field}" contains negative values`,
      severity: "critical",
      affectedRecordCount: negIdx.length,
      affectedRecordIndices: negIdx,
      recommendedAction: "Negative counts are not valid; verify source data entry.",
    });
  }
  const validityScore = checkedCells > 0 ? 100 * (1 - invalidCells / checkedCells) : 100;

  // --- Consistency: dataset-specific logical rules ---
  let consistencyFlagged = new Set<number>();
  if (datasetId === "COVERAGE") {
    const idx: number[] = [];
    records.forEach((r, i) => {
      const target = r.target_population as number | null;
      const vaccinated = r.vaccinated_population as number | null;
      if (target !== null && vaccinated !== null && target > 0) {
        const computed = (vaccinated / target) * 100;
        if (computed > 105) idx.push(i);
      }
      if (target !== null && target <= 0) idx.push(i);
    });
    idx.forEach((i) => consistencyFlagged.add(i));
    pushIssue(issues, {
      ruleId: "CONSIST-COVERAGE-EXCEEDS-100",
      category: "consistency",
      description: "Computed coverage (vaccinated ÷ target × 100) exceeds 105% or target population is zero/negative",
      severity: "warning",
      affectedRecordCount: idx.length,
      affectedRecordIndices: idx,
      recommendedAction: "Coverage above 100% can occur with denominator issues; verify target population and vaccinated counts.",
    });
  }
  if (datasetId === "SESSION_MONITORING") {
    const idx: number[] = [];
    records.forEach((r, i) => {
      const planned = r.planned_sessions as number | null;
      const conducted = r.conducted_sessions as number | null;
      if (planned !== null && conducted !== null && conducted > planned) idx.push(i);
    });
    idx.forEach((i) => consistencyFlagged.add(i));
    pushIssue(issues, {
      ruleId: "CONSIST-SESSIONS-EXCEED-PLANNED",
      category: "consistency",
      description: "Conducted sessions exceed planned sessions",
      severity: "warning",
      affectedRecordCount: idx.length,
      affectedRecordIndices: idx,
      recommendedAction: "Verify planned vs conducted session counts for the affected records.",
    });
  }

  // Geographic hierarchy: a tehsil mapped to more than one district suggests an entry error.
  if (def.columns.some((c) => c.key === "tehsil") && def.columns.some((c) => c.key === "district")) {
    const tehsilToDistricts = new Map<string, Set<string>>();
    records.forEach((r) => {
      const tehsil = r.tehsil as string | null;
      const district = r.district as string | null;
      if (tehsil && district) {
        if (!tehsilToDistricts.has(tehsil)) tehsilToDistricts.set(tehsil, new Set());
        tehsilToDistricts.get(tehsil)!.add(district);
      }
    });
    const conflictingTehsils = new Set([...tehsilToDistricts.entries()].filter(([, ds]) => ds.size > 1).map(([t]) => t));
    const idx: number[] = [];
    records.forEach((r, i) => {
      const tehsil = r.tehsil as string | null;
      if (tehsil && conflictingTehsils.has(tehsil)) idx.push(i);
    });
    idx.forEach((i) => consistencyFlagged.add(i));
    pushIssue(issues, {
      ruleId: "GEO-TEHSIL-DISTRICT-MISMATCH",
      category: "geographic",
      description: "The same tehsil name is associated with more than one district in this dataset",
      severity: "warning",
      affectedRecordCount: idx.length,
      affectedRecordIndices: idx,
      recommendedAction: "Confirm the correct district for the affected tehsils; this often indicates a spelling or entry inconsistency.",
    });
  }

  const consistencyScore = 100 * (1 - consistencyFlagged.size / Math.max(n, 1));

  // --- Duplicate detection ---
  const exactSeen = new Map<string, number[]>();
  records.forEach((r, i) => {
    const key = JSON.stringify(
      Object.keys(r)
        .filter((k) => !k.startsWith("__"))
        .sort()
        .map((k) => [k, r[k]]),
    );
    if (!exactSeen.has(key)) exactSeen.set(key, []);
    exactSeen.get(key)!.push(i);
  });
  const exactDupIdx: number[] = [];
  for (const idxs of exactSeen.values()) {
    if (idxs.length > 1) exactDupIdx.push(...idxs.slice(1));
  }
  pushIssue(issues, {
    ruleId: "DUP-EXACT",
    category: "duplicate",
    description: "Exact duplicate records (identical across all mapped fields)",
    severity: "critical",
    affectedRecordCount: exactDupIdx.length,
    affectedRecordIndices: exactDupIdx,
    recommendedAction: "Remove exact duplicate records before final analysis, or confirm they represent distinct events.",
  });

  const keyFields = DUPLICATE_KEY_FIELDS[datasetId];
  let potentialDupIdx: number[] = [];
  if (keyFields) {
    const seen = new Map<string, number[]>();
    records.forEach((r, i) => {
      if (keyFields.some((f) => isBlank(r[f]))) return;
      const key = keyFields.map((f) => String(r[f]).toLowerCase()).join("|");
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(i);
    });
    for (const idxs of seen.values()) {
      if (idxs.length > 1) potentialDupIdx.push(...idxs.slice(1));
    }
    pushIssue(issues, {
      ruleId: "DUP-POTENTIAL",
      category: "duplicate",
      description: `Potential duplicate records (matching on ${keyFields.join(", ")})`,
      severity: "warning",
      affectedRecordCount: potentialDupIdx.length,
      affectedRecordIndices: potentialDupIdx,
      recommendedAction: "Review potential duplicates manually; matching key fields do not guarantee a true duplicate.",
    });
  }
  const uniqueDupRecords = new Set([...exactDupIdx, ...potentialDupIdx]).size;
  const uniquenessScore = 100 * (1 - uniqueDupRecords / Math.max(n, 1));

  const dimensions = [
    { dimension: "completeness" as const, score: round1(completenessScore), methodology: "1 − (missing required-field cells ÷ total required-field cells), by record." },
    { dimension: "validity" as const, score: round1(validityScore), methodology: "1 − (invalid/future/negative values ÷ checked date & numeric cells)." },
    { dimension: "consistency" as const, score: round1(consistencyScore), methodology: "1 − (records failing dataset-specific logical rules ÷ total records)." },
    { dimension: "uniqueness" as const, score: round1(uniquenessScore), methodology: "1 − (exact + potential duplicate records ÷ total records)." },
  ];
  const overallScore = round1(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);

  return {
    dimensions,
    overallScore,
    issues: issues.sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
    totalRecords: n,
    methodologyNote:
      "Overall score is the unweighted average of four dimension scores: Completeness, Validity, Consistency and Uniqueness, each computed directly from this dataset (see each dimension's methodology). Thresholds and rules can be reconfigured; this is not an externally imposed WHO score.",
  };
}

function severityRank(s: ValidationIssue["severity"]): number {
  return s === "critical" ? 0 : s === "warning" ? 1 : 2;
}

function round1(n: number): number {
  return Math.round(Math.max(0, Math.min(100, n)) * 10) / 10;
}
