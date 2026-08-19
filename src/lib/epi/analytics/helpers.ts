import { CleanedRecord } from "@/types/epi/dataset";

export function sumBy(records: CleanedRecord[], field: string): number {
  return records.reduce((s, r) => s + ((r[field] as number | null) ?? 0), 0);
}

/** Mean of non-null numeric values for `field`; null if no record has a value. */
export function avgBy(records: CleanedRecord[], field: string): number | null {
  const values = records.map((r) => r[field] as number | null).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function countWhere(records: CleanedRecord[], pred: (r: CleanedRecord) => boolean): number {
  return records.filter(pred).length;
}

export function groupBy<T = CleanedRecord>(records: T[], keyFn: (r: T) => string | null): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of records) {
    const key = keyFn(r);
    if (key === null || key === undefined || key === "") continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return map;
}

export function pct(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Sorts a Map<string, number> descending by value into an array of {label, value}. */
export function toRankedItems(m: Map<string, number>): { label: string; value: number }[] {
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
}
