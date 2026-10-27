"use client";

import { useState } from "react";
import { ANGLES, type Angle } from "@/lib/tracker/config";

type Item = { id: string; label: string; photos: Partial<Record<Angle, string>> };

/** Two check-ins, one angle at a time: side by side or with a drag slider. */
export function CompareView({ checkins }: { checkins: Item[] }) {
  // checkins arrive newest first; default to baseline vs latest.
  const [beforeId, setBeforeId] = useState(checkins[checkins.length - 1].id);
  const [afterId, setAfterId] = useState(checkins[0].id);
  const [angle, setAngle] = useState<Angle>("front");
  const [mode, setMode] = useState<"side" | "slider">("side");
  const [split, setSplit] = useState(50);

  const before = checkins.find((c) => c.id === beforeId)!;
  const after = checkins.find((c) => c.id === afterId)!;
  const beforeSrc = before.photos[angle];
  const afterSrc = after.photos[angle];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Compare</h1>

      <div className="grid grid-cols-2 gap-3">
        <Picker label="Before" value={beforeId} onChange={setBeforeId} items={checkins} />
        <Picker label="After" value={afterId} onChange={setAfterId} items={checkins} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Angle">
          {ANGLES.map((a) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={angle === a.id}
              onClick={() => setAngle(a.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                angle === a.id ? "bg-rl-ink text-white" : "bg-white text-slate-600 ring-1 ring-rl-border hover:bg-slate-50"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg ring-1 ring-rl-border">
          {(["side", "slider"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-3 py-1.5 text-sm font-medium ${mode === m ? "bg-rl-primary text-white" : "bg-white text-slate-600"}`}
            >
              {m === "side" ? "Side by side" : "Slider"}
            </button>
          ))}
        </div>
      </div>

      {!beforeSrc || !afterSrc ? (
        <p className="rounded-2xl border border-dashed border-rl-border bg-white p-8 text-center text-sm text-slate-500">
          One of these check-ins has no {ANGLES.find((a) => a.id === angle)!.label.toLowerCase()} photo. Pick another
          angle or date.
        </p>
      ) : mode === "side" ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: beforeSrc, label: before.label },
            { src: afterSrc, label: after.label },
          ].map((p, i) => (
            <figure key={i}>
              <img src={p.src} alt={`${angle} photo, ${p.label}`} className="aspect-square w-full rounded-xl object-cover" />
              <figcaption className="mt-1 text-center text-sm font-medium">{p.label}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div>
          <div className="relative mx-auto aspect-square w-full max-w-xl select-none overflow-hidden rounded-xl">
            <img src={afterSrc} alt={`${angle} photo, ${after.label}`} className="absolute inset-0 h-full w-full object-cover" />
            <img
              src={beforeSrc}
              alt={`${angle} photo, ${before.label}`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            />
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${split}%` }} />
            <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">{before.label}</span>
            <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">{after.label}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Slide between before and after"
            className="mx-auto mt-3 block w-full max-w-xl accent-rl-primary"
          />
        </div>
      )}
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  items: Item[];
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-rl-border bg-white px-3 py-2.5"
      >
        {items.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
