import type { Metadata } from "next";
import { AppNav } from "@/components/tracker/AppNav";
import { ensurePreferences, getSubscription, requireTrackerUser } from "@/lib/tracker/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TrackerAppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireTrackerUser();
  const [{ isPro }] = await Promise.all([
    getSubscription(supabase, user.id),
    ensurePreferences(supabase, user.id),
  ]);

  return (
    <>
      <AppNav isPro={isPro} />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">{children}</main>
    </>
  );
}
