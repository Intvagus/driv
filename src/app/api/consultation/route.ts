import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().or(z.literal("")),
  phone: z.string().min(10),
  age: z.string().optional(),
  norwood_stage: z.string().optional(),
  hair_loss_area: z.string().optional(),
  preferred_technique: z.string().optional(),
  budget: z.string().optional(),
  medical_history: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    let data: Record<string, string> = {};

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === "string") data[key] = value;
      });
      // Handle photo upload separately if needed
    } else {
      data = await request.json();
    }

    const validated = leadSchema.parse(data);

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("consultation_leads").insert({
      name: validated.name,
      email: validated.email || `noemail_${Date.now()}@placeholder.com`,
      phone: validated.phone,
      norwood_stage: validated.norwood_stage || null,
      hair_loss_area: validated.hair_loss_area || null,
      preferred_technique: validated.preferred_technique || null,
      budget: validated.budget || null,
      medical_history: validated.medical_history || null,
      notes: validated.notes || null,
      status: "new",
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
