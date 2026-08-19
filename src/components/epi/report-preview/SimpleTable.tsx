import { TableSpec } from "@/types/epi/visualization";

export function SimpleTable({ table }: { table: TableSpec }) {
  return (
    <figure className="my-4">
      <figcaption className="mb-1 text-sm font-semibold text-epi-ink">{table.title}</figcaption>
      <div className="overflow-x-auto rounded-md border border-epi-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-epi-bg">
            <tr>
              {table.columns.map((c) => (
                <th key={c.key} className={`border-b border-epi-border px-3 py-2 font-medium text-slate-600 ${c.align === "right" ? "text-right" : "text-left"}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-epi-border last:border-0">
                {table.columns.map((c) => (
                  <td key={c.key} className={`px-3 py-1.5 ${c.align === "right" ? "text-right" : "text-left"}`}>
                    {row[c.key] === null || row[c.key] === undefined ? "—" : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-1 text-xs text-slate-400">{table.sourceNote}</figcaption>
    </figure>
  );
}
