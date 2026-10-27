import { NextRequest, NextResponse } from "next/server";
import { createTrackerAdminClient } from "@/lib/tracker/supabase-server";
import { verifyUnsubscribeToken } from "@/lib/tracker/unsubscribe";

// POST only, so link scanners that pre-fetch email links can't unsubscribe
// people. Handles both the confirm button on /tracker/unsubscribe (form
// post, redirected back with ?done=1) and RFC 8058 one-click unsubscribe
// from mail clients (u and t in the query string).
export async function POST(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  let userId = query.get("u");
  let token = query.get("t");
  let fromForm = false;

  if (request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    if (form.get("u")) {
      userId = String(form.get("u"));
      token = String(form.get("t") ?? "");
      fromForm = true;
    }
  }

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return new NextResponse("Invalid unsubscribe link", { status: 400 });
  }

  const { error } = await createTrackerAdminClient()
    .from("tracker_preferences")
    .update({ email_reminders: false })
    .eq("user_id", userId);
  if (error) return new NextResponse("Could not update preferences", { status: 500 });

  if (fromForm) {
    return NextResponse.redirect(new URL("/tracker/unsubscribe?done=1", request.url), 303);
  }
  return new NextResponse("Unsubscribed", { status: 200 });
}
