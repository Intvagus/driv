import { AnalysisResult } from "@/types/epi/analysis";
import { ReportFinding } from "@/types/epi/report";

/** "Key finding callout" and "Priority area callout" from the infographic
 *  library — a single high-signal fact surfaced ahead of the full chart set. */
export function KeyFindingCallout({ finding }: { finding: ReportFinding }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-epi-primary text-xs font-bold text-white" aria-hidden>
        !
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-epi-primary">Key finding</p>
        <p className="mt-0.5 text-sm text-epi-ink">{finding.text}</p>
      </div>
    </div>
  );
}

export function PriorityAreaCallout({ analysis }: { analysis: AnalysisResult }) {
  const priority = [...analysis.districtBreakdown].filter((d) => d.band === "critical" || d.band === "needs_attention").sort((a, b) => a.value - b.value)[0];
  if (!priority) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-epi-accent text-xs font-bold text-white" aria-hidden>
        ⚠
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-epi-accent">Priority area</p>
        <p className="mt-0.5 text-sm text-epi-ink">
          <strong>{priority.district}</strong> — {analysis.districtMetricLabel.toLowerCase()} of {priority.value}
          {analysis.districtMetricUnit === "%" ? "%" : ""}, below the configured threshold. Recommended for programme review.
        </p>
      </div>
    </div>
  );
}
