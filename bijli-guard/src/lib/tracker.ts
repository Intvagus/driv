// Month-so-far tracking from meter readings: projects the units the next
// bill will show and warns before the household crosses its limit.

import { TARIFF, calculateBill, type ConsumerType } from "./tariff";

export type Reading = { date: string; value: number }; // date = YYYY-MM-DD

export type TrackerSetup = {
  disco: string;
  type: ConsumerType;
  sanctionedKw: number;
  /** The "present reading" and reading date printed on the last bill. */
  start: Reading;
  /** Days between meter readings (bills are read roughly monthly). */
  cycleDays: number;
};

export type Level = "safe" | "close" | "over" | "unknown";

export type Projection = {
  usedSoFar: number;
  daysElapsed: number;
  daysLeft: number;
  dailyAverage: number | null;
  projectedUnits: number | null;
  /** Units the household should stay at or under (200 if protected, else the current slab top). */
  limit: number;
  unitsLeft: number;
  /** Units per day the household can use for the rest of the cycle to stay within the limit. */
  dailyBudget: number | null;
  level: Level;
  nextReadingDate: string;
};

const DAY_MS = 86_400_000;
const toDays = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / DAY_MS;

export function addDays(iso: string, days: number) {
  return new Date((toDays(iso) + days) * DAY_MS).toISOString().slice(0, 10);
}

/** The limit worth guarding: protected homes guard 200; others guard the top of their current slab. */
export function limitFor(type: ConsumerType, unitsSoFar: number) {
  if (type !== "unprotected") return TARIFF.protectedLimit;
  const slab = TARIFF.unprotected.find((s) => unitsSoFar <= s.upTo);
  return slab && Number.isFinite(slab.upTo) ? slab.upTo : Infinity;
}

export function project(setup: TrackerSetup, readings: Reading[], today: string): Projection {
  const latest = [setup.start, ...readings].sort((a, b) => toDays(a.date) - toDays(b.date)).at(-1)!;
  const usedSoFar = Math.max(0, latest.value - setup.start.value);
  const daysElapsed = Math.max(0, toDays(latest.date) - toDays(setup.start.date));
  const daysLeft = Math.max(0, setup.cycleDays - Math.max(daysElapsed, toDays(today) - toDays(setup.start.date)));
  const limit = limitFor(setup.type, usedSoFar);
  const unitsLeft = Math.max(0, limit - usedSoFar);
  const nextReadingDate = addDays(setup.start.date, setup.cycleDays);

  // A projection needs at least one full day of data.
  if (daysElapsed < 1) {
    return {
      usedSoFar, daysElapsed, daysLeft, dailyAverage: null, projectedUnits: null,
      limit, unitsLeft, dailyBudget: null, level: usedSoFar > limit ? "over" : "unknown", nextReadingDate,
    };
  }

  const dailyAverage = usedSoFar / daysElapsed;
  const projectedUnits = Math.round(dailyAverage * setup.cycleDays);
  const remainingDays = Math.max(1, setup.cycleDays - daysElapsed);
  const dailyBudget = Number.isFinite(limit) ? Math.max(0, (limit - usedSoFar) / remainingDays) : null;

  let level: Level = "safe";
  if (usedSoFar > limit || projectedUnits > limit) level = "over";
  else if (projectedUnits > limit * 0.9) level = "close";

  return { usedSoFar, daysElapsed, daysLeft, dailyAverage, projectedUnits, limit, unitsLeft, dailyBudget, level, nextReadingDate };
}

/** What crossing a limit would cost: bill at the limit vs one unit over it. */
export function crossingCost(setup: TrackerSetup, dutyPercent: number, limit = limitFor(setup.type, 0)) {
  const base = { type: setup.type, sanctionedKw: setup.sanctionedKw, electricityDutyPercent: dutyPercent };
  const atLimit = calculateBill({ ...base, units: limit });
  const overLimit = calculateBill({ ...base, units: limit + 1 });
  return { limit, atLimit: atLimit.total, overLimit: overLimit.total, extra: overLimit.total - atLimit.total };
}

/** Validates a new reading against the history. Returns an error key, or null. */
export function validateReading(setup: TrackerSetup, readings: Reading[], next: Reading): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(next.date)) return "badDate";
  if (!Number.isFinite(next.value) || next.value < 0) return "badValue";
  const all = [setup.start, ...readings];
  if (toDays(next.date) < toDays(setup.start.date)) return "beforeStart";
  const earlier = all.filter((r) => toDays(r.date) <= toDays(next.date));
  const later = all.filter((r) => toDays(r.date) > toDays(next.date));
  if (earlier.some((r) => r.value > next.value)) return "lowerThanBefore";
  if (later.some((r) => r.value < next.value)) return "higherThanAfter";
  return null;
}
