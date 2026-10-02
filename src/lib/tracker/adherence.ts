import { addDays } from "./dates";

export const ADHERENCE_WINDOW_DAYS = 30;

/**
 * Share of days in the last 30 (or since the treatment was added, if more
 * recent) on which it was ticked off. Returns null before day one.
 */
export function adherence(loggedDays: Set<string>, startIso: string, todayIso: string) {
  const windowStart = addDays(todayIso, -(ADHERENCE_WINDOW_DAYS - 1));
  const from = startIso > windowStart ? startIso : windowStart;
  if (from > todayIso) return null;

  let total = 0;
  let hit = 0;
  for (let d = from; d <= todayIso; d = addDays(d, 1)) {
    total++;
    if (loggedDays.has(d)) hit++;
  }
  return { hit, total, pct: Math.round((hit / total) * 100) };
}
