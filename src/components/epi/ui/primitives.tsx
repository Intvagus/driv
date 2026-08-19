import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-epi-border bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-epi-border px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-epi-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-epi-primary disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm",
        variant === "primary" && "bg-epi-primary text-white hover:bg-epi-primary-dark",
        variant === "secondary" && "border border-epi-border bg-white text-epi-ink hover:bg-epi-bg",
        variant === "ghost" && "text-epi-primary hover:bg-epi-bg",
        variant === "danger" && "border border-red-200 bg-white text-red-700 hover:bg-red-50",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "good" | "attention" | "critical"; children: ReactNode }) {
  const toneClass = {
    neutral: "bg-slate-100 text-slate-700",
    good: "bg-teal-50 text-epi-good",
    attention: "bg-amber-50 text-epi-accent",
    critical: "bg-red-50 text-red-700",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", toneClass)}>{children}</span>;
}

export function bandTone(band?: "good" | "needs_attention" | "critical"): "neutral" | "good" | "attention" | "critical" {
  if (band === "good") return "good";
  if (band === "needs_attention") return "attention";
  if (band === "critical") return "critical";
  return "neutral";
}

export function InfoTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group relative inline-block">
      <summary className="inline-flex h-4 w-4 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 text-[10px] leading-none text-slate-500 hover:border-epi-primary hover:text-epi-primary" aria-label={label}>
        i
      </summary>
      <div className="absolute left-0 top-5 z-20 w-64 rounded-md border border-epi-border bg-white p-3 text-xs text-slate-600 shadow-lg">{children}</div>
    </details>
  );
}

export function SectionHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-lg font-semibold text-epi-ink">
      {children}
    </h2>
  );
}
