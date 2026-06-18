import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminUser } = await supabase
    .from("admin_users").select("role").eq("id", user.id).single();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminClient = createAdminClient();
  const { data: booking } = await adminClient
    .from("bookings")
    .select("patient_name, patient_email, deposit_upload_token, deposit_reminder_count")
    .eq("id", params.id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const uploadLink = `${process.env.NEXT_PUBLIC_SITE_URL}/book/${(booking as any).deposit_upload_token}/upload`;
  const message = `Dear ${(booking as any).patient_name}, please upload your deposit proof: ${uploadLink}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: reminderError } = await (adminClient.from("booking_reminders") as any)
    .insert({ booking_id: params.id, sent_via: "email", message });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient.from("bookings") as any)
    .update({
      deposit_reminder_count: ((booking as any).deposit_reminder_count ?? 0) + 1,
      last_deposit_reminder_sent_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (reminderError) return NextResponse.json({ error: reminderError.message }, { status: 500 });
  return NextResponse.json({ success: true, message });
}
