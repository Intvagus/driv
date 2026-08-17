"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { locations } from "@/lib/fleet-data";

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function SearchWidget() {
  const router = useRouter();
  const [location, setLocation] = useState(locations[0].name);
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState(todayStr(2));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ location, start, end });
    router.push(`/fleet?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-card border border-border bg-surface p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end sm:gap-2 sm:p-2"
    >
      <label className="flex flex-col gap-1.5 rounded-control bg-surface-2 px-4 py-3 sm:px-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <MapPin className="h-3.5 w-3.5" /> Pickup location
        </span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="focus-ring bg-transparent text-sm font-medium text-text outline-none"
        >
          {locations.map((loc) => (
            <option key={loc.name} value={loc.name} className="bg-surface-2">
              {loc.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 rounded-control bg-surface-2 px-4 py-3 sm:px-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <Calendar className="h-3.5 w-3.5" /> Pickup
        </span>
        <input
          type="date"
          value={start}
          min={todayStr()}
          onChange={(e) => setStart(e.target.value)}
          className="focus-ring bg-transparent text-sm font-medium text-text outline-none [color-scheme:dark]"
        />
      </label>

      <label className="flex flex-col gap-1.5 rounded-control bg-surface-2 px-4 py-3 sm:px-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <Calendar className="h-3.5 w-3.5" /> Return
        </span>
        <input
          type="date"
          value={end}
          min={start}
          onChange={(e) => setEnd(e.target.value)}
          className="focus-ring bg-transparent text-sm font-medium text-text outline-none [color-scheme:dark]"
        />
      </label>

      <button
        type="submit"
        className="focus-ring flex items-center justify-center gap-2 rounded-control bg-accent px-6 py-3.5 text-sm font-semibold text-[#0b0c0e] transition-colors duration-150 hover:bg-accent-hover sm:py-3"
      >
        Reserve now
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
