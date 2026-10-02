import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/tracker/config";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} — Hair Loss Progress Tracker` },
  description: `${APP_TAGLINE} Guided scalp photos, side-by-side comparisons, treatment reminders and doctor-ready reports.`,
  keywords: [
    "hair loss tracker",
    "hair progress photos",
    "minoxidil progress",
    "finasteride results tracker",
    "hair transplant progress",
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — Hair Loss Progress Tracker`,
    description: APP_TAGLINE,
  },
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-rl-bg text-rl-ink">
      <a
        href="#rl-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to main content
      </a>
      <div id="rl-main" className="flex-1">
        {children}
      </div>
      <footer className="border-t border-rl-border bg-white px-4 py-6 text-center text-xs text-slate-500">
        <p>
          {APP_NAME} is a personal tracking tool, not a medical device, and does not provide medical
          advice, diagnosis or treatment. Talk to a licensed clinician about any treatment decision.
        </p>
        <p className="mt-2">
          <Link href="/tracker" className="hover:underline">
            Home
          </Link>{" "}
          · © {new Date().getFullYear()} {APP_NAME}
        </p>
      </footer>
    </div>
  );
}
