import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, FileText, Lock, QrCode } from "lucide-react";
import { GuidesHeader } from "@/components/tracker/GuidesHeader";
import { APP_NAME, FREE_CHECKIN_LIMIT, LEGAL, PRICING } from "@/lib/tracker/config";

export const metadata: Metadata = {
  title: { absolute: `For Clinics — ${APP_NAME}` },
  description: `Free QR cards that help your hair transplant and hair loss patients track their growth month by month, and bring consistent photos to follow-ups.`,
  alternates: { canonical: "/tracker/clinics" },
};

const STEPS = [
  {
    icon: QrCode,
    title: "Print your clinic's card",
    body: "Enter your clinic name below and print a sheet of business-card-size QR cards. It takes two minutes and costs nothing.",
  },
  {
    icon: CalendarCheck,
    title: "Hand one to each patient",
    body: "At the consultation or on surgery day: \"Take your baseline photos tonight, then once a month.\" Rootline guides the same four angles every time.",
  },
  {
    icon: FileText,
    title: "See consistent photos at follow-ups",
    body: "Patients can bring a one-page side-by-side report, so you're comparing like with like instead of photos from different rooms and lighting.",
  },
];

export default function ClinicsPage() {
  return (
    <>
      <GuidesHeader />
      <main>
        <section className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-rl-primary">For hair clinics</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Help every patient see their growth, month by month
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            The months after a transplant or a new treatment are slow and full of doubt: shedding first, fine
            growth later. Rootline gives your patients a simple monthly photo routine, so they can see the trend
            for themselves and bring consistent photos to their follow-ups.
          </p>
          <a
            href="#card"
            className="mt-6 inline-block rounded-lg bg-rl-primary px-6 py-3 font-semibold text-white hover:bg-rl-primary-dark"
          >
            Make your free QR cards
          </a>
        </section>

        <section className="border-y border-rl-border bg-white">
          <ol className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rl-primary/10 text-rl-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-semibold">
                  {i + 1}. {title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-bold tracking-tight">Good to know</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-semibold">What does it cost?</dt>
              <dd className="mt-1 text-slate-600">
                Nothing for the clinic. Patients get {FREE_CHECKIN_LIMIT} check-ins free; unlimited tracking and
                the printable report are {PRICING.monthly.price}
                {PRICING.monthly.per} or {PRICING.yearly.price}
                {PRICING.yearly.per}, paid by the patient.
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 font-semibold">
                <Lock className="h-4 w-4 text-rl-primary" aria-hidden /> Do we see our patients&apos; photos?
              </dt>
              <dd className="mt-1 text-slate-600">
                No. Photos belong to the patient and stay private in their account. You see them only if a patient
                chooses to show or send you their report. Using a patient&apos;s photos in your own marketing needs
                that patient&apos;s separate written consent, as always.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Is it a medical device or a diagnosis tool?</dt>
              <dd className="mt-1 text-slate-600">
                No. Rootline is a personal photo and treatment tracker. It makes no diagnosis and doesn&apos;t
                replace your follow-up assessments.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Can we see how many patients joined?</dt>
              <dd className="mt-1 text-slate-600">
                Yes. Each card carries your clinic&apos;s own link. Email{" "}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-rl-primary hover:underline">
                  {LEGAL.contactEmail}
                </a>{" "}
                for a count of sign-ups from your cards. It&apos;s a number only, with no patient details.
              </dd>
            </div>
          </dl>
        </section>

        <section id="card" className="border-t border-rl-border bg-white">
          <div className="mx-auto max-w-xl px-4 py-12">
            <h2 className="text-2xl font-bold tracking-tight">Make your QR cards</h2>
            <p className="mt-1 text-sm text-slate-600">
              Prints 10 business-card-size cards on US Letter paper. Works with standard perforated card sheets or
              plain card stock.
            </p>
            <form action="/tracker/clinics/card" method="get" className="mt-6 space-y-4">
              <label className="block text-sm">
                <span className="font-medium">Clinic name</span>
                <input
                  name="name"
                  required
                  maxLength={60}
                  placeholder="e.g. Bright Hair Clinic Austin"
                  className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Extra line (optional)</span>
                <input
                  name="line"
                  maxLength={70}
                  placeholder="e.g. Bring your report to your 3-month follow-up"
                  className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-rl-primary py-2.5 font-semibold text-white hover:bg-rl-primary-dark"
              >
                Create printable cards
              </button>
            </form>
            <p className="mt-6 text-xs text-slate-500">
              Questions or a partnership idea?{" "}
              <a href={`mailto:${LEGAL.contactEmail}`} className="underline">
                Email us
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
