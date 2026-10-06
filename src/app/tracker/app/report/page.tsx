import Link from "next/link";
import { FileText } from "lucide-react";
import { PrintButton } from "@/components/tracker/PrintButton";
import { UpgradeButtons } from "@/components/tracker/UpgradeButtons";
import { adherence, ADHERENCE_WINDOW_DAYS } from "@/lib/tracker/adherence";
import { addDays, localDateIso } from "@/lib/tracker/dates";
import { ANGLES, APP_NAME, SHEDDING_LABELS } from "@/lib/tracker/config";
import { daysBetween, formatDate, getCheckins, getSubscription, requireTrackerUser } from "@/lib/tracker/server";

export default async function ReportPage() {
  const { supabase, user } = await requireTrackerUser();
  const { isPro } = await getSubscription(supabase, user.id);

  if (!isPro) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rl-border bg-white p-6 text-center">
        <FileText className="mx-auto h-10 w-10 text-rl-primary" aria-hidden />
        <h1 className="mt-3 text-xl font-semibold">Doctor-ready report</h1>
        <p className="mt-2 text-sm text-slate-600">
          One printable page with your baseline vs latest photos for every angle, your shedding trend and treatment
          adherence. Bring it to your dermatologist or hair surgeon. Available on Pro.
        </p>
        <UpgradeButtons className="mt-5" />
      </div>
    );
  }

  const today = localDateIso();
  const [checkins, { data: treatments }, { data: logs }] = await Promise.all([
    getCheckins(supabase, user.id),
    supabase.from("tracker_treatments").select("*").order("created_at"),
    supabase
      .from("tracker_treatment_logs")
      .select("treatment_id, logged_on")
      .gte("logged_on", addDays(today, -(ADHERENCE_WINDOW_DAYS - 1))),
  ]);

  if (checkins.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-rl-border bg-white p-8 text-center text-sm text-slate-500">
        Your report will appear after your first check-in.{" "}
        <Link href="/tracker/app/new" className="font-medium text-rl-primary hover:underline">
          Start now
        </Link>
      </p>
    );
  }

  const latest = checkins[0];
  const baseline = checkins[checkins.length - 1];
  const chronological = [...checkins].reverse();

  return (
    <article className="mx-auto max-w-3xl rounded-2xl border border-rl-border bg-white p-6 print:border-0 print:p-0">
      <header className="flex items-start justify-between gap-4 border-b border-rl-border pb-4">
        <div>
          <h1 className="text-xl font-semibold">Hair progress report</h1>
          <p className="text-sm text-slate-600">
            {user.email} · {formatDate(baseline.taken_on)} – {formatDate(latest.taken_on)} (
            {daysBetween(baseline.taken_on, new Date(`${latest.taken_on}T00:00:00`))} days, {checkins.length} check-ins)
          </p>
        </div>
        <PrintButton />
      </header>

      <section className="mt-5">
        <h2 className="font-semibold">Baseline vs latest</h2>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
          {ANGLES.map((a) => (
            <div key={a.id} className="col-span-2 break-inside-avoid">
              <p className="mb-1 text-xs font-medium text-slate-600">{a.label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[baseline, latest].map((c) => (
                  <figure key={c.id}>
                    {c.photos[a.id] ? (
                      <img src={c.photos[a.id]} alt={`${a.label}, ${c.taken_on}`} className="aspect-square w-full rounded object-cover" />
                    ) : (
                      <div className="flex aspect-square w-full items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                        No photo
                      </div>
                    )}
                    <figcaption className="mt-0.5 text-center text-[10px] text-slate-500">{formatDate(c.taken_on)}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 break-inside-avoid">
        <h2 className="font-semibold">Check-in log</h2>
        <table className="mt-2 w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr className="border-b border-rl-border">
              <th className="py-1.5 font-medium">Date</th>
              <th className="py-1.5 font-medium">Shedding</th>
              <th className="py-1.5 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {chronological.map((c) => (
              <tr key={c.id} className="border-b border-rl-border/60 align-top">
                <td className="whitespace-nowrap py-1.5 pr-3">{formatDate(c.taken_on)}</td>
                <td className="whitespace-nowrap py-1.5 pr-3">{c.shedding ? SHEDDING_LABELS[c.shedding] : "—"}</td>
                <td className="py-1.5 text-slate-600">{c.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 break-inside-avoid">
        <h2 className="font-semibold">Treatments</h2>
        {!treatments?.length ? (
          <p className="mt-2 text-sm text-slate-500">None recorded.</p>
        ) : (
          <table className="mt-2 w-full text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-rl-border">
                <th className="py-1.5 font-medium">Treatment</th>
                <th className="py-1.5 font-medium">Since</th>
                <th className="py-1.5 font-medium">Status</th>
                <th className="py-1.5 text-right font-medium">Last {ADHERENCE_WINDOW_DAYS} days</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => {
                const logged = new Set((logs ?? []).filter((l) => l.treatment_id === t.id).map((l) => l.logged_on));
                const created = t.created_at.slice(0, 10);
                const stats = adherence(logged, t.started_on && t.started_on > created ? t.started_on : created, today);
                return (
                  <tr key={t.id} className="border-b border-rl-border/60">
                    <td className="py-1.5 pr-3">
                      {t.name}
                      {t.dose && <span className="text-slate-500"> · {t.dose}</span>}
                    </td>
                    <td className="py-1.5 pr-3">{t.started_on ? formatDate(t.started_on) : "—"}</td>
                    <td className="py-1.5 pr-3">{t.active ? "Active" : "Paused"}</td>
                    <td className="py-1.5 text-right tabular-nums">{stats ? `${stats.pct}% (${stats.hit}/${stats.total})` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <footer className="mt-6 border-t border-rl-border pt-3 text-[11px] text-slate-500">
        Generated by {APP_NAME} on {formatDate(today)}. Self-reported data and patient-taken photos; lighting and
        angle can vary between check-ins. Not a diagnostic document.
      </footer>
    </article>
  );
}
