import type { Metadata } from "next";
import { trackerPath } from "@/lib/tracker/urls";
import Link from "next/link";
import { GuidesHeader } from "@/components/tracker/GuidesHeader";
import { APP_NAME } from "@/lib/tracker/config";
import { GUIDES } from "@/lib/tracker/guides";

export const metadata: Metadata = {
  title: { absolute: `Hair Progress Guides — ${APP_NAME}` },
  description:
    "Practical guides to tracking hair loss treatment: consistent progress photos, minoxidil and finasteride timelines, and hair transplant growth.",
  alternates: { canonical: trackerPath("/tracker/guides") },
};

export default function GuidesIndex() {
  return (
    <>
      <GuidesHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Hair progress guides</h1>
        <p className="mt-2 text-slate-600">
          How to track a hair loss treatment properly, and what to bring to your doctor.
        </p>
        <ul className="mt-8 space-y-4">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/tracker/guides/${g.slug}`}
                className="block rounded-2xl border border-rl-border bg-white p-5 transition-colors hover:border-rl-primary/40"
              >
                <h2 className="text-lg font-semibold">{g.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{g.description}</p>
                <p className="mt-2 text-xs text-slate-500">{g.readMinutes} min read</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
