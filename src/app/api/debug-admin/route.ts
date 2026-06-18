import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" });
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: allAdmins } = await supabase
    .from("admin_users")
    .select("id, email, role");

  return NextResponse.json({
    logged_in_user_id: user.id,
    logged_in_email: user.email,
    admin_record_found: adminUser,
    admin_query_error: error?.message,
    all_admin_users: allAdmins,
  });
}
