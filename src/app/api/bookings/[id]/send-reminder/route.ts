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
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminClient = createAdminClient();

  // Fetch booking to get patient details
  const { data: booking } = await adminClient
    .from("bookings")
    .select("patient_name, patient_email, deposit_upload_token, deposit_reminder_count")
    .eq("id", params.id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const uploadLink = `${process.env.NEXT_PUBLIC_SITE_URL}/book/${booking.deposit_upload_token}/upload`;
  const message = `Dear ${booking.patient_name}, this is a reminder to upload your deposit payment proof to secure your appointment: ${uploadLink}`;

  // Log reminder (email sending would be done via Resend in production)
  const { error: reminderError } = await adminClient.from("booking_reminders").insert({
    booking_id: params.id,
    sent_via: "email",
    message,
  });

  // Update reminder count
  await adminClient
    .from("bookings")
    .update({
      deposit_reminder_count: (booking.deposit_reminder_count ?? 0) + 1,
      last_deposit_reminder_sent_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (reminderError) return NextResponse.json({ error: reminderError.message }, { status: 500 });
  return NextResponse.json({ success: true, message });
}
