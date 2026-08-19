import { ParsedTable } from "@/types/epi/dataset";
import { DEMO_DISTRICTS, DEMO_TEHSILS, pick, seededRandom } from "./shared";

/** Fictional MR linelist demo data with realistic data-quality problems (never real patient data). */
export function generateMrLinelistDemo(): ParsedTable {
  const rnd = seededRandom(11);
  const headers = ["Child ID", "Name", "DOB", "Age (months)", "Sex", "District", "Tehsil", "Facility", "Vaccination Status", "Vaccine", "Dose", "Vaccination Date", "Campaign"];
  const rows: Record<string, unknown>[] = [];
  const statuses = ["Vaccinated", "Vaccinated", "Vaccinated", "Unvaccinated", "Unknown"];
  const vaccines = ["Measles-Rubella", "Measles-Rubella", "Measles"];

  for (let i = 1; i <= 140; i++) {
    const district = pick(DEMO_DISTRICTS, rnd);
    const tehsil = pick(DEMO_TEHSILS[district], rnd);
    const sex = rnd() < 0.02 ? null : pick(["Male", "Female"], rnd);
    const status = pick(statuses, rnd);
    const year = 2025 + (rnd() < 0.5 ? 0 : 1);
    const month = String(1 + Math.floor(rnd() * 6)).padStart(2, "0");
    const day = String(1 + Math.floor(rnd() * 27)).padStart(2, "0");
    let vaccDate: string | null = status === "Vaccinated" ? `${year}-${month}-${day}` : null;

    if (i === 5) vaccDate = "2027-01-15"; // intentional future date
    if (i === 12) vaccDate = "not recorded"; // intentional unparseable value

    rows.push({
      "Child ID": `MR-${1000 + i}`,
      Name: `Child ${i}`,
      DOB: `${2023 - Math.floor(rnd() * 3)}-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-10`,
      "Age (months)": 9 + Math.floor(rnd() * 50),
      Sex: sex,
      District: i === 30 ? "" : district, // intentional blank district
      Tehsil: i === 44 ? DEMO_TEHSILS[DEMO_DISTRICTS[(DEMO_DISTRICTS.indexOf(district) + 1) % DEMO_DISTRICTS.length]][0] : tehsil, // intentional tehsil/district mismatch
      Facility: `${tehsil} BHU`,
      "Vaccination Status": status,
      Vaccine: status === "Vaccinated" ? pick(vaccines, rnd) : null,
      Dose: status === "Vaccinated" ? pick(["1", "2"], rnd) : null,
      "Vaccination Date": vaccDate,
      Campaign: "2026 MR Campaign Round 1",
    });
  }

  // intentional exact + potential duplicates
  rows.push({ ...rows[10] });
  rows.push({ ...rows[20], "Child ID": "MR-9999" });

  return { fileName: "demo_mr_linelist.csv", headers, rows, rawRowCount: rows.length };
}
