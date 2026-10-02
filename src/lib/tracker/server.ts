import "server-only";
import { redirect } from "next/navigation";
import { createTrackerServerClient as createClient } from "@/lib/tracker/supabase-server";
import { PHOTO_BUCKET, type Angle } from "./config";

export type CheckinWithPhotos = {
  id: string;
  taken_on: string;
  shedding: number | null;
  notes: string | null;
  photos: Partial<Record<Angle, string>>; // angle -> signed URL
  paths: string[];
};

/** Current tracker user, or redirect to the tracker sign-in page. */
export async function requireTrackerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/tracker/login");
  return { supabase, user };
}

export async function getSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data } = await supabase
    .from("tracker_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const isPro =
    !!data &&
    (["active", "on_trial", "past_due"].includes(data.status) ||
      (data.status === "cancelled" && !!data.ends_at && new Date(data.ends_at) > new Date()));

  return { subscription: data, isPro };
}

/** All check-ins (newest first) with short-lived signed photo URLs. */
export async function getCheckins(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<CheckinWithPhotos[]> {
  const { data: checkins } = await supabase
    .from("tracker_checkins")
    .select("id, taken_on, shedding, notes, tracker_photos(angle, storage_path)")
    .eq("user_id", userId)
    .order("taken_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (!checkins?.length) return [];

  const allPaths = checkins.flatMap((c) => c.tracker_photos.map((p) => p.storage_path));
  const urlByPath = new Map<string, string>();
  if (allPaths.length) {
    const { data: signed } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(allPaths, 60 * 60);
    signed?.forEach((s) => {
      if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
    });
  }

  return checkins.map((c) => {
    const photos: Partial<Record<Angle, string>> = {};
    for (const p of c.tracker_photos) {
      const url = urlByPath.get(p.storage_path);
      if (url) photos[p.angle] = url;
    }
    return {
      id: c.id,
      taken_on: c.taken_on,
      shedding: c.shedding,
      notes: c.notes,
      photos,
      paths: c.tracker_photos.map((p) => p.storage_path),
    };
  });
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysBetween(fromIso: string, to: Date = new Date()) {
  const from = new Date(`${fromIso}T00:00:00`);
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}
