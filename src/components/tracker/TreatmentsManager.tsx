"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { addDays, localDateIso } from "@/lib/tracker/dates";
import { adherence, ADHERENCE_WINDOW_DAYS } from "@/lib/tracker/adherence";
import { COMMON_TREATMENTS } from "@/lib/tracker/config";
import type { TrackerDatabase } from "@/types/tracker-database";

type Treatment = TrackerDatabase["public"]["Tables"]["tracker_treatments"]["Row"];

export function TreatmentsManager({ userId }: { userId: string }) {
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [logs, setLogs] = useState<Map<string, Set<string>>>(new Map());
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [startedOn, setStartedOn] = useState(localDateIso());
  const [error, setError] = useState("");
  const today = localDateIso();

  const load = useCallback(async () => {
    const supabase = createClient();
    const since = addDays(today, -(ADHERENCE_WINDOW_DAYS - 1));
    const [{ data: t }, { data: l }] = await Promise.all([
      supabase.from("tracker_treatments").select("*").order("active", { ascending: false }).order("created_at"),
      supabase.from("tracker_treatment_logs").select("treatment_id, logged_on").gte("logged_on", since),
    ]);
    const byTreatment = new Map<string, Set<string>>();
    for (const row of l ?? []) {
      if (!byTreatment.has(row.treatment_id)) byTreatment.set(row.treatment_id, new Set());
      byTreatment.get(row.treatment_id)!.add(row.logged_on);
    }
    setTreatments(t ?? []);
    setLogs(byTreatment);
  }, [today]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    const { error: err } = await createClient()
      .from("tracker_treatments")
      .insert({ user_id: userId, name: name.trim(), dose: dose.trim() || null, started_on: startedOn || null });
    if (err) return setError(err.message);
    setName("");
    setDose("");
    load();
  };

  const toggleActive = async (t: Treatment) => {
    await createClient().from("tracker_treatments").update({ active: !t.active }).eq("id", t.id);
    load();
  };

  const remove = async (t: Treatment) => {
    if (!confirm(`Delete ${t.name} and its history?`)) return;
    await createClient().from("tracker_treatments").delete().eq("id", t.id);
    load();
  };

  const days = Array.from({ length: ADHERENCE_WINDOW_DAYS }, (_, i) => addDays(today, i - (ADHERENCE_WINDOW_DAYS - 1)));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Treatments</h1>

      <form onSubmit={add} className="rounded-2xl border border-rl-border bg-white p-5">
        <h2 className="font-semibold">Add a treatment</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <label className="text-sm">
            <span className="sr-only">Treatment</span>
            <input
              list="rl-common-treatments"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minoxidil (topical)"
              required
              maxLength={80}
              className="w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
            <datalist id="rl-common-treatments">
              {COMMON_TREATMENTS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="text-sm">
            <span className="sr-only">Dose</span>
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Dose (e.g. 5%, 1mg)"
              maxLength={40}
              className="w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
          </label>
          <label className="text-sm">
            <span className="sr-only">Start date</span>
            <input
              type="date"
              value={startedOn}
              max={today}
              onChange={(e) => setStartedOn(e.target.value)}
              className="w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
          </label>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-rl-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {treatments === null ? null : treatments.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-rl-border bg-white p-8 text-center text-sm text-slate-500">
          No treatments yet. Add what you use and tick it off daily from your dashboard.
        </p>
      ) : (
        <ul className="space-y-3">
          {treatments.map((t) => {
            const logged = logs.get(t.id) ?? new Set<string>();
            const start = t.started_on && t.started_on > t.created_at.slice(0, 10) ? t.started_on : t.created_at.slice(0, 10);
            const stats = adherence(logged, start, today);
            return (
              <li key={t.id} className={`rounded-2xl border border-rl-border bg-white p-4 ${t.active ? "" : "opacity-60"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {t.name}
                      {t.dose && <span className="font-normal text-slate-500"> · {t.dose}</span>}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.started_on ? `Since ${t.started_on}` : "Start date not set"}
                      {!t.active && " · paused"}
                    </p>
                  </div>
                  <div className="text-right">
                    {stats && t.active && (
                      <p className="text-lg font-semibold tabular-nums">
                        {stats.pct}%
                        <span className="block text-[11px] font-normal text-slate-500">
                          {stats.hit}/{stats.total} days
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5" aria-label={`Last ${ADHERENCE_WINDOW_DAYS} days`}>
                  {days.map((d) => (
                    <span
                      key={d}
                      title={d}
                      className={`h-4 flex-1 rounded-sm ${logged.has(d) ? "bg-rl-primary" : "bg-slate-100"}`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex gap-3 text-sm">
                  <button onClick={() => toggleActive(t)} className="text-slate-600 hover:underline">
                    {t.active ? "Pause" : "Resume"}
                  </button>
                  <button onClick={() => remove(t)} className="flex items-center gap-1 text-red-600 hover:underline">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
