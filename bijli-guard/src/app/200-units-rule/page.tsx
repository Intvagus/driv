import type { Metadata } from "next";
import Link from "next/link";
import { TARIFF, calculateBill } from "@/lib/tariff";

export const metadata: Metadata = {
  title: "200 Units Rule Explained: Protected vs Unprotected Electricity (2026)",
  description:
    "What the 200-unit protected consumer rule means for your electricity bill in Pakistan, what happens at 201 units, and how to stay under the limit.",
  alternates: { canonical: "/200-units-rule/" },
};

const rs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export default function Rule() {
  const at200 = calculateBill({ units: 200, type: "protected", sanctionedKw: 2, electricityDutyPercent: 1.5 }).total;
  const at201 = calculateBill({ units: 201, type: "protected", sanctionedKw: 2, electricityDutyPercent: 1.5 }).total;
  const [p1, p2] = TARIFF.protected;
  const u = TARIFF.unprotected;

  return (
    <article className="prose-lite">
      <h1 className="text-2xl font-bold">The 200-unit rule, explained</h1>
      <p className="font-urdu text-lg leading-loose" dir="rtl" lang="ur">200 یونٹ کا اصول آسان الفاظ میں</p>

      <p>
        Homes that use <strong>200 units or less in each of the last {TARIFF.protectedMonths} months</strong> are
        &quot;protected&quot; consumers and pay much lower rates. Cross 200 units in a month and that bill is charged at
        unprotected rates, with fixed charges added.
      </p>

      <h2>How big is the jump?</h2>
      <p>
        For a typical home with a 2 kW sanctioned load in Punjab, our calculator estimates {rs(at200)} at 200 units and{" "}
        <strong>{rs(at201)} at 201 units</strong>. That one extra unit adds about {rs(at201 - at200)}.
      </p>
      <table>
        <thead><tr><th>Units</th><th>Protected rate (Rs/unit)</th><th>Unprotected rate (Rs/unit)</th></tr></thead>
        <tbody>
          <tr><td>1–100</td><td>{p1.rate}</td><td>{u[0].rate}</td></tr>
          <tr><td>101–200</td><td>{p2.rate} (first 100 at {p1.rate})</td><td>{u[1].rate} on every unit</td></tr>
          <tr><td>201–300</td><td>—</td><td>{u[2].rate} on every unit</td></tr>
        </tbody>
      </table>

      <h2>The six-month penalty</h2>
      <p>
        Under the current rule, crossing 200 units once also costs you protected status for the following months. On 27 October
        2026 the federal energy minister said the government is working to end this six-month penalty, so the extra cost would
        apply only to the month you go over. Until that change is officially notified, assume the six-month rule still applies.
      </p>

      <h2>How to stay under 200 units</h2>
      <ul>
        <li>Read your meter every few days instead of waiting for the bill. <Link href="/">Bijli Guard</Link> does the maths and warns you early.</li>
        <li>Air conditioners and electric heaters use the most power: a 1.5-ton inverter AC can use several units in a few hours.</li>
        <li>Check your daily budget in the last week of the cycle, when there&apos;s least room left to recover from a hot day.</li>
        <li>Meter reading dates vary. Check the reading date on your bill so you know when the month really ends.</li>
      </ul>

      <p className="text-xs">
        Rates from {TARIFF.source}, last reviewed {TARIFF.lastReviewed}. <Link href="/tariff/">See all rates used</Link>.
      </p>
    </article>
  );
}
