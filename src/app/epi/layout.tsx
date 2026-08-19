import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EPI Data Analytics Platform",
  description: "Upload, analyze, visualize and report on EPI/immunization programme data.",
  robots: { index: false, follow: false },
};

export default function EpiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-epi-bg text-epi-ink">
      <a href="#epi-main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Skip to main content
      </a>
      <header className="border-b border-epi-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/epi" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-epi-primary text-sm font-bold text-white">E</span>
            <span className="text-sm font-semibold text-epi-ink">EPI Data Analytics Platform</span>
          </a>
          <span className="hidden text-xs text-slate-400 sm:inline">Designed with reference to publicly available WHO guidance — not WHO-certified</span>
        </div>
      </header>
      <main id="epi-main" className="px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-epi-border bg-white px-4 py-6 text-center text-xs text-slate-400">
        Your uploaded data is processed in your browser and is not permanently stored. Not an official WHO product; not WHO-certified.
      </footer>
    </div>
  );
}
