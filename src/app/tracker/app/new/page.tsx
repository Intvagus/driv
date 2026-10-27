import Link from "next/link";
import { NewCheckinForm } from "@/components/tracker/NewCheckinForm";
import { UpgradeButtons } from "@/components/tracker/UpgradeButtons";
import { FREE_CHECKIN_LIMIT } from "@/lib/tracker/config";
import { getCheckins, getSubscription, requireTrackerUser } from "@/lib/tracker/server";

export default async function NewCheckinPage() {
  const { supabase, user } = await requireTrackerUser();
  const [{ isPro }, checkins] = await Promise.all([
    getSubscription(supabase, user.id),
    getCheckins(supabase, user.id),
  ]);

  if (!isPro && checkins.length >= FREE_CHECKIN_LIMIT) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rl-border bg-white p-6 text-center">
        <h1 className="text-xl font-semibold">You&apos;ve used your {FREE_CHECKIN_LIMIT} free check-ins</h1>
        <p className="mt-2 text-sm text-slate-600">
          Hair changes take 6–12 months to show. Upgrade to Pro to keep your monthly timeline going and unlock
          doctor-ready reports.
        </p>
        <UpgradeButtons className="mt-5" />
        <Link href="/tracker/app" className="mt-4 inline-block text-sm text-slate-500 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <NewCheckinForm userId={user.id} reference={checkins[0]?.photos ?? {}} />;
}
