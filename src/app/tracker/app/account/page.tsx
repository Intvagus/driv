import Link from "next/link";
import { DeleteAccount } from "@/components/tracker/DeleteAccount";
import { RemindersToggle } from "@/components/tracker/RemindersToggle";
import { UpgradeButtons } from "@/components/tracker/UpgradeButtons";
import { LEGAL } from "@/lib/tracker/config";
import { ensurePreferences, formatDate, getSubscription, requireTrackerUser } from "@/lib/tracker/server";

export default async function AccountPage() {
  const { supabase, user } = await requireTrackerUser();
  const [{ subscription, isPro }, prefs] = await Promise.all([
    getSubscription(supabase, user.id),
    ensurePreferences(supabase, user.id),
  ]);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Account</h1>

      <section className="rounded-2xl border border-rl-border bg-white p-5 text-sm">
        <p className="text-slate-500">Signed in as</p>
        <p className="font-medium">{user.email}</p>
      </section>

      <section className="rounded-2xl border border-rl-border bg-white p-5 text-sm">
        <h2 className="font-semibold">Plan</h2>
        {isPro ? (
          <div className="mt-1 space-y-1 text-slate-600">
            <p>Rootline Pro{subscription?.status === "cancelled" ? " (cancelled)" : ""}.</p>
            {subscription?.status === "cancelled" && subscription.ends_at ? (
              <p>Access until {formatDate(subscription.ends_at.slice(0, 10))}.</p>
            ) : subscription?.renews_at ? (
              <p>Renews {formatDate(subscription.renews_at.slice(0, 10))}.</p>
            ) : null}
            {subscription?.customer_portal_url && (
              <a href={subscription.customer_portal_url} className="inline-block font-medium text-rl-primary hover:underline">
                Manage billing, invoices or cancel →
              </a>
            )}
          </div>
        ) : (
          <>
            <p className="mt-1 text-slate-600">Free plan.</p>
            <UpgradeButtons className="mt-3" />
          </>
        )}
      </section>

      <RemindersToggle userId={user.id} initial={prefs.email_reminders} />

      <section className="rounded-2xl border border-rl-border bg-white p-5 text-sm">
        <h2 className="font-semibold">Help & legal</h2>
        <ul className="mt-2 space-y-1.5">
          <li>
            <a href={`mailto:${LEGAL.contactEmail}`} className="text-rl-primary hover:underline">
              Contact support ({LEGAL.contactEmail})
            </a>
          </li>
          <li>
            <Link href="/tracker/privacy" className="text-rl-primary hover:underline">
              Privacy policy
            </Link>
          </li>
          <li>
            <Link href="/tracker/terms" className="text-rl-primary hover:underline">
              Terms of service
            </Link>
          </li>
          <li>
            <Link href="/tracker/refunds" className="text-rl-primary hover:underline">
              Refund policy
            </Link>
          </li>
        </ul>
      </section>

      <DeleteAccount />
    </div>
  );
}
