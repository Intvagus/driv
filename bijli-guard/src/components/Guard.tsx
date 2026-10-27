"use client";

import { useEffect, useMemo, useState } from "react";
import { DISCOS, getDisco } from "@/lib/discos";
import { fill, LangSection, useLang } from "@/lib/i18n";
import { clear, load, save, todayIso, type Saved } from "@/lib/storage";
import { TARIFF, calculateBill, type ConsumerType } from "@/lib/tariff";
import { addDays, crossingCost, project, validateReading, type TrackerSetup } from "@/lib/tracker";
import { rs } from "./Calculator";

const field = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base";

export function Guard() {
  const { t } = useLang();
  const [data, setData] = useState<Saved | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setData(load());
    setLoaded(true);
  }, []);

  const persist = (next: Saved | null) => {
    setData(next);
    if (next) save(next);
    else clear();
  };

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-white" aria-busy="true" />;

  return (
    <LangSection>
      {!data || editing ? (
        <Setup
          initial={data?.setup}
          onSave={(setup) => {
            // A new starting reading starts a new cycle; keep later readings only.
            const readings = (data?.readings ?? []).filter((r) => r.date > setup.start.date && r.value >= setup.start.value);
            persist({ setup, readings });
            setEditing(false);
          }}
          onCancel={data ? () => setEditing(false) : undefined}
        />
      ) : (
        <Dashboard data={data} onChange={persist} onEdit={() => setEditing(true)} resetLabel={t.resetAll} />
      )}
    </LangSection>
  );
}

function Setup({ initial, onSave, onCancel }: { initial?: TrackerSetup; onSave: (s: TrackerSetup) => void; onCancel?: () => void }) {
  const { t } = useLang();
  const [disco, setDisco] = useState(initial?.disco ?? "lesco");
  const [type, setType] = useState<ConsumerType>(initial?.type ?? "protected");
  const [kw, setKw] = useState(String(initial?.sanctionedKw ?? 2));
  const [date, setDate] = useState(initial?.start.date ?? addDays(todayIso(), -10));
  const [value, setValue] = useState(initial ? String(initial.start.value) : "");
  const [days, setDays] = useState(String(initial?.cycleDays ?? 30));
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = Number(value);
    if (!value || !Number.isFinite(v) || v < 0) return setError(t.errors.badValue);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > todayIso()) return setError(t.errors.badDate);
    onSave({
      disco,
      type,
      sanctionedKw: Math.max(1, Number(kw) || 1),
      start: { date, value: v },
      cycleDays: Math.min(40, Math.max(25, Number(days) || 30)),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{t.setupTitle}</h2>
      <p className="mt-1 text-sm text-slate-600">{t.setupIntro}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {t.company}
          <select className={field} value={disco} onChange={(e) => setDisco(e.target.value)}>
            {DISCOS.map((x) => (
              <option key={x.slug} value={x.slug}>{x.name} ({x.province})</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          {t.consumerType}
          <select className={field} value={type} onChange={(e) => setType(e.target.value as ConsumerType)}>
            <option value="protected">{t.protected}</option>
            <option value="unprotected">{t.unprotected}</option>
            <option value="lifeline">{t.lifeline}</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          {t.lastReadingDate}
          <input type="date" className={field} value={date} max={todayIso()} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="block text-sm font-medium">
          {t.lastReadingValue}
          <input className={field} inputMode="numeric" placeholder="e.g. 15234" value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))} required />
        </label>
        <label className="block text-sm font-medium">
          {t.sanctionedLoad}
          <input className={field} inputMode="decimal" value={kw} onChange={(e) => setKw(e.target.value)} />
          <span className="mt-1 block text-xs font-normal text-slate-500">{t.sanctionedLoadHelp}</span>
        </label>
        <label className="block text-sm font-medium">
          {t.cycleDays}
          <input className={field} inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
      <div className="mt-5 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">{t.start}</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100">✕</button>}
      </div>
    </form>
  );
}

const LEVEL_STYLE = {
  safe: "border-brand bg-brand-soft text-brand-dark",
  close: "border-warn bg-warn-soft text-warn",
  over: "border-danger bg-danger-soft text-danger",
  unknown: "border-line bg-slate-50 text-slate-700",
} as const;

