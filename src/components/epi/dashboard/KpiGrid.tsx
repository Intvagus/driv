import { KpiValue } from "@/types/epi/indicator";
import { Badge, Card, InfoTooltip, bandTone } from "@/components/epi/ui/primitives";

function formatKpi(k: KpiValue): string {
  if (typeof k.value !== "number") return k.value;
  if (k.format === "percent") return `${k.value.toFixed(1)}%`;
  if (k.format === "decimal1") return k.value.toFixed(1);
  return k.value.toLocaleString();
}

export function KpiGrid({ kpis }: { kpis: KpiValue[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {kpis.map((k) => (
        <Card key={k.key} className="p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-slate-500">{k.label}</p>
            {k.guidance && (
              <InfoTooltip label={`Definition of ${k.label}`}>
                <p className="font-semibold text-epi-ink">{k.guidance.label}</p>
                <p className="mt-1"><span className="font-medium">Definition:</span> {k.guidance.definition}</p>
                <p className="mt-1"><span className="font-medium">Calculation:</span> {k.guidance.calculationMethod}</p>
                <p className="mt-1"><span className="font-medium">Source:</span> {k.guidance.source}</p>
              </InfoTooltip>
            )}
          </div>
          <p className="mt-1 text-2xl font-semibold text-epi-ink">{formatKpi(k)}</p>
          {k.bandLabel && (
            <div className="mt-1.5">
              <Badge tone={bandTone(k.band)}>{k.bandLabel}</Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
