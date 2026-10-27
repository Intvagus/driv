"use client";

import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      className={`rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-slate-50 ${lang === "en" ? "font-urdu" : ""}`}
      aria-label={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
    >
      {t.language}
    </button>
  );
}
