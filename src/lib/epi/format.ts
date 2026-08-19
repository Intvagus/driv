import { KpiValue } from "@/types/epi/indicator";

/** Shared KPI value formatting so the web dashboard, PDF and Word exports never disagree. */
export function formatKpiValue(k: Pick<KpiValue, "value" | "unit" | "format">): string {
  if (typeof k.value !== "number") return k.value;
  if (k.format === "percent") return `${k.value.toFixed(1)}%`;
  if (k.format === "decimal1") return k.value.toFixed(1);
  const formatted = k.value.toLocaleString();
  return k.unit === "%" ? `${formatted}%` : formatted;
}
