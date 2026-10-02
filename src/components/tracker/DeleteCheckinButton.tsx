"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { PHOTO_BUCKET } from "@/lib/tracker/config";

export function DeleteCheckinButton({ id, paths }: { id: string; paths: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!confirm("Delete this check-in and its photos? This can't be undone.")) return;
    setBusy(true);
    const supabase = createClient();
    if (paths.length) await supabase.storage.from(PHOTO_BUCKET).remove(paths);
    const { error } = await supabase.from("tracker_checkins").delete().eq("id", id);
    setBusy(false);
    if (error) alert(`Could not delete: ${error.message}`);
    else router.refresh();
  };

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      aria-label="Delete check-in"
    >
      <Trash2 className="h-4 w-4" aria-hidden />
    </button>
  );
}
