"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rl-border px-3 py-2 text-sm font-medium hover:bg-slate-50 print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden /> Print / Save PDF
    </button>
  );
}
