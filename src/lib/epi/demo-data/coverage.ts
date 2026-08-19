import { ParsedTable } from "@/types/epi/dataset";
import { DEMO_DISTRICTS, pick, seededRandom } from "./shared";

const ANTIGENS = ["Penta-1", "Penta-3", "Measles-1", "Measles-2"];
const PERIODS = ["2026-Q1", "2026-Q2"];

/** Fictional immunization coverage demo data, including an intentional target/coverage inconsistency. */
export function generateCoverageDemo(): ParsedTable {
  const rnd = seededRandom(23);
  const headers = ["District_Name", "Antigen", "Dose", "Target", "Vaccinated", "Coverage %", "Reporting Period"];
  const rows: Record<string, unknown>[] = [];

  // District performance baseline so low performers are consistent and realistic.
  const districtBaseline: Record<string, number> = {};
  DEMO_DISTRICTS.forEach((d, i) => {
    districtBaseline[d] = i < 2 ? 0.55 + rnd() * 0.1 : 0.75 + rnd() * 0.22;
  });

  for (const district of DEMO_DISTRICTS) {
    for (const antigen of ANTIGENS) {
      for (const period of PERIODS) {
        const target = 8000 + Math.floor(rnd() * 6000);
        const antigenAdj = antigen === "Measles-2" ? -0.08 : 0;
        const rate = Math.min(1.02, Math.max(0.3, districtBaseline[district] + antigenAdj + (rnd() - 0.5) * 0.05));
        const vaccinated = Math.round(target * rate);
        rows.push({
          District_Name: district,
          Antigen: antigen,
          Dose: antigen.includes("-") ? antigen.split("-")[1] : "1",
          Target: target,
          Vaccinated: vaccinated,
          "Coverage %": Math.round((vaccinated / target) * 1000) / 10,
          "Reporting Period": period,
        });
      }
    }
  }

  // intentional data-quality problems
  rows[3].Target = 0; // impossible denominator
  rows[7].Vaccinated = (rows[7].Target as number) + 1500; // coverage well above 100%
  rows[15].Target = null; // missing required field

  return { fileName: "demo_coverage.csv", headers, rows, rawRowCount: rows.length };
}
