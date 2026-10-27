"use client";

import { useMemo, useState } from "react";
import { DISCOS, getDisco } from "@/lib/discos";
import { fill, LangSection, useLang } from "@/lib/i18n";
import { TARIFF, calculateBill, type ConsumerType } from "@/lib/tariff";

export const rs = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

const field = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base";

export function Calculator({ defaultDisco = "lesco" }: { defaultDisco?: string }) {
  const { t, lang } = useLang();
  const [disco, setDisco] = useState(defaultDisco);
  const [units, setUnits] = useState("180");
  const [type, setType] = useState<ConsumerType>("protected");
  const [kw, setKw] = useState("2");
  const [showRates, setShowRates] = useState(false);
  const d = getDisco(disco) ?? DISCOS[0];
  const [fca, setFca] = useState(String(TARIFF.fca.perUnit));
  const [qta, setQta] = useState(String(TARIFF.qta.perUnit));
  const [duty, setDuty] = useState<string | null>(null);
  const [gst, setGst] = useState(String(TARIFF.gstPercent));

  const num = (s: string, fallback: number) => (s.trim() === "" || !Number.isFinite(Number(s)) ? fallback : Number(s));

  const bill = useMemo(
    () =>
      calculateBill({
        units: Math.max(0, num(units, 0)),
        type,
        sanctionedKw: Math.max(1, num(kw, 1)),
        electricityDutyPercent: num(duty ?? String(d.dutyPercent), d.dutyPercent),
        fcaPerUnit: num(fca, TARIFF.fca.perUnit),
        qtaPerUnit: num(qta, TARIFF.qta.perUnit),
        gstPercent: num(gst, TARIFF.gstPercent),
      }),
    [units, type, kw, duty, d, fca, qta, gst]
  );

  const typeLabel = { protected: t.protected, unprotected: t.unprotected, lifeline: t.lifeline };

  return (
    <LangSection className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{t.calcTitle}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {t.company}
          <select className={field} value={disco} onChange={(e) => { setDisco(e.target.value); setDuty(null); }}>
            {DISCOS.map((x) => (
              <option key={x.slug} value={x.slug}>
                {x.name} ({lang === "ur" ? x.nameUr : x.province})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          {t.unitsUsed}
          <input className={field} inputMode="numeric" value={units} onChange={(e) => setUnits(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
        <label className="block text-sm font-medium">
          {t.consumerType}
          <select className={field} value={type} onChange={(e) => setType(e.target.value as ConsumerType)}>
            {(["protected", "unprotected", "lifeline"] as const).map((k) => (
              <option key={k} value={k}>{typeLabel[k]}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          {t.sanctionedLoad}
          <input className={field} inputMode="decimal" value={kw} onChange={(e) => setKw(e.target.value)} />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-brand-soft p-4">
        <p className="text-sm text-slate-600">{t.total}</p>
        <p className="text-3xl font-bold text-brand-dark" dir="ltr">{rs(bill.total)}</p>
        {bill.appliedType !== type && (
          <p className="mt-1 text-sm font-medium text-danger">
            {lang === "ur"
              ? `${bill.units} یونٹ پر یہ بل ${typeLabel[bill.appliedType]} ریٹ پر بنے گا۔`
              : `At ${bill.units} units this is billed at ${typeLabel[bill.appliedType].split(" (")[0].toLowerCase()} rates.`}
          </p>
        )}
        <table className="mt-3 w-full text-sm">
          <tbody>
            {bill.lines.map((l) => (
              <tr key={l.key} className="border-t border-brand/10">
                <td className="py-1.5">{lang === "ur" ? l.labelUr : l.label}</td>
                <td className="py-1.5 text-end tabular-nums" dir="ltr">{rs(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => setShowRates(!showRates)} className="mt-4 text-sm font-medium text-brand underline" aria-expanded={showRates}>
        {t.adjustments}
      </button>
      {showRates && (
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <label className="block text-xs font-medium">{t.fcaRate}<input className={field} inputMode="decimal" value={fca} onChange={(e) => setFca(e.target.value)} /></label>
          <label className="block text-xs font-medium">{t.qtaRate}<input className={field} inputMode="decimal" value={qta} onChange={(e) => setQta(e.target.value)} /></label>
          <label className="block text-xs font-medium">{t.dutyRate}<input className={field} inputMode="decimal" value={duty ?? String(d.dutyPercent)} onChange={(e) => setDuty(e.target.value)} /></label>
          <label className="block text-xs font-medium">{t.gstRate}<input className={field} inputMode="decimal" value={gst} onChange={(e) => setGst(e.target.value)} /></label>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">{fill(t.estimateNote, { date: TARIFF.lastReviewed })}</p>
    </LangSection>
  );
}
