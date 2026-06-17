import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowRight } from "lucide-react";

export default async function AdminProceduresPage() {
  const supabase = await createClient();
  const { data: procedures } = await supabase
    .from("procedures")
    .select("id, title, slug, category, status, featured, sort_order")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-brand-dark">Procedures</h1>
        <Button asChild variant="primary" size="sm">
          <Link href="/admin/procedures/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Procedure
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Title", "Category", "Slug", "Status", "Featured", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {procedures?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-brand-dark">{p.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.category === "surgical" ? "default" : "gold"} className="text-xs capitalize">
                    {p.category.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "warning" : "secondary"} className="text-xs capitalize">
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/procedures/${p.id}`} className="text-brand-gold">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {!procedures?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No procedures. <Link href="/admin/procedures/new" className="text-brand-gold">Add one</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
