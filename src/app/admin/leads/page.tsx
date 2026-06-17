import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import type { Database } from "@/types/database";

type Lead = Database["public"]["Tables"]["consultation_leads"]["Row"];

const statusVariant: Record<string, "default" | "success" | "warning" | "error" | "info" | "secondary"> = {
  new: "info",
  contacted: "warning",
  quoted: "default",
  converted: "success",
  lost: "error",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = await createClient();
  let query = supabase
    .from("consultation_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.filter) {
    query = query.eq("status", searchParams.filter) as typeof query;
  }

  const { data: rawLeads } = await query;
  const leads = (rawLeads ?? []) as Lead[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-brand-dark">Consultation Leads</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Name", "Email", "Phone", "Norwood", "Technique", "Budget", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-brand-dark">{l.name}</td>
                  <td className="px-4 py-3 text-gray-600">{l.email}</td>
                  <td className="px-4 py-3 text-gray-600">{l.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{l.norwood_stage ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{l.preferred_technique ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{l.budget ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[l.status] ?? "secondary"} className="capitalize">
                      {l.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(l.created_at).toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))}
              {!leads.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
