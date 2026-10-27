import type { Metadata } from "next";
import Link from "next/link";
import { DISCOS } from "@/lib/discos";

export const metadata: Metadata = {
  title: "All Electricity Companies in Pakistan: Areas & Bill Links",
  description: "The 12 electricity distribution companies in Pakistan, the areas they serve, and links to each company's official bill portal.",
  alternates: { canonical: "/companies/" },
};

export default function Companies() {
  return (
    <div className="prose-lite">
      <h1 className="text-2xl font-bold">Electricity companies in Pakistan</h1>
      <p>All of these companies use the same national residential tariff. The main difference on a home bill is the provincial electricity duty.</p>
      <table>
        <thead>
          <tr><th>Company</th><th>Areas</th><th>Bill tools</th></tr>
        </thead>
        <tbody>
          {DISCOS.map((d) => (
            <tr key={d.slug}>
              <td className="align-top">
                <strong>{d.name}</strong>
                <br />
                <span className="text-xs text-slate-500">{d.fullName}</span>
              </td>
              <td className="align-top text-sm">{d.areas} <span className="text-slate-500">({d.province})</span></td>
              <td className="align-top text-sm">
                <Link href={`/${d.slug}-bill-calculator/`}>Calculator</Link>
                <br />
                <a href={d.billUrl} target="_blank" rel="noopener nofollow">Official bill</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
