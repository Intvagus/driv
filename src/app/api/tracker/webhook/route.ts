import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createTrackerAdminClient as createAdminClient } from "@/lib/tracker/supabase-server";

// Lemon Squeezy webhook: keeps tracker_subscriptions in sync.
// Subscribe the webhook to the subscription_* events in the LS dashboard.

type LemonSqueezyEvent = {
  meta: { event_name: string; custom_data?: { user_id?: string } };
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      customer_id: number | string;
      variant_id: number | string;
      renews_at: string | null;
      ends_at: string | null;
      urls?: { customer_portal?: string | null };
    };
  };
};

function validSignature(raw: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"), "utf8");
  const given = Buffer.from(signature, "utf8");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Webhook not configured", { status: 503 });

  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-signature"), secret)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: LemonSqueezyEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad payload", { status: 400 });
  }

  if (!event.meta.event_name.startsWith("subscription_") || event.data.type !== "subscriptions") {
    return NextResponse.json({ ignored: true });
  }

  const supabase = createAdminClient();
  const attrs = event.data.attributes;
  const subscriptionId = String(event.data.id);

  // custom_data is set at checkout; fall back to an existing row for
  // events that arrive without it.
  let userId = event.meta.custom_data?.user_id;
  if (!userId) {
    const { data: existing } = await supabase
      .from("tracker_subscriptions")
      .select("user_id")
      .eq("ls_subscription_id", subscriptionId)
      .maybeSingle();
    userId = existing?.user_id;
  }
  if (!userId) {
    console.error("Lemon Squeezy webhook: no user for subscription", subscriptionId);
    return NextResponse.json({ ignored: true });
  }

  const { error } = await supabase.from("tracker_subscriptions").upsert(
    {
      user_id: userId,
      status: attrs.status,
      variant_id: String(attrs.variant_id),
      ls_subscription_id: subscriptionId,
      ls_customer_id: String(attrs.customer_id),
      customer_portal_url: attrs.urls?.customer_portal ?? null,
      renews_at: attrs.renews_at,
      ends_at: attrs.ends_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Lemon Squeezy webhook: upsert failed", error);
    return new NextResponse("Database error", { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