function Dashboard({ data, onChange, onEdit, resetLabel }: { data: Saved; onChange: (d: Saved | null) => void; onEdit: () => void; resetLabel: string }) {
  const { t, lang } = useLang();
  const { setup, readings } = data;
  const today = todayIso();
  const [date, setDate] = useState(today);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const disco = getDisco(setup.disco) ?? DISCOS[0];
  const p = useMemo(() => project(setup, readings, today), [setup, readings, today]);
  const cost = useMemo(
    () => (Number.isFinite(p.limit) ? crossingCost(setup, disco.dutyPercent, p.limit) : null),
    [setup, disco, p.limit]
  );
  const bill =
    p.projectedUnits !== null
      ? calculateBill({ units: p.projectedUnits, type: setup.type, sanctionedKw: setup.sanctionedKw, electricityDutyPercent: disco.dutyPercent })
      : null;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const reading = { date, value: Number(value) };
    const err = value === "" ? "badValue" : validateReading(setup, readings, reading);
    if (err) return setError(t.errors[err]);
    setError("");
    setValue("");
    const others = readings.filter((r) => r.date !== date);
    onChange({ setup, readings: [...others, reading].sort((a, b) => a.date.localeCompare(b.date)) });
  };

  const limitText = Number.isFinite(p.limit) ? p.limit : "∞";
  const message = { safe: t.levelSafe, close: t.levelClose, over: t.levelOver, unknown: t.levelUnknown }[p.level];

  return (
    <div className="space-y-4">
      <section className={`rounded-2xl border-2 p-5 ${LEVEL_STYLE[p.level]}`} aria-live="polite">
        <p className="text-sm font-semibold">
          <bdi>{disco.name}</bdi> · <bdi>{t.guardTitle}</bdi>
        </p>
        <p className="mt-1 text-lg font-bold">{fill(message, { limit: limitText })}</p>
        {(p.level === "close" || p.level === "over") && cost && (
          <p className="mt-2 text-sm">
            {fill(t.crossingCost, { limit: cost.limit, extra: cost.extra.toLocaleString("en-PK") })}
            {setup.type === "protected" && TARIFF.protectedMonths > 1 && <> {fill(t.protectedLoss, { months: TARIFF.protectedMonths })}</>}
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t.usedSoFar} value={`${p.usedSoFar}`} unit={t.units} />
        <Stat label={t.projected} value={p.projectedUnits === null ? "—" : `${p.projectedUnits}`} unit={t.units} />
        <Stat label={t.unitsLeft} value={Number.isFinite(p.limit) ? `${p.unitsLeft}` : "—"} unit={t.units} />
        <Stat label={t.dailyBudget} value={p.dailyBudget === null ? "—" : p.dailyBudget.toFixed(1)} unit={t.perDay} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-slate-600">{t.estBill}</p>
          <p className="text-xs text-slate-500">{t.nextReading} <span dir="ltr">{p.nextReadingDate}</span> · {p.daysLeft} {t.daysLeft}</p>
        </div>
        <p className="text-2xl font-bold" dir="ltr">{bill ? rs(bill.total) : "—"}</p>

        <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="block text-sm font-medium">
            {t.meterReading}
            <input className={field} inputMode="numeric" placeholder={String(readings.at(-1)?.value ?? setup.start.value)} value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))} />
          </label>
          <label className="block text-sm font-medium">
            {t.date}
            <input type="date" className={field} value={date} min={setup.start.date} max={today} onChange={(e) => setDate(e.target.value)} />
          </label>
          <button type="submit" className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">{t.save}</button>
        </form>
        {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h3 className="font-semibold">{t.history}</h3>
        <ul className="mt-2 divide-y divide-line text-sm">
          <li className="flex justify-between py-2 text-slate-500"><span dir="ltr">{setup.start.date}</span><span dir="ltr">{setup.start.value}</span></li>
          {readings.map((r) => (
            <li key={r.date} className="flex items-center justify-between gap-3 py-2">
              <span dir="ltr">{r.date}</span>
              <span className="flex items-center gap-3">
                <span dir="ltr">{r.value} <span className="text-slate-500">(+{r.value - setup.start.value})</span></span>
                <button onClick={() => onChange({ setup, readings: readings.filter((x) => x.date !== r.date) })} className="text-xs text-danger underline">{t.delete}</button>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <button onClick={onEdit} className="font-medium text-brand underline">{t.edit}</button>
          <button
            onClick={() => {
              if (confirm(t.resetConfirm)) onChange(null);
            }}
            className="text-slate-500 underline"
          >
            {resetLabel}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">{lang === "ur" ? "اندازہ آپ کے پچھلے دنوں کے اوسط استعمال پر مبنی ہے۔" : "Forecast is based on your average daily use so far."}</p>
      </section>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3 text-center shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold tabular-nums" dir="ltr">{value}</p>
      <p className="text-xs text-slate-500">{unit}</p>
    </div>
  );
}
