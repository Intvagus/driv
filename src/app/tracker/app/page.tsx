import Link from "next/link";
import { Camera, CalendarClock, Sparkles, CheckCircle2 } from "lucide-react";
import { TodayChecklist } from "@/components/tracker/TodayChecklist";
import { RemindersToggle } from "@/components/tracker/RemindersToggle";
import { InstallPrompt } from "@/components/tracker/InstallPrompt";
import { DeleteCheckinButton } from "@/components/tracker/DeleteCheckinButton";
import { UpgradeButtons } from "@/components/tracker/UpgradeButtons";
import { ANGLES, CHECKIN_INTERVAL_DAYS, FREE_CHECKIN_LIMIT, SHEDDING_LABELS } from "@/lib/tracker/config";
import {
  daysBetween,
  ensurePreferences,
  formatDate,
  getCheckins,
  getSubscription,
  requireTrackerUser,
} from "@/lib/tracker/server";

export default async function TrackerDashboard({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const { supabase, user } = await requireTrackerUser();
  const [{ subscription, isPro }, checkins, prefs] = await Promise.all([
    getSubscription(supabase, user.id),
    getCheckins(supabase, user.id),
    ensurePreferences(supabase, user.id),
  ]);

  const latest = checkins[0];
  const daysSince = latest ? daysBetween(latest.taken_on) : null;
  const daysUntilDue = daysSince === null ? 0 : CHECKIN_INTERVAL_DAYS - daysSince;
  const atLimit = !isPro && checkins.length >= FREE_CHECKIN_LIMIT;

  return (
    <div className="space-y-6">
      {searchParams.upgraded && (
        <div className="flex items-center gap-2 rounded-xl border border-rl-primary/30 bg-rl-primary/5 p-4 text-sm">
          <CheckCircle2 className="h-5 w-5 text-rl-primary" aria-hidden />
          Thanks for upgrading! Pro unlocks as soon as your payment is confirmed — usually within a minute.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Next check-in */}
        <section className="rounded-2xl border border-rl-border bg-white p-5 md:col-span-2">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rl-primary/10 text-rl-primary">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex-1">
              {!latest ? (
                <>
                  <h1 className="text-lg font-semibold">Take your baseline photos</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Your first check-in is the most important one — everything is compared against it. It takes
                    about 3 minutes.
                  </p>
                </>
              ) : daysUntilDue <= 0 ? (
                <>
                  <h1 className="text-lg font-semibold">Your monthly check-in is due</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Last check-in was {daysSince} days ago ({formatDate(latest.taken_on)}).
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-lg font-semibold">
                    Next check-in in {daysUntilDue} day{daysUntilDue === 1 ? "" : "s"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Monthly photos in the same light and angles give the clearest comparison.
                  </p>
                </>
              )}
              {atLimit ? (
                <p className="mt-4 text-sm font-medium text-rl-accent">
                  You&apos;ve used all {FREE_CHECKIN_LIMIT} free check-ins. Upgrade to keep tracking.
                </p>
              ) : (
                <Link
                  href="/tracker/app/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rl-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark"
                >
                  <Camera className="h-4 w-4" aria-hidden />
                  {latest ? "New check-in" : "Start baseline"}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="rounded-2xl border border-rl-border bg-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rl-accent" aria-hidden />
            <h2 className="font-semibold">{isPro ? "Rootline Pro" : "Free plan"}</h2>
          </div>
          {isPro ? (
            <div className="mt-2 space-y-2 text-sm text-slate-600">
              <p>Unlimited check-ins and doctor reports.</p>
              {subscription?.status === "cancelled" && subscription.ends_at ? (
                <p>Access until {formatDate(subscription.ends_at.slice(0, 10))}.</p>
              ) : subscription?.renews_at ? (
                <p>Renews {formatDate(subscription.renews_at.slice(0, 10))}.</p>
              ) : null}
              {subscription?.customer_portal_url && (
                <a href={subscription.customer_portal_url} className="font-medium text-rl-primary hover:underline">
                  Manage billing →
                </a>
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-600">
                {Math.min(checkins.length, FREE_CHECKIN_LIMIT)} of {FREE_CHECKIN_LIMIT} free check-ins used.
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rl-primary"
                  style={{ width: `${Math.min(100, (checkins.length / FREE_CHECKIN_LIMIT) * 100)}%` }}
                />
              </div>
              <UpgradeButtons className="mt-4" />
            </>
          )}
        </section>
      </div>

      <InstallPrompt />

      <TodayChecklist />

      <RemindersToggle userId={user.id} initial={prefs.email_reminders} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your timeline</h2>
        {checkins.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-rl-border bg-white p-8 text-center text-sm text-slate-500">
            No check-ins yet. Your photos will appear here, newest first.
          </p>
        ) : (
          <ol className="space-y-4">
            {checkins.map((c, i) => (
              <li key={c.id} className="rounded-2xl border border-rl-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {formatDate(c.taken_on)}
                      {i === checkins.length - 1 && (
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Baseline
                        </span>
                      )}
                    </p>
                    {c.shedding && (
                      <p className="text-xs text-slate-500">Shedding: {SHEDDING_LABELS[c.shedding]}</p>
                    )}
                  </div>
                  <DeleteCheckinButton id={c.id} paths={c.paths} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ANGLES.map((a) => (
                    <figure key={a.id}>
                      {c.photos[a.id] ? (
                        <img
                          src={c.photos[a.id]}
                          alt={`${a.label}, ${formatDate(c.taken_on)}`}
                          loading="lazy"
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          —
                        </div>
                      )}
                      <figcaption className="mt-1 truncate text-center text-[11px] text-slate-500">
                        {a.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                {c.notes && <p className="mt-3 text-sm text-slate-600">{c.notes}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
