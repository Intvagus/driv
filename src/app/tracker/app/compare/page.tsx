import Link from "next/link";
import { CompareView } from "@/components/tracker/CompareView";
import { formatDate, getCheckins, requireTrackerUser } from "@/lib/tracker/server";

export default async function ComparePage() {
  const { supabase, user } = await requireTrackerUser();
  const checkins = await getCheckins(supabase, user.id);

  if (checkins.length < 2) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rl-border bg-white p-6 text-center">
        <h1 className="text-xl font-semibold">Compare needs two check-ins</h1>
        <p className="mt-2 text-sm text-slate-600">
          {checkins.length === 0
            ? "Take your baseline photos first, then come back next month to see the difference."
            : "You have your baseline. Your next monthly check-in unlocks side-by-side comparison."}
        </p>
        <Link
          href="/tracker/app/new"
          className="mt-5 inline-block rounded-lg bg-rl-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark"
        >
          New check-in
        </Link>
      </div>
    );
  }

  return (
    <CompareView
      checkins={checkins.map((c) => ({ id: c.id, label: formatDate(c.taken_on), photos: c.photos }))}
    />
  );
}
