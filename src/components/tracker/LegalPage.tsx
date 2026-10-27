import Link from "next/link";
import { RootlineLogo } from "./Logo";
import { LEGAL } from "@/lib/tracker/config";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-rl-border bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/tracker">
            <RootlineLogo />
          </Link>
          <Link href="/tracker/app" className="text-sm text-slate-600 hover:text-rl-ink">
            Open app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <article className="prose prose-slate max-w-none prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-lg prose-a:text-rl-primary">
          <h1 className="text-2xl">{title}</h1>
          <p className="text-sm text-slate-500">Last updated: {LEGAL.lastUpdated}</p>
          {children}
        </article>
        <nav className="mt-10 flex flex-wrap gap-4 border-t border-rl-border pt-4 text-sm">
          <Link href="/tracker/privacy" className="text-rl-primary hover:underline">
            Privacy
          </Link>
          <Link href="/tracker/terms" className="text-rl-primary hover:underline">
            Terms
          </Link>
          <Link href="/tracker/refunds" className="text-rl-primary hover:underline">
            Refunds
          </Link>
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-rl-primary hover:underline">
            {LEGAL.contactEmail}
          </a>
        </nav>
      </main>
    </>
  );
}
