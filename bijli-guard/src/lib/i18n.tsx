"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ur";

const en = {
  appName: "Bijli Guard",
  tagline: "Stay under 200 units. Know your bill before it comes.",
  guardTitle: "200-unit guard",
  setupTitle: "Set up in 1 minute",
  setupIntro: "Copy these from your last electricity bill. Everything stays on this phone.",
  company: "Electricity company",
  consumerType: "Your bill type",
  protected: "Protected (200 units or less for 6 months)",
  unprotected: "Unprotected",
  lifeline: "Lifeline",
  sanctionedLoad: "Sanctioned load (kW)",
  sanctionedLoadHelp: "Printed on your bill as \"Sanctioned Load\" or \"Load\".",
  lastReadingDate: "Reading date on last bill",
  lastReadingValue: "Present reading on last bill",
  cycleDays: "Days between readings",
  start: "Start guarding",
  addReading: "Add today's meter reading",
  meterReading: "Meter reading",
  date: "Date",
  save: "Save reading",
  usedSoFar: "Used so far",
  projected: "Expected this month",
  unitsLeft: "Units left before limit",
  dailyBudget: "Daily budget",
  perDay: "units/day",
  units: "units",
  daysLeft: "days left",
  nextReading: "Next meter reading around",
  levelSafe: "You're on track to stay under {limit} units.",
  levelClose: "Careful: you're close to {limit} units.",
  levelOver: "Warning: at this pace you'll cross {limit} units.",
  levelUnknown: "Add a reading tomorrow to see your forecast.",
  crossingCost: "Crossing {limit} units adds about Rs {extra} to this bill.",
  protectedLoss: "Protected homes that cross 200 units can also lose the protected rates for the next {months} months.",
  estBill: "Estimated bill",
  history: "Readings",
  delete: "Delete",
  resetAll: "Reset everything",
  resetConfirm: "Delete your setup and all readings from this phone?",
  edit: "Edit setup",
  calcTitle: "Bill calculator",
  unitsUsed: "Units used",
  calculate: "Calculate",
  total: "Estimated total",
  adjustments: "Adjust rates from your bill",
  fcaRate: "Fuel adjustment (Rs/unit)",
  qtaRate: "Quarterly adjustment (Rs/unit)",
  dutyRate: "Electricity duty (%)",
  gstRate: "GST (%)",
  estimateNote: "Estimate only. Your company's bill is final. Rates were last reviewed {date}.",
  errors: {
    badDate: "Please enter a valid date.",
    badValue: "Please enter a valid meter reading.",
    beforeStart: "This date is before your last bill's reading date.",
    lowerThanBefore: "This reading is lower than an earlier one. Check the meter number.",
    higherThanAfter: "This reading is higher than a later one. Check the date.",
  } as Record<string, string>,
  language: "اردو",
};

