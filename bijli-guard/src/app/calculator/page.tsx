import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/site";
import { Calculator } from "@/components/Calculator";
import { DISCOS } from "@/lib/discos";

export const metadata: Metadata = {
  title: "Electricity Bill Calculator Pakistan 2026 (All Companies)",
  description:
    "Calculate your electricity bill from units for LESCO, IESCO, FESCO, GEPCO, MEPCO, PESCO, HESCO, SEPCO, QESCO, TESCO, HAZECO and K-Electric, with protected and unprotected rates.",
  alternates: { canonical: "/calculator/" },
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Electricity bill calculator for Pakistan</h1>
      <p className="text-slate-600">
        Pick your company, enter the units used and your bill type. You&apos;ll see the estimated total and every charge that
        goes into it. Check your bill&apos;s fuel adjustment and correct it under &quot;Adjust rates&quot; for the closest estimate.
      </p>
      <Calculator />
      <AdSlot slot={AD_SLOTS.inContent} />
      <section className="prose-lite">
        <h2>Calculators by company</h2>
        <ul>
          {DISCOS.map((d) => (
            <li key={d.slug}>
              <Link href={`/${d.slug}-bill-calculator/`}>{d.name} bill calculator</Link> — {d.areas}
            </li>
          ))}
        </ul>
        <p>
          Want to avoid a high bill instead of just predicting it? <Link href="/">Track your meter readings</Link> and get a
          warning before you cross 200 units.
        </p>
      </section>
    </div>
  );
}
