import { APP_NAME, CHECKIN_INTERVAL_DAYS, FREE_CHECKIN_LIMIT, PRICING } from "./config";

const DAY_MS = 86_400_000;
// Nudge new users to take baseline photos this long after they join.
export const BASELINE_NUDGE_DAYS = 2;
// One follow-up this long after the first reminder of a cycle, then stop.
export const FOLLOWUP_AFTER_DAYS = 7;

export type ReminderKind = "baseline" | "due" | "followup";

export type ReminderState = {
  joinedAt: string; // tracker_preferences.created_at
  latestCheckin: string | null; // YYYY-MM-DD
  reminderCycle: string | null;
  remindersInCycle: number;
  lastReminderAt: string | null;
};

/**
 * Decide whether a user gets a reminder today. A "cycle" is the period after
 * a given check-in (or before the first one): at most two emails per cycle —
 * one when the check-in falls due and one follow-up a week later.
 */
export function decideReminder(
  state: ReminderState,
  now: Date = new Date()
): { kind: ReminderKind; cycle: string } | null {
  const cycle = state.latestCheckin ?? "baseline";
  const dueAt = state.latestCheckin
    ? new Date(`${state.latestCheckin}T00:00:00Z`).getTime() + CHECKIN_INTERVAL_DAYS * DAY_MS
    : new Date(state.joinedAt).getTime() + BASELINE_NUDGE_DAYS * DAY_MS;

  if (now.getTime() < dueAt) return null;

  if (state.reminderCycle !== cycle) {
    return { kind: state.latestCheckin ? "due" : "baseline", cycle };
  }
  if (
    state.remindersInCycle === 1 &&
    state.lastReminderAt &&
    now.getTime() - new Date(state.lastReminderAt).getTime() >= FOLLOWUP_AFTER_DAYS * DAY_MS
  ) {
    return { kind: "followup", cycle };
  }
  return null;
}

export function reminderEmail({
  kind,
  latestCheckin,
  atFreeLimit,
  siteUrl,
  unsubscribeUrl,
  now = new Date(),
}: {
  kind: ReminderKind;
  latestCheckin: string | null;
  atFreeLimit: boolean;
  siteUrl: string;
  unsubscribeUrl: string;
  now?: Date;
}) {
  const daysSince = latestCheckin
    ? Math.floor((now.getTime() - new Date(`${latestCheckin}T00:00:00Z`).getTime()) / DAY_MS)
    : 0;

  const subject =
    kind === "baseline"
      ? "Take your baseline hair photos (3 minutes)"
      : kind === "due"
        ? "Your monthly hair check-in is due"
        : "Still time for this month's hair check-in";

  const intro =
    kind === "baseline"
      ? "Your first check-in is the most important one — every future photo is compared against it. Grab your phone, find good light, and it takes about 3 minutes."
      : kind === "due"
        ? `It's been ${daysSince} days since your last photos. Taking them on a steady monthly rhythm is what makes small changes visible.`
        : `A quick nudge: your check-in is ${daysSince - CHECKIN_INTERVAL_DAYS} days overdue. Skipping months leaves gaps that make your progress harder to read.`;

  const upgradeNote = atFreeLimit
    ? `You've used your ${FREE_CHECKIN_LIMIT} free check-ins, so this month's photos need Pro. It's ${PRICING.yearly.price}${PRICING.yearly.per} (about ${PRICING.yearly.perMonth} a month).`
    : null;

  const cta = atFreeLimit
    ? { label: "Upgrade and continue", href: `${siteUrl}/api/tracker/checkout?plan=yearly` }
    : { label: kind === "baseline" ? "Take baseline photos" : "Start check-in", href: `${siteUrl}/tracker/app/new` };

  const text = [
    intro,
    upgradeNote,
    "",
    `${cta.label}: ${cta.href}`,
    "",
    "Tip: same room, same light, dry hair, no product — every time.",
    "",
    `Don't want these reminders? Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#F7FAF9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0F1B2D">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;padding:28px">
        <tr><td>
          <p style="margin:0 0 20px;font-size:15px;font-weight:600">
            <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:8px;background:#0F766E;color:#fff;font-size:13px;margin-right:8px">R</span>${APP_NAME}
          </p>
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3">${subject}</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#334155">${intro}</p>
          ${upgradeNote ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#B45309">${upgradeNote}</p>` : ""}
          <p style="margin:24px 0">
            <a href="${cta.href}" style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px">${cta.label}</a>
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#64748B">Tip: same room, same light, dry hair, no product — every time.</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#94A3B8">
        You're getting this because you use ${APP_NAME}. <a href="${unsubscribeUrl}" style="color:#64748B">Unsubscribe from reminders</a>.
      </p>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}
