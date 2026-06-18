import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const token = formData.get("token") as string | null;

    if (!file || !token) return NextResponse.json({ error: "File and token are required" }, { status: 400 });
    if (!ALLOWED_MIME_TYPES.includes(file.type)) return NextResponse.json({ error: "Only JPEG, PNG, and PDF files are allowed" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE_BYTES) return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });

    const adminClient = createAdminClient();
    const { data: booking } = await adminClient
      .from("bookings")
      .select("id, payment_status")
      .eq("deposit_upload_token", token)
      .single();

    if (!booking) return NextResponse.json({ error: "Invalid upload token" }, { status: 404 });

    const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
    const filePath = `${token}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from("payment-proofs")
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (adminClient.from("bookings") as any)
      .update({ payment_status: "deposit_submitted" })
      .eq("id", (booking as any).id);

    if (updateError) return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment proof upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
