import { DataQualityReport } from "@/types/epi/validation";
import { Badge, Card, CardHeader, InfoTooltip } from "@/components/epi/ui/primitives";

function severityTone(sev: string) {
  return sev === "critical" ? "critical" : sev === "warning" ? "attention" : "neutral";
}

export function DataQualityCard({ quality }: { quality: DataQualityReport }) {
  return (
    <Card>
      <CardHeader
        title="Data Quality"
        subtitle={`${quality.totalRecords.toLocaleString()} records assessed`}
        action={
          <InfoTooltip label="How was this score calculated?">
            <p className="font-semibold text-epi-ink">How was this score calculated?</p>
            <p className="mt-1">{quality.methodologyNote}</p>
          </InfoTooltip>
        }
      />
      <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
        {quality.dimensions.map((d) => (
          <div key={d.dimension}>
            <p className="text-xs capitalize text-slate-500">{d.dimension}</p>
            <p className="text-xl font-semibold text-epi-ink">{d.score.toFixed(1)}%</p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-epi-primary" style={{ width: `${d.score}%` }} />
            </div>
          </div>
        ))}
        <div className="col-span-2 border-l border-epi-border pl-4 sm:col-span-1">
          <p className="text-xs text-slate-500">Overall Score</p>
          <p className="text-2xl font-bold text-epi-ink">{quality.overallScore.toFixed(1)}%</p>
        </div>
      </div>

      {quality.issues.length > 0 && (
        <div className="border-t border-epi-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-epi-bg text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Rule</th>
                  <th className="px-5 py-2 font-medium">Description</th>
                  <th className="px-5 py-2 font-medium">Severity</th>
                  <th className="px-5 py-2 text-right font-medium">Records</th>
                  <th className="px-5 py-2 font-medium">Recommended action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-epi-border">
                {quality.issues.map((issue) => (
                  <tr key={issue.ruleId}>
                    <td className="px-5 py-2 font-mono text-xs text-slate-500">{issue.ruleId}</td>
                    <td className="px-5 py-2">{issue.description}</td>
                    <td className="px-5 py-2">
                      <Badge tone={severityTone(issue.severity)}>{issue.severity}</Badge>
                    </td>
                    <td className="px-5 py-2 text-right">{issue.affectedRecordCount.toLocaleString()}</td>
                    <td className="px-5 py-2 text-slate-600">{issue.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
