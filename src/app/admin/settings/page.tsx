import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/types/database";

type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: rawSettings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");
  const settings = (rawSettings ?? []) as SiteSetting[];

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-serif font-bold text-brand-dark">Site Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500 text-sm mb-6">
          These key-value settings are stored in Supabase and readable by the application.
          Only super admins can modify these values.
        </p>
        {settings.length > 0 ? (
          <div className="space-y-4">
            {settings.map((s) => (
              <div key={s.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="font-mono text-xs text-brand-dark bg-white border border-gray-200 rounded px-2 py-1 mt-0.5">
                  {s.key}
                </div>
                <div className="flex-1 text-sm text-gray-700">{s.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No settings configured yet. Add entries directly in Supabase.</p>
        )}
      </div>
    </div>
  );
}
