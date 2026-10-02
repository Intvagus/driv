import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createTrackerAdminClient } from "@/lib/tracker/supabase-server";
import { decideReminder, reminderEmail, type ReminderKind } from "@/lib/tracker/reminders";
import { oneClickUnsubscribeUrl, unsubscribePageUrl } from "@/lib/tracker/unsubscribe";
import { APP_NAME, FREE_CHECKIN_LIMIT } from "@/lib/tracker/config";

// Daily cron (see vercel.json): emails users whose monthly check-in is due.
// Call with `Authorization: Bearer $CRON_SECRET`; add `?dry=1` to see who
// would be emailed without sending anything.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PRO_STATUSES = ["active", "on_trial", "past_due"];
const BATCH_SIZE = 100; // Resend batch limit

type Pending = {
  userId: string;
  kind: ReminderKind;
  cycle: string;
  latestCheckin: string | null;
  atFreeLimit: boolean;
  remindersInCycle: number;
};

// PostgREST caps each response (1000 rows by default), so page through.
async function fetchAll<T>(
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
) {
  const PAGE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return new NextResponse("CRON_SECRET is not set", { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry") === "1";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/$/, "");
  const from = process.env.TRACKER_EMAIL_FROM;
  if (!dryRun && (!process.env.RESEND_API_KEY || !from)) {
    return new NextResponse("RESEND_API_KEY and TRACKER_EMAIL_FROM must be set", { status: 503 });
  }

  const supabase = createTrackerAdminClient();
  const now = new Date();

  let prefs, checkins, subs;
  try {
    [prefs, checkins, subs] = await Promise.all([
      fetchAll((a, b) => supabase.from("tracker_preferences").select("*").eq("email_reminders", true).order("user_id").range(a, b)),
      fetchAll((a, b) => supabase.from("tracker_checkins").select("user_id, taken_on").order("id").range(a, b)),
      fetchAll((a, b) => supabase.from("tracker_subscriptions").select("user_id, status, ends_at").order("user_id").range(a, b)),
    ]);
  } catch (err) {
    return new NextResponse(err instanceof Error ? err.message : "Query failed", { status: 500 });
  }

  const latest = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const c of checkins) {
    counts.set(c.user_id, (counts.get(c.user_id) ?? 0) + 1);
    if (!latest.has(c.user_id) || c.taken_on > latest.get(c.user_id)!) latest.set(c.user_id, c.taken_on);
  }
  const pro = new Set(
    subs
      .filter(
        (s) =>
          PRO_STATUSES.includes(s.status) || (s.status === "cancelled" && !!s.ends_at && new Date(s.ends_at) > now)
      )
      .map((s) => s.user_id)
  );

  const pending: Pending[] = [];
  for (const p of prefs) {
    const latestCheckin = latest.get(p.user_id) ?? null;
    const decision = decideReminder(
      {
        joinedAt: p.created_at,
        latestCheckin,
        reminderCycle: p.reminder_cycle,
        remindersInCycle: p.reminders_in_cycle,
        lastReminderAt: p.last_reminder_at,
      },
      now
    );
    if (!decision) continue;
    pending.push({
      userId: p.user_id,
      ...decision,
      latestCheckin,
      atFreeLimit: !pro.has(p.user_id) && (counts.get(p.user_id) ?? 0) >= FREE_CHECKIN_LIMIT,
      remindersInCycle: decision.kind === "followup" ? p.reminders_in_cycle : 0,
    });
  }

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      wouldSend: pending.map(({ userId, kind, cycle, atFreeLimit }) => ({ userId, kind, cycle, atFreeLimit })),
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  const failures: string[] = [];

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const chunk = pending.slice(i, i + BATCH_SIZE);

    // Emails come from auth.users; skip anyone deleted since.
    const withEmail = (
      await Promise.all(
        chunk.map(async (p) => {
          const { data } = await supabase.auth.admin.getUserById(p.userId);
          return data.user?.email ? { ...p, email: data.user.email } : null;
        })
      )
    ).filter((p): p is Pending & { email: string } => p !== null);
    if (!withEmail.length) continue;

    const { error } = await resend.batch.send(
      withEmail.map((p) => {
        const email = reminderEmail({
          kind: p.kind,
          latestCheckin: p.latestCheckin,
          atFreeLimit: p.atFreeLimit,
          siteUrl,
          unsubscribeUrl: unsubscribePageUrl(siteUrl, p.userId),
          now,
        });
        return {
          from: from!,
          to: p.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
          headers: {
            "List-Unsubscribe": `<${oneClickUnsubscribeUrl(siteUrl, p.userId)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
          tags: [{ name: "app", value: APP_NAME.toLowerCase() }, { name: "kind", value: p.kind }],
        };
      })
    );

    if (error) {
      // Leave state untouched so tomorrow's run retries this chunk.
      console.error("Tracker reminders: batch send failed", error);
      failures.push(error.message);
      continue;
    }

    sent += withEmail.length;
    const sentAt = new Date().toISOString();
    await Promise.all(
      withEmail.map((p) =>
        supabase
          .from("tracker_preferences")
          .update({ reminder_cycle: p.cycle, reminders_in_cycle: p.remindersInCycle + 1, last_reminder_at: sentAt })
          .eq("user_id", p.userId)
      )
    );
  }

  return NextResponse.json({ due: pending.length, sent, failures });
}
