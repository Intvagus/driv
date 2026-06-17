import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const bookingSchema = z.object({
  procedure: z.string().min(1),
  patient_name: z.string().min(2),
  patient_email: z.string().email(),
  patient_phone: z.string().min(10),
  patient_whatsapp: z.string().optional(),
  preferred_date: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const adminClient = createAdminClient();

    // Look up procedure by title to get its ID
    const { data: procedure } = await adminClient
      .from("procedures")
      .select("id, advance_amount, price_per_graft")
      .eq("title", data.procedure)
      .single();

    const { data: booking, error } = await adminClient
      .from("bookings")
      .insert({
        patient_name: data.patient_name,
        patient_email: data.patient_email,
        patient_phone: data.patient_phone,
        patient_whatsapp: data.patient_whatsapp || null,
        procedure_id: procedure?.id || null,
        preferred_date: data.preferred_date || null,
        notes: data.notes || null,
        user_id: user?.id || null,
        booking_status: "awaiting_deposit",
        payment_status: "deposit_pending",
        advance_required: procedure?.advance_amount || null,
      })
      .select("reference, deposit_upload_token")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
