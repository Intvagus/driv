import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Columns2, Pill, FileText, Lock, Check } from "lucide-react";
import { RootlineLogo } from "@/components/tracker/Logo";
import { APP_NAME, APP_TAGLINE, FREE_CHECKIN_LIMIT, PRICING } from "@/lib/tracker/config";

import { trackerPath } from "@/lib/tracker/urls";

export const metadata: Metadata = { alternates: { canonical: trackerPath("/tracker") } };

const FEATURES = [
  {
    icon: Camera,
    title: "Guided monthly photos",
    body: "Four standard angles with framing tips, and last month's photo laid over the live camera so every shot lines up.",
  },
  {
    icon: Columns2,
    title: "Side-by-side & slider compare",
    body: "Put any two months next to each other, or drag a slider across them. Small changes become obvious.",
  },
  {
    icon: Pill,
    title: "Treatment check-offs",
    body: "Tick off minoxidil, finasteride or anything else each day and see your 30-day adherence at a glance.",
  },
  {
    icon: FileText,
    title: "Doctor-ready report",
    body: "One printable page with your first vs latest photos, shedding trend and treatment history.",
  },
];

const FAQ = [
  {
    q: "How long until I see results?",
    a: "Most hair treatments take 3–6 months before visible change, and 12 months for a full picture. That slow pace is exactly why consistent monthly photos matter — your memory and your mirror won't catch it.",
  },
  {
    q: "Who can see my photos?",
    a: "Only you. Photos are stored in a private, encrypted bucket and are shown to you through links that expire after an hour. We never sell or share your data.",
  },
  {
    q: "Is this medical advice?",
    a: `No. ${APP_NAME} is a tracking tool. It helps you and your doctor see what's happening, but it doesn't diagnose or recommend treatments.`,
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account in two clicks and keep Pro until the end of the period you paid for. Your photos stay yours.",
  },
];

export default function TrackerLanding({
  searchParams,
}: {
  searchParams: { deleted?: string; from?: string };
}) {
  return (
    <>
      {searchParams.from === "clinic" && (
        <div role="status" className="bg-rl-primary px-4 py-3 text-center text-sm text-white">
          Welcome! Your clinic recommends taking monthly progress photos. Start with your baseline today. It&apos;s
          free.
        </div>
      )}
      {searchParams.deleted && (
        <div role="status" className="bg-rl-ink px-4 py-3 text-center text-sm text-white">
          {searchParams.deleted === "account"
            ? "Your account and all your data have been deleted."
            : "All your Rootline data has been deleted. Your login was kept because you also use it for the clinic site."}
        </div>
      )}
      <header className="border-b border-rl-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/tracker">
            <RootlineLogo />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#pricing" className="hidden text-slate-600 hover:text-rl-ink sm:inline">
              Pricing
            </a>
            <Link href="/tracker/guides" className="hidden text-slate-600 hover:text-rl-ink sm:inline">
              Guides
            </Link>
            <Link href="/tracker/login" className="text-slate-600 hover:text-rl-ink">
              Sign in
            </Link>
            <Link
              href="/tracker/login?mode=signup"
              className="rounded-lg bg-rl-primary px-4 py-2 font-semibold text-white hover:bg-rl-primary-dark"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-rl-primary">
            Hair loss progress tracker
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Is your treatment actually working?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {APP_TAGLINE} Take guided scalp photos once a month, compare them side by side, and track
            the treatments you&apos;re on — all in one private place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tracker/login?mode=signup"
              className="w-full rounded-lg bg-rl-primary px-6 py-3 text-base font-semibold text-white shadow hover:bg-rl-primary-dark sm:w-auto"
            >
              Start tracking free
            </Link>
            <a
              href="#how"
              className="w-full rounded-lg border border-rl-border bg-white px-6 py-3 text-base font-semibold text-rl-ink hover:bg-slate-50 sm:w-auto"
            >
              How it works
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            No credit card needed · {FREE_CHECKIN_LIMIT} free check-ins · Works on any phone
          </p>
        </section>

        <section id="how" className="border-y border-rl-border bg-white">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rl-primary/10 text-rl-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-2 text-center text-slate-600">Start free. Upgrade when you&apos;re hooked.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PriceCard
              name="Free"
              price="$0"
              per=""
              features={[`${FREE_CHECKIN_LIMIT} photo check-ins`, "Side-by-side compare", "Treatment check-offs"]}
              cta="Start free"
              href="/tracker/login?mode=signup"
            />
            <PriceCard
              name={`Pro ${PRICING.monthly.label}`}
              price={PRICING.monthly.price}
              per={PRICING.monthly.per}
              features={["Unlimited check-ins", "Doctor-ready report", "Everything in Free"]}
              cta="Go Pro"
              href="/tracker/login?mode=signup&plan=monthly"
            />
            <PriceCard
              name={`Pro ${PRICING.yearly.label}`}
              price={PRICING.yearly.price}
              per={PRICING.yearly.per}
              badge={PRICING.yearly.note}
              features={["Unlimited check-ins", "Doctor-ready report", "Everything in Free"]}
              cta="Go Pro yearly"
              href="/tracker/login?mode=signup&plan=yearly"
              highlight
            />
          </div>
        </section>

        <section className="border-t border-rl-border bg-white">
          <div className="mx-auto max-w-3xl px-4 py-14">
            <h2 className="text-center text-2xl font-bold tracking-tight">Questions</h2>
            <dl className="mt-8 space-y-6">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-semibold">{q}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Private by default. Your photos are only visible to you.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

function PriceCard({
  name,
  price,
  per,
  features,
  cta,
  href,
  badge,
  highlight,
}: {
  name: string;
  price: string;
  per: string;
  features: string[];
  cta: string;
  href: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-6 ${
        highlight ? "border-rl-primary shadow-lg ring-1 ring-rl-primary" : "border-rl-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
        {badge && (
          <span className="rounded-full bg-rl-accent/10 px-2.5 py-0.5 text-xs font-semibold text-rl-accent">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-slate-500">{per}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-rl-primary" aria-hidden /> {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
          highlight
            ? "bg-rl-primary text-white hover:bg-rl-primary-dark"
            : "border border-rl-border text-rl-ink hover:bg-slate-50"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
