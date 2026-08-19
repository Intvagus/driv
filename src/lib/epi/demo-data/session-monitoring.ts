import { ParsedTable } from "@/types/epi/dataset";
import { DEMO_DISTRICTS, DEMO_TEHSILS, pick, seededRandom } from "./shared";

const REASONS = ["Staff unavailable", "Vaccine stock-out", "Weather", "Community event conflict"];
const TYPES = ["Fixed", "Outreach", "Mobile"];
const PERIODS = ["2026-05", "2026-06", "2026-07"];

export function generateSessionMonitoringDemo(): ParsedTable {
  const rnd = seededRandom(37);
  const headers = ["District", "Tehsil", "Facility", "Session Type", "Planned Sessions", "Conducted Sessions", "Cancelled Sessions", "Cancellation Reason", "Reporting Period"];
  const rows: Record<string, unknown>[] = [];

  for (const district of DEMO_DISTRICTS) {
    const tehsil = DEMO_TEHSILS[district][0];
    for (const type of TYPES) {
      for (const period of PERIODS) {
        const planned = 10 + Math.floor(rnd() * 15);
        const completionRate = district === "Harrowden" || district === "Greenholt" ? 0.55 + rnd() * 0.15 : 0.8 + rnd() * 0.18;
        const conducted = Math.min(planned, Math.round(planned * completionRate));
        const cancelled = planned - conducted;
        rows.push({
          District: district,
          Tehsil: tehsil,
          Facility: `${tehsil} Outreach Team`,
          "Session Type": type,
          "Planned Sessions": planned,
          "Conducted Sessions": conducted,
          "Cancelled Sessions": cancelled,
          "Cancellation Reason": cancelled > 0 ? pick(REASONS, rnd) : null,
          "Reporting Period": period,
        });
      }
    }
  }

  rows[9]["Conducted Sessions"] = (rows[9]["Planned Sessions"] as number) + 3; // intentional inconsistency
  rows[14]["Planned Sessions"] = null; // missing required field

  return { fileName: "demo_session_monitoring.csv", headers, rows, rawRowCount: rows.length };
}
