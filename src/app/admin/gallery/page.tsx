import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("before_after_gallery")
    .select("*, procedures(title)")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-brand-dark">Before &amp; After Gallery</h1>
      <p className="text-gray-500 text-sm">Gallery entries are managed via Supabase directly. Upload images to the &apos;gallery&apos; storage bucket.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">Before</div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">After</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.technique && <Badge variant="gold" className="text-xs">{item.technique}</Badge>}
              {item.graft_count && <Badge variant="secondary" className="text-xs">{item.graft_count} grafts</Badge>}
              {item.months_post_op && <Badge variant="secondary" className="text-xs">{item.months_post_op}mo</Badge>}
              <Badge variant={item.patient_consent ? "success" : "error"} className="text-xs">
                {item.patient_consent ? "Consent" : "No Consent"}
              </Badge>
            </div>
          </div>
        ))}
        {!items?.length && (
          <div className="col-span-3 py-12 text-center text-gray-400">
            No gallery items yet. Add entries in Supabase and upload images to the gallery bucket.
          </div>
        )}
      </div>
    </div>
  );
}
