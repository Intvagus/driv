"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createTrackerClient } from "@/lib/tracker/supabase";

export function RemindersToggle({ userId, initial }: { userId: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    const next = !on;
    const { error } = await createTrackerClient()
      .from("tracker_preferences")
      .update({ email_reminders: next })
      .eq("user_id", userId);
    if (!error) setOn(next);
    setBusy(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-rl-border bg-white p-4">
      <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-rl-primary" aria-hidden />
        <div>
          <p className="text-sm font-medium" id="rl-reminders-label">
            Email me when my check-in is due
          </p>
          <p className="text-xs text-slate-500">At most twice a month. Unsubscribe any time.</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-labelledby="rl-reminders-label"
        onClick={toggle}
        disabled={busy}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
          on ? "bg-rl-primary" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