const ur: typeof en = {
  appName: "بجلی گارڈ",
  tagline: "200 یونٹ سے کم رہیں۔ بل آنے سے پہلے جانیں۔",
  guardTitle: "200 یونٹ گارڈ",
  setupTitle: "ایک منٹ میں سیٹ اپ کریں",
  setupIntro: "یہ معلومات اپنے پچھلے بجلی کے بل سے لکھیں۔ سب کچھ اسی فون میں محفوظ رہتا ہے۔",
  company: "بجلی کمپنی",
  consumerType: "آپ کے بل کی قسم",
  protected: "پروٹیکٹڈ (6 ماہ سے 200 یونٹ یا کم)",
  unprotected: "نان پروٹیکٹڈ",
  lifeline: "لائف لائن",
  sanctionedLoad: "منظور شدہ لوڈ (کلو واٹ)",
  sanctionedLoadHelp: "بل پر \"Sanctioned Load\" یا \"Load\" کے نام سے لکھا ہوتا ہے۔",
  lastReadingDate: "پچھلے بل پر ریڈنگ کی تاریخ",
  lastReadingValue: "پچھلے بل پر موجودہ ریڈنگ",
  cycleDays: "ریڈنگز کے درمیان دن",
  start: "گارڈ شروع کریں",
  addReading: "آج کی میٹر ریڈنگ لکھیں",
  meterReading: "میٹر ریڈنگ",
  date: "تاریخ",
  save: "ریڈنگ محفوظ کریں",
  usedSoFar: "اب تک استعمال",
  projected: "اس ماہ متوقع",
  unitsLeft: "حد سے پہلے باقی یونٹ",
  dailyBudget: "روزانہ بجٹ",
  perDay: "یونٹ روزانہ",
  units: "یونٹ",
  daysLeft: "دن باقی",
  nextReading: "اگلی میٹر ریڈنگ تقریباً",
  levelSafe: "آپ {limit} یونٹ سے کم رہنے کی راہ پر ہیں۔",
  levelClose: "احتیاط: آپ {limit} یونٹ کے قریب ہیں۔",
  levelOver: "خبردار: اسی رفتار سے آپ {limit} یونٹ سے بڑھ جائیں گے۔",
  levelUnknown: "پیشگوئی دیکھنے کے لیے کل ایک اور ریڈنگ لکھیں۔",
  crossingCost: "{limit} یونٹ سے بڑھنے پر اس بل میں تقریباً {extra} روپے کا اضافہ ہوگا۔",
  protectedLoss: "200 یونٹ سے بڑھنے والے پروٹیکٹڈ گھر اگلے {months} ماہ تک پروٹیکٹڈ ریٹ سے بھی محروم ہو سکتے ہیں۔",
  estBill: "متوقع بل",
  history: "ریڈنگز",
  delete: "حذف کریں",
  resetAll: "سب کچھ ختم کریں",
  resetConfirm: "کیا اس فون سے سیٹ اپ اور تمام ریڈنگز حذف کر دیں؟",
  edit: "سیٹ اپ تبدیل کریں",
  calcTitle: "بل کیلکولیٹر",
  unitsUsed: "استعمال شدہ یونٹ",
  calculate: "حساب لگائیں",
  total: "کل متوقع بل",
  adjustments: "اپنے بل سے ریٹ درست کریں",
  fcaRate: "فیول ایڈجسٹمنٹ (روپے فی یونٹ)",
  qtaRate: "سہ ماہی ایڈجسٹمنٹ (روپے فی یونٹ)",
  dutyRate: "الیکٹرسٹی ڈیوٹی (%)",
  gstRate: "جی ایس ٹی (%)",
  estimateNote: "یہ صرف اندازہ ہے۔ حتمی بل کمپنی کا ہوگا۔ ریٹ آخری بار {date} کو دیکھے گئے۔",
  errors: {
    badDate: "براہ کرم درست تاریخ لکھیں۔",
    badValue: "براہ کرم درست میٹر ریڈنگ لکھیں۔",
    beforeStart: "یہ تاریخ پچھلے بل کی ریڈنگ کی تاریخ سے پہلے کی ہے۔",
    lowerThanBefore: "یہ ریڈنگ پچھلی ریڈنگ سے کم ہے۔ میٹر نمبر دوبارہ دیکھیں۔",
    higherThanAfter: "یہ ریڈنگ بعد والی ریڈنگ سے زیادہ ہے۔ تاریخ دوبارہ دیکھیں۔",
  },
  language: "English",
};

export type Dict = typeof en;
const DICTS: Record<Lang, Dict> = { en, ur };

export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

const LangContext = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "en",
  t: en,
  setLang: () => {},
});

const KEY = "bijli-guard-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "ur" || saved === "en") setLangState(saved);
    } catch {
      // Storage unavailable (private mode): stay in English.
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      // ignore
    }
  };

  return <LangContext.Provider value={{ lang, t: DICTS[lang], setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Wraps client UI in the right direction and font for the chosen language. */
export function LangSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { lang } = useLang();
  return (
    <div dir={lang === "ur" ? "rtl" : "ltr"} lang={lang} className={`${lang === "ur" ? "font-urdu leading-loose" : ""} ${className}`}>
      {children}
    </div>
  );
}
