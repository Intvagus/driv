import type { Metadata } from "next";
import { LegalPage } from "@/components/tracker/LegalPage";
import { APP_NAME, LEGAL } from "@/lib/tracker/config";

export const metadata: Metadata = { title: { absolute: `Refund Policy — ${APP_NAME}` } };

export default function RefundsPage() {
  const { contactEmail } = LEGAL;
  return (
    <LegalPage title="Refund Policy">
      <h2>14-day money-back guarantee</h2>
      <p>
        If {APP_NAME} Pro isn&apos;t right for you, email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> within 14 days of your <strong>first</strong> payment
        (monthly or yearly) and we&apos;ll refund it in full. No questions asked.
      </p>

      <h2>After 14 days</h2>
      <p>
        Renewals and payments after the first 14 days aren&apos;t refunded, but you can cancel at any time. You keep
        Pro until the end of the period you&apos;ve paid for, and you won&apos;t be charged again.
      </p>

      <h2>How refunds are paid</h2>
      <p>
        Refunds are issued by our payment provider, Lemon Squeezy, to the original payment method. They usually
        arrive within 5–10 business days, depending on your bank.
      </p>

      <h2>Billing problems</h2>
      <p>
        If you were charged by mistake (for example twice, or after cancelling), email us and we&apos;ll fix it,
        whatever the date.
      </p>
    </LegalPage>
  );
}
