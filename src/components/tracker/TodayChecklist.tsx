"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Pill } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { localDateIso } from "@/lib/tracker/dates";

type Treatment = { id: string; name: string; dose: string | null };

/** "Did you take it today?" tick list for active treatments. */
export function TodayChecklist() {
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const today = localDateIso();

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setUserId(auth.user.id);
      const [{ data: t }, { data: logs }] = await Promise.all([
        supabase.from("tracker_treatments").select("id, name, dose").eq("active", true).order("created_at"),
        supabase.from("tracker_treatment_logs").select("treatment_id").eq("logged_on", today),
      ]);
      setTreatments(t ?? []);
      setDone(new Set((logs ?? []).map((l) => l.treatment_id)));
    })();
  }, [today]);

  const toggle = async (id: string) => {
    if (!userId) return;
    const supabase = createClient();
    const next = new Set(done);
    if (done.has(id)) {
      next.delete(id);
      setDone(next);
      await supabase.from("tracker_treatment_logs").delete().eq("treatment_id", id).eq("logged_on", today);
    } else {
      next.add(id);
      setDone(next);
      await supabase
        .from("tracker_treatment_logs")
        .upsert({ treatment_id: id, user_id: userId, logged_on: today }, { onConflict: "treatment_id,logged_on", ignoreDuplicates: true });
    }
  };

  if (treatments === null) return null;

  return (
    <section className="rounded-2xl border border-rl-border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <Pill className="h-4 w-4 text-rl-primary" aria-hidden /> Today&apos;s treatments
        </h2>
        <Link href="/tracker/app/treatments" className="text-sm text-rl-primary hover:underline">
          Manage
        </Link>
      </div>
      {treatments.length === 0 ? (
        <p className="text-sm text-slate-600">
          Add the treatments you use (minoxidil, finasteride, etc.) to tick them off daily and see your adherence.{" "}
          <Link href="/tracker/app/treatments" className="font-medium text-rl-primary hover:underline">
            Add a treatment
          </Link>
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {treatments.map((t) => {
            const checked = done.has(t.id);
            return (
              <li key={t.id}>
                <button
                  onClick={() => toggle(t.id)}
                  aria-pressed={checked}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    checked ? "border-rl-primary bg-rl-primary/5" : "border-rl-border hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      checked ? "border-rl-primary bg-rl-primary text-white" : "border-slate-300"
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                  <span className="flex-1">
                    <span className="font-medium">{t.name}</span>
                    {t.dose && <span className="text-slate-500"> · {t.dose}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
