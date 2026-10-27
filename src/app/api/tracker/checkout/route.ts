import { NextRequest, NextResponse } from "next/server";
import { createTrackerServerClient as createClient } from "@/lib/tracker/supabase-server";

// Redirects a signed-in user to the Lemon Squeezy hosted checkout for the
// chosen plan. The user id rides along as custom data so the webhook can
// attach the subscription to the right account.
export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan") === "monthly" ? "monthly" : "yearly";

  let user: { id: string; email?: string } | null = null;
  try {
    const supabase = await createClient();
    user = (await supabase.auth.getUser()).data.user;
  } catch (err) {
    console.error("Tracker checkout: auth check failed", err);
  }
  if (!user) {
    return NextResponse.redirect(new URL(`/tracker/login?mode=signup&plan=${plan}`, request.url));
  }

  const base =
    plan === "monthly"
      ? process.env.LEMONSQUEEZY_CHECKOUT_URL_MONTHLY
      : process.env.LEMONSQUEEZY_CHECKOUT_URL_YEARLY;
  if (!base) {
    return new NextResponse("Billing is not configured yet.", { status: 503 });
  }

  const url = new URL(base);
  url.searchParams.set("checkout[custom][user_id]", user.id);
  if (user.email) url.searchParams.set("checkout[email]", user.email);
  return NextResponse.redirect(url);
}
