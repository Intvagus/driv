"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrackerDatabase } from "@/types/tracker-database";

// @supabase/ssr 0.5 passes generics positionally in the pre-2.5x order,
// which collapses every table to `never` with the installed supabase-js;
// re-typing the result restores full type safety.
export function createTrackerClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  ) as unknown as SupabaseClient<TrackerDatabase>;
}
