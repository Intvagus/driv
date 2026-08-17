import { cn } from "@/lib/utils";

/**
 * Every car in the fleet renders through this single component: same backdrop,
 * same crop, same silhouette style. One consistent system stands in for
 * photography so the fleet grid reads as designed, not assembled from stock.
 */
export function CarVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card bg-surface",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 110%, rgba(255,90,31,0.16), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <svg
        viewBox="0 0 240 100"
        className="relative w-[78%] text-text/90"
        fill="none"
      >
        <path
          d="M20 70 C20 55 34 52 44 50 L64 32 C70 26 78 23 87 23 L150 23 C160 23 168 27 174 34 L190 50 C204 52 216 56 220 70 L220 76 C220 80 217 82 213 82 L18 82 C14 82 11 80 11 76 L11 72 C11 71 12 70 20 70 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M70 50 L82 30 L146 30 L166 50 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <line x1="112" y1="30" x2="112" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="62" cy="80" r="15" fill="#0b0c0e" stroke="currentColor" strokeWidth="3" />
        <circle cx="62" cy="80" r="5" fill="currentColor" opacity="0.5" />
        <circle cx="176" cy="80" r="15" fill="#0b0c0e" stroke="currentColor" strokeWidth="3" />
        <circle cx="176" cy="80" r="5" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}
