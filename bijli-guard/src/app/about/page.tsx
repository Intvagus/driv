import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { TARIFF } from "@/lib/tariff";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about/" } };

export default function About() {
  return (
    <div className="prose-lite">
      <h1 className="text-2xl font-bold">About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} is a free tool that helps Pakistani households understand their electricity bill and avoid crossing the
        200-unit limit. It is independent and not affiliated with NEPRA, PITC or any electricity distribution company.
      </p>
      <h2>How estimates work</h2>
      <p>
        Bills are estimated from the national residential tariff ({TARIFF.source}), the latest fuel and quarterly adjustments we
        know of, provincial electricity duty and GST. Rates were last reviewed on {TARIFF.lastReviewed}. Estimates can differ
        from your official bill, which is always final.
      </p>
      <h2>Contact</h2>
      <p>Found a wrong rate or a problem? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </div>
  );
}
