import type { Metadata } from "next";
import { DISCOS } from "@/lib/discos";
import { TARIFF } from "@/lib/tariff";

export const metadata: Metadata = {
  title: "Electricity Rates Used (2026 Residential Tariff)",
  description: "Every rate Bijli Guard uses to estimate bills: protected, unprotected and lifeline slabs, fixed charges, adjustments, duty and GST.",
  alternates: { canonical: "/tariff/" },
};

const upTo = (n: number, prev: number) => (Number.isFinite(n) ? `${prev + 1}–${n}` : `Above ${prev}`);

export default function Tariff() {
  return (
    <div className="prose-lite">
      <h1 className="text-2xl font-bold">Rates used in our estimates</h1>
      <p>
        Source: {TARIFF.source}. Last reviewed {TARIFF.lastReviewed}. Published summaries of this tariff don&apos;t all agree,
        so if your bill shows a different rate, trust your bill. You can enter your own rates in the calculator.
      </p>

      <h2>Protected (Rs/unit)</h2>
      <table><thead><tr><th>Units</th><th>Rate</th></tr></thead><tbody>
        {TARIFF.protected.map((s, i) => <tr key={i}><td>{upTo(s.upTo, i ? TARIFF.protected[i - 1].upTo : 0)}</td><td>{s.rate}</td></tr>)}
      </tbody></table>

      <h2>Unprotected (Rs/unit, whole month at the slab reached)</h2>
      <table><thead><tr><th>Units</th><th>Rate</th><th>Fixed charge (Rs per kW)</th></tr></thead><tbody>
        {TARIFF.unprotected.map((s, i) => <tr key={i}><td>{upTo(s.upTo, i ? TARIFF.unprotected[i - 1].upTo : 0)}</td><td>{s.rate}</td><td>{s.fixedPerKw}</td></tr>)}
      </tbody></table>

      <h2>Lifeline (Rs/unit)</h2>
      <table><thead><tr><th>Units</th><th>Rate</th></tr></thead><tbody>
        {TARIFF.lifeline.map((s, i) => <tr key={i}><td>{upTo(s.upTo, i ? TARIFF.lifeline[i - 1].upTo : 0)}</td><td>{s.rate}</td></tr>)}
      </tbody></table>

      <h2>Adjustments and taxes</h2>
      <ul>
        <li>Fuel price adjustment: Rs {TARIFF.fca.perUnit}/unit ({TARIFF.fca.label}). Changes monthly.</li>
        <li>Quarterly adjustment: Rs {TARIFF.qta.perUnit}/unit ({TARIFF.qta.label}).</li>
        <li>GST: {TARIFF.gstPercent}% of energy, fixed charges and adjustments.</li>
        <li>Lifeline consumers are not charged the fuel or quarterly adjustment in our estimate.</li>
      </ul>

      <h2>Electricity duty by company</h2>
      <table><thead><tr><th>Company</th><th>Province</th><th>Duty</th></tr></thead><tbody>
        {DISCOS.map((d) => <tr key={d.slug}><td>{d.name}</td><td>{d.province}</td><td>{d.dutyPercent}%{d.dutyVerified ? "" : " (unconfirmed)"}</td></tr>)}
      </tbody></table>
    </div>
  );
}
