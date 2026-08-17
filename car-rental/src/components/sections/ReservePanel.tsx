"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "@/types/car";

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function ReservePanel({ car }: { car: Car }) {
  const router = useRouter();
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState(todayStr(2));

  const days = useMemo(() => daysBetween(start, end), [start, end]);
  const subtotal = days * car.pricePerDay;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!car.available) return;
    const params = new URLSearchParams({
      car: car.name,
      start,
      end,
      total: String(total),
      location: car.location,
    });
    router.push(`/booking/confirmation?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleReserve}
      className="rounded-card border border-border bg-surface p-6"
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold">
          ${car.pricePerDay}
        </span>
        <span className="text-sm text-muted">/ day</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 rounded-control bg-surface-2 px-3 py-2.5">
          <span className="text-xs font-medium text-muted">Pickup</span>
          <input
            type="date"
            value={start}
            min={todayStr()}
            onChange={(e) => setStart(e.target.value)}
            className="focus-ring bg-transparent text-sm font-medium outline-none [color-scheme:dark]"
          />
        </label>
        <label className="flex flex-col gap-1.5 rounded-control bg-surface-2 px-3 py-2.5">
          <span className="text-xs font-medium text-muted">Return</span>
          <input
            type="date"
            value={end}
            min={start}
            onChange={(e) => setEnd(e.target.value)}
            className="focus-ring bg-transparent text-sm font-medium outline-none [color-scheme:dark]"
          />
        </label>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>
            ${car.pricePerDay} &times; {days} {days === 1 ? "day" : "days"}
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Service fee</span>
          <span>${serviceFee}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold text-text">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!car.available}
        className="focus-ring mt-5 w-full rounded-control bg-accent py-3.5 text-sm font-semibold text-[#0b0c0e] transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
      >
        {car.available ? "Confirm & pay" : "Unavailable for these dates"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Free cancellation up to 1 hour before pickup.
      </p>
    </form>
  );
}
