import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/site";
import { Calculator } from "@/components/Calculator";
import { DISCOS, getDisco } from "@/lib/discos";
import { TARIFF, calculateBill } from "@/lib/tariff";

// One page per company: /lesco-bill-calculator/, /iesco-bill-calculator/ ...
const SUFFIX = "-bill-calculator";
export const dynamicParams = false;

export function generateStaticParams() {
  return DISCOS.map((d) => ({ page: `${d.slug}${SUFFIX}` }));
}

function discoFor(page: string) {
  return page.endsWith(SUFFIX) ? getDisco(page.slice(0, -SUFFIX.length)) : undefined;
}

export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  const d = discoFor(params.page);
  if (!d) return {};
  return {
    title: `${d.name} Bill Calculator 2026: Units to Bill`,
    description: `Estimate your ${d.name} (${d.fullName}) electricity bill from units, with protected and unprotected 2026 rates, fixed charges, fuel adjustment and taxes.`,
    alternates: { canonical: `/${params.page}/` },
  };
}

const rs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export default function DiscoPage({ params }: { params: { page: string } }) {
  const d = discoFor(params.page);
  if (!d) notFound();

  const examples = [100, 150, 200, 201, 300].map((u) => ({
    units: u,
    protectedBill: u <= 200 ? calculateBill({ units: u, type: "protected", sanctionedKw: 2, electricityDutyPercent: d.dutyPercent }).total : null,
    unprotectedBill: calculateBill({ units: u, type: "unprotected", sanctionedKw: 2, electricityDutyPercent: d.dutyPercent }).total,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{d.name} bill calculator</h1>
      <p className="font-urdu text-lg leading-loose text-slate-700" dir="rtl" lang="ur">{d.nameUr} بل کیلکولیٹر</p>
      <p className="text-slate-600">
        {d.fullName} supplies {d.areas} ({d.province}). Enter your units below to estimate your {d.name} bill.
      </p>

      <Calculator defaultDisco={d.slug} />
      <AdSlot slot={AD_SLOTS.inContent} />

      <section className="prose-lite">
        <h2>Example {d.name} bills (2 kW sanctioned load)</h2>
        <table>
          <thead>
            <tr><th>Units</th><th>Protected</th><th>Unprotected</th></tr>
          </thead>
          <tbody>
            {examples.map((e) => (
              <tr key={e.units}>
                <td>{e.units}</td>
                <td>{e.protectedBill === null ? "Not protected above 200" : rs(e.protectedBill)}</td>
                <td>{rs(e.unprotectedBill)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs">
          Using the {TARIFF.fca.label} of Rs {TARIFF.fca.perUnit}/unit, electricity duty of {d.dutyPercent}%
          {d.dutyVerified ? "" : " (to be confirmed for this province)"} and GST of {TARIFF.gstPercent}%. Your actual bill will differ
          with the month&apos;s adjustments.
        </p>

        <h2>Check your official {d.name} bill</h2>
        <p>
          To see or download your actual bill, use the official portal with the reference number printed on your bill:{" "}
          <a href={d.billUrl} target="_blank" rel="noopener nofollow">{d.billUrl.replace(/^https:\/\//, "")}</a>.
        </p>

        <h2>Avoid crossing 200 units</h2>
        <p>
          If your home is protected, going even one unit over 200 moves the whole month to unprotected rates.{" "}
          <Link href="/">Track your meter readings with Bijli Guard</Link> and get a warning while you can still cut back. Read{" "}
          <Link href="/200-units-rule/">how the 200-unit rule works</Link>.
        </p>
      </section>
    </div>
  );
}
