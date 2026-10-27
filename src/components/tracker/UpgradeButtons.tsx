import { PRICING } from "@/lib/tracker/config";

/** Plain links to the checkout redirect — no client JS needed. */
export function UpgradeButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <a
        href="/api/tracker/checkout?plan=yearly"
        className="rounded-lg bg-rl-primary px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-rl-primary-dark"
      >
        Go Pro — {PRICING.yearly.price}
        {PRICING.yearly.per} <span className="font-normal opacity-80">({PRICING.yearly.note})</span>
      </a>
      <a
        href="/api/tracker/checkout?plan=monthly"
        className="rounded-lg border border-rl-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50"
      >
        {PRICING.monthly.price}
        {PRICING.monthly.per}
      </a>
    </div>
  );
}
