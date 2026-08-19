import { KpiValue } from "@/types/epi/indicator";
import { formatKpiValue } from "@/lib/epi/format";
import { Badge, Card, InfoTooltip, bandTone } from "@/components/epi/ui/primitives";

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
          <p className="mt-1 text-2xl font-semibold text-epi-ink">{formatKpiValue(k)}</p>
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
