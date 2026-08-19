import { ParsedTable } from "@/types/epi/dataset";
import { DEMO_DISTRICTS, DEMO_TEHSILS, pick, seededRandom } from "./shared";

const FOLLOW_UPS = ["Traced and vaccinated", "Traced, not yet vaccinated", "Not traced"];

export function generateZeroDoseDemo(): ParsedTable {
  const rnd = seededRandom(59);
  const headers = ["Child ID", "Age (months)", "Sex", "District", "Tehsil", "Zero-Dose Status", "Follow-up Status", "Reporting Period"];
  const rows: Record<string, unknown>[] = [];

  for (let i = 1; i <= 160; i++) {
    const district = pick(DEMO_DISTRICTS, rnd);
    const tehsil = pick(DEMO_TEHSILS[district], rnd);
    const districtWeight = district === "Harrowden" || district === "Fenwick" ? 0.55 : 0.25;
    const status = rnd() < districtWeight ? "Zero-Dose" : rnd() < 0.15 ? "Defaulter" : "Vaccinated";
    rows.push({
      "Child ID": `ZD-${2000 + i}`,
      "Age (months)": 3 + Math.floor(rnd() * 20),
      Sex: i === 8 ? null : pick(["Male", "Female"], rnd),
      District: district,
      Tehsil: tehsil,
      "Zero-Dose Status": status,
      "Follow-up Status": status === "Zero-Dose" ? pick(FOLLOW_UPS, rnd) : null,
      "Reporting Period": pick(["2026-Q1", "2026-Q2"], rnd),
    });
  }

  rows.push({ ...rows[3] }); // intentional duplicate

  return { fileName: "demo_zero_dose.csv", headers, rows, rawRowCount: rows.length };
}
