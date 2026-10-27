import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/site";
import { Guard } from "@/components/Guard";
import { DISCOS } from "@/lib/discos";
import { TARIFF } from "@/lib/tariff";

const FAQ = [
  {
    q: "Where do I find my meter reading?",
    a: "On the front of your electricity meter: the large number before the decimal point (ignore any red digits). On a digital meter, wait for the screen that shows kWh total.",
  },
  {
    q: "Where do I find my last bill's reading?",
    a: "Your bill shows \"Previous\" and \"Present\" readings and a reading date. Use the Present reading and its date to start, because that's where this month's units begin.",
  },
  {
    q: "Is my data uploaded anywhere?",
    a: "No. Your readings are saved only in this phone's browser. There is no account and nothing is sent to a server.",
  },
  {
    q: "Why does crossing 200 units matter so much?",
    a: "Protected homes pay much lower rates for up to 200 units. At 201 units the whole month is charged at unprotected rates plus fixed charges, which roughly doubles the bill. See the 200-unit rule page for details.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">Stay under 200 units. Know your bill before it comes.</h1>
        <p className="mt-2 font-urdu text-lg leading-loose text-slate-700" dir="rtl" lang="ur">
          200 یونٹ سے کم رہیں — بل آنے سے پہلے جانیں
        </p>
        <p className="mt-2 text-slate-600">
          Enter your meter reading every few days. Bijli Guard predicts this month&apos;s units and bill, and warns you before you
          cross 200 units, while you still have time to cut back. Works for all {DISCOS.length} companies, free.
        </p>
      </section>

      <Guard />

      <AdSlot slot={AD_SLOTS.top} />

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="text-lg font-bold">Just want to calculate a bill?</h2>
        <p className="mt-1 text-sm text-slate-600">Enter units and your company to see the estimated bill with every charge explained.</p>
        <Link href="/calculator/" className="mt-3 inline-block rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Open bill calculator
        </Link>
      </section>

      <section className="prose-lite">
        <h2>How it works</h2>
        <ol>
          <li>Set up once with the reading and date from your last bill.</li>
          <li>Every few days, type in the number on your meter.</li>
          <li>See your units so far, the forecast for the month, and how many units a day you can still use.</li>
        </ol>
        <h2>Bill calculators by company</h2>
        <ul className="!list-none !ps-0 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DISCOS.map((d) => (
            <li key={d.slug}>
              <Link href={`/${d.slug}-bill-calculator/`}>{d.name} bill calculator</Link>
            </li>
          ))}
        </ul>
        <h2>Questions</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
        <p className="text-xs">Rates last reviewed {TARIFF.lastReviewed}. <Link href="/tariff/">See every rate used</Link>.</p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
