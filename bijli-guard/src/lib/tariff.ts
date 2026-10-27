// Pakistan residential (A-1) electricity tariff used for bill estimates.
//
// SOURCE AND CONFIDENCE: the slab rates below are the uniform tariff from
// S.R.O. 279(I)/2026 (NEPRA decision of 11 Feb 2026), as reproduced by
// several independent tariff summaries. The 1–200 unit protected and
// unprotected rates also match news reporting of that decision; the upper
// slabs and fixed charges come from tariff summaries only. NEPRA's own site could not be read
// when this was written, and summaries disagree on some figures, so every
// value is shown to the user and can be overridden from their own bill.
// Update this file (and TARIFF.lastReviewed) whenever NEPRA notifies changes.

export type Slab = { upTo: number; rate: number; fixedPerKw: number };

export const TARIFF = {
  lastReviewed: "2026-10-27",
  source: "S.R.O. 279(I)/2026, NEPRA uniform tariff of 11 Feb 2026 (via published tariff summaries)",

  // Lifeline: low-load households. Whole month's units at the band rate.
  lifeline: [
    { upTo: 50, rate: 3.95, fixedPerKw: 0 },
    { upTo: 100, rate: 7.74, fixedPerKw: 0 },
  ] satisfies Slab[],

  // Protected: <= 200 units in each of the previous 6 months. Gets the
  // benefit of one previous slab (first 100 units at the lower rate).
  protected: [
    { upTo: 100, rate: 10.54, fixedPerKw: 0 },
    { upTo: 200, rate: 13.01, fixedPerKw: 0 },
  ] satisfies Slab[],

  // Unprotected: the WHOLE month's units are charged at the rate of the
  // slab reached (no previous-slab benefit), plus a fixed charge per kW of
  // sanctioned load that also rises with the slab.
  unprotected: [
    { upTo: 100, rate: 22.44, fixedPerKw: 275 },
    { upTo: 200, rate: 28.91, fixedPerKw: 300 },
    { upTo: 300, rate: 33.1, fixedPerKw: 350 },
    { upTo: 400, rate: 36.46, fixedPerKw: 400 },
    { upTo: 500, rate: 38.95, fixedPerKw: 500 },
    { upTo: 600, rate: 40.22, fixedPerKw: 675 },
    { upTo: 700, rate: 41.85, fixedPerKw: 675 },
    { upTo: Infinity, rate: 47.2, fixedPerKw: 675 },
  ] satisfies Slab[],

  protectedLimit: 200,
  // Months a household must stay at or under the limit to be protected.
  // The government said on 27 Oct 2026 it is working to drop this
  // six-month penalty; change it here once that is notified.
  protectedMonths: 6,

  // Monthly fuel charge adjustment and quarterly adjustment (Rs/unit).
  // These change often: users should copy the figure from their bill.
  // FCA: NEPRA decision for August 2026 consumption, billed in October 2026
  // (reported by Express Tribune and Dawn). The September 2026 FCA was still
  // pending (DISCOs sought Rs 2.5624) as of the review date.
  fca: { perUnit: 1.1086, label: "August 2026 FCA (on October 2026 bills)" },
  // QTA: Apr–Jun 2026 quarterly adjustment, applied Sep–Nov 2026.
  qta: { perUnit: 0.5194, label: "Apr–Jun 2026 quarterly adjustment (Sep–Nov 2026 bills)" },

  gstPercent: 18,
} as const;

export type ConsumerType = "protected" | "unprotected" | "lifeline";

export type BillInput = {
  units: number;
  type: ConsumerType;
  sanctionedKw: number;
  electricityDutyPercent: number;
  fcaPerUnit?: number;
  qtaPerUnit?: number;
  gstPercent?: number;
};

export type BillLine = { key: string; label: string; labelUr: string; amount: number; note?: string };

export type Bill = {
  units: number;
  /** The tariff actually applied (protected/lifeline usage over the limit is billed as unprotected). */
  appliedType: ConsumerType;
  slabRate: number;
  lines: BillLine[];
  total: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function slabFor(slabs: readonly Slab[], units: number) {
  return slabs.find((s) => units <= s.upTo) ?? slabs[slabs.length - 1];
}

/** Which tariff applies this month, given the household's status and usage. */
export function appliedType(type: ConsumerType, units: number): ConsumerType {
  if (type === "lifeline" && units <= 100) return "lifeline";
  if ((type === "protected" || type === "lifeline") && units <= TARIFF.protectedLimit) return "protected";
  return "unprotected";
}

export function energyCharge(type: ConsumerType, units: number) {
  if (units <= 0) return { amount: 0, rate: 0 };
  if (type === "protected") {
    const [first, second] = TARIFF.protected;
    if (units <= first.upTo) return { amount: units * first.rate, rate: first.rate };
    return { amount: first.upTo * first.rate + (units - first.upTo) * second.rate, rate: second.rate };
  }
  const slab = slabFor(type === "lifeline" ? TARIFF.lifeline : TARIFF.unprotected, units);
  return { amount: units * slab.rate, rate: slab.rate };
}

export function fixedCharge(type: ConsumerType, units: number, sanctionedKw: number) {
  if (type !== "unprotected" || units <= 0) return 0;
  return slabFor(TARIFF.unprotected, units).fixedPerKw * Math.max(1, Math.ceil(sanctionedKw));
}

export function calculateBill(input: BillInput): Bill {
  const units = Math.max(0, Math.round(input.units));
  const type = appliedType(input.type, units);
  const fcaRate = input.fcaPerUnit ?? TARIFF.fca.perUnit;
  const qtaRate = input.qtaPerUnit ?? TARIFF.qta.perUnit;
  const gstPct = input.gstPercent ?? TARIFF.gstPercent;

  const energy = energyCharge(type, units);
  const fixed = fixedCharge(type, units, input.sanctionedKw);
  // Lifeline consumers are exempt from the fuel and quarterly adjustments.
  const fca = type === "lifeline" ? 0 : units * fcaRate;
  const qta = type === "lifeline" ? 0 : units * qtaRate;
  const duty = ((energy.amount + fixed) * input.electricityDutyPercent) / 100;
  const gst = ((energy.amount + fixed + fca + qta) * gstPct) / 100;

  const lines: BillLine[] = [
    { key: "energy", label: "Energy charges", labelUr: "بجلی کے یونٹس کی قیمت", amount: round2(energy.amount) },
    { key: "fixed", label: "Fixed charges", labelUr: "مقررہ چارجز", amount: round2(fixed) },
    { key: "fca", label: "Fuel price adjustment", labelUr: "فیول ایڈجسٹمنٹ", amount: round2(fca) },
    { key: "qta", label: "Quarterly adjustment", labelUr: "سہ ماہی ایڈجسٹمنٹ", amount: round2(qta) },
    { key: "duty", label: "Electricity duty", labelUr: "الیکٹرسٹی ڈیوٹی", amount: round2(duty) },
    { key: "gst", label: "GST", labelUr: "جی ایس ٹی", amount: round2(gst) },
  ];
  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0));
  return { units, appliedType: type, slabRate: energy.rate, lines, total };
}
