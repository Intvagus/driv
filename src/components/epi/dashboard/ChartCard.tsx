"use client";

import { useState } from "react";
import { ChartSpec, TableSpec } from "@/types/epi/visualization";
import { ChartSvg } from "@/components/epi/charts/ChartSvg";
import { Button, Card } from "@/components/epi/ui/primitives";

export function ChartCard({ chart, table }: { chart: ChartSpec; table?: TableSpec }) {
  const [showTable, setShowTable] = useState(false);
  return (
    <Card className="p-4">
      <ChartSvg spec={chart} />
      {chart.methodNote && <p className="mt-2 text-xs text-slate-500">{chart.methodNote}</p>}
      {table && (
        <div className="mt-3 border-t border-epi-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => setShowTable((s) => !s)}>
            {showTable ? "Hide exact values" : "Show exact values"}
          </Button>
          {showTable && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    {table.columns.map((c) => (
                      <th key={c.key} className={`py-1.5 pr-4 font-medium ${c.align === "right" ? "text-right" : "text-left"}`}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-epi-border">
                  {table.rows.map((row, i) => (
                    <tr key={i}>
                      {table.columns.map((c) => (
                        <td key={c.key} className={`py-1.5 pr-4 ${c.align === "right" ? "text-right" : "text-left"}`}>
                          {row[c.key] === null || row[c.key] === undefined ? "—" : row[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
