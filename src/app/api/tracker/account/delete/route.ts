import { NextResponse } from "next/server";
import { createClient as createUntypedClient } from "@supabase/supabase-js";
import { createTrackerAdminClient, createTrackerServerClient } from "@/lib/tracker/supabase-server";
import { PHOTO_BUCKET } from "@/lib/tracker/config";

// Permanently deletes the signed-in user's Rootline data: photos, check-ins,
// treatments, reminders and subscription record. The login itself is removed
// too, unless it's also used on the clinic site (bookings or staff access),
// in which case only the tracker data goes.
export async function POST() {
  let supabase;
  let user;
  try {
    supabase = await createTrackerServerClient();
    user = (await supabase.auth.getUser()).data.user;
  } catch (err) {
    console.error("Account delete: auth check failed", err);
  }
  if (!supabase || !user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const admin = createTrackerAdminClient();

  // 1. Active subscription: cancel it first so they're not billed again.
  const { data: sub } = await admin.from("tracker_subscriptions").select("*").eq("user_id", user.id).maybeSingle();
  const billing = sub && ["active", "on_trial", "past_due", "paused"].includes(sub.status);
  if (billing) {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey || !sub.ls_subscription_id) {
      return NextResponse.json(
        {
          error: "Please cancel your Pro subscription first (Manage billing on your dashboard), then delete your account.",
          portalUrl: sub.customer_portal_url,
        },
        { status: 409 }
      );
    }
    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${sub.ls_subscription_id}`, {
      method: "DELETE",
      headers: { Accept: "application/vnd.api+json", Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok && res.status !== 404) {
      console.error("Account delete: subscription cancel failed", res.status, await res.text());
      return NextResponse.json({ error: "Couldn't cancel your subscription. Please try again." }, { status: 502 });
    }
  }

  // 2. Photos in storage (rows referencing them are removed below).
  const { data: photos } = await admin.from("tracker_photos").select("storage_path").eq("user_id", user.id);
  const paths = (photos ?? []).map((p) => p.storage_path);
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await admin.storage.from(PHOTO_BUCKET).remove(paths.slice(i, i + 100));
    if (error) {
      console.error("Account delete: photo removal failed", error);
      return NextResponse.json({ error: "Couldn't delete your photos. Please try again." }, { status: 500 });
    }
  }

  // 3. Tracker rows (photos cascade from check-ins, logs from treatments).
  for (const table of [
    "tracker_checkins",
    "tracker_treatments",
    "tracker_preferences",
    "tracker_subscriptions",
  ] as const) {
    const { error } = await admin.from(table).delete().eq("user_id", user.id);
    if (error) {
      console.error(`Account delete: ${table} failed`, error);
      return NextResponse.json({ error: "Couldn't delete your data. Please try again." }, { status: 500 });
    }
  }

  // 4. The login, unless the clinic site also relies on it. The clinic
  //    tables aren't in the tracker's typed schema, so query them untyped.
  const clinic = createUntypedClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const [bookings, staff] = await Promise.all([
    clinic.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    clinic.from("admin_users").select("id", { count: "exact", head: true }).eq("id", user.id),
  ]);
  // If either check fails, keep the login rather than risk cutting someone
  // off from their clinic bookings.
  const sharedLogin =
    !!bookings.error || !!staff.error || (bookings.count ?? 0) > 0 || (staff.count ?? 0) > 0;

  if (!sharedLogin) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) console.error("Account delete: auth user removal failed", error);
  }
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true, loginKept: sharedLogin });
}
