import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/tracker/LegalPage";
import { APP_NAME, FREE_CHECKIN_LIMIT, LEGAL } from "@/lib/tracker/config";

// Plain-language template — have it reviewed by a lawyer before launch.

export const metadata: Metadata = { title: { absolute: `Terms of Service — ${APP_NAME}` } };

export default function TermsPage() {
  const { companyName, contactEmail } = LEGAL;
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms are an agreement between you and {companyName} for your use of {APP_NAME}. By creating an account
        you agree to them. If you don&apos;t agree, please don&apos;t use the service.
      </p>

      <h2>1. Not medical advice</h2>
      <p>
        {APP_NAME} is a personal tracking tool. It is not a medical device and does not diagnose, treat or prevent
        any condition, or recommend treatments. Photos taken at home vary with lighting and angle, so apparent changes
        may not reflect real ones. Always talk to a licensed clinician before starting, stopping or changing any
        treatment.
      </p>

      <h2>2. Your account</h2>
      <p>
        You must be 18 or older. Keep your sign-in details secure; you&apos;re responsible for activity on your
        account. Tell us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> if you think someone else has
        accessed it.
      </p>

      <h2>3. Plans and billing</h2>
      <ul>
        <li>The free plan includes {FREE_CHECKIN_LIMIT} check-ins. Pro removes that limit and adds reports.</li>
        <li>
          Pro is sold by our reseller Lemon Squeezy, which is the merchant of record and handles payment, sales tax
          and invoices. Its buyer terms also apply to your purchase.
        </li>
        <li>
          Pro renews automatically at the end of each monthly or yearly period until you cancel. You can cancel at
          any time from the billing link in the app. You keep Pro until the end of the period you&apos;ve paid for.
        </li>
        <li>
          We&apos;ll tell you at least 30 days before any price change affecting your subscription. It applies from
          your next renewal.
        </li>
        <li>
          Refunds are covered by our <Link href="/tracker/refunds">Refund Policy</Link>.
        </li>
      </ul>

      <h2>4. Your content</h2>
      <p>
        Your photos and data belong to you. You give us permission to store, process and display them only to
        provide {APP_NAME} to you. Only upload photos of yourself, or of someone who has given you permission.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Don&apos;t misuse the service. For example, don&apos;t try to access other people&apos;s data, interfere
        with how the service runs, upload unlawful content, or resell the service.
      </p>

      <h2>6. Availability and changes</h2>
      <p>
        We work to keep {APP_NAME} available and your data safe, but we can&apos;t promise uninterrupted service. We
        may change or improve features. If we ever shut {APP_NAME} down, we&apos;ll give at least 30 days&apos;
        notice so you can save your reports, and refund any unused prepaid period.
      </p>

      <h2>7. Ending your account</h2>
      <p>
        You can delete your account at any time from the Account page. We may suspend or close accounts that break
        these terms. Where we can, we&apos;ll tell you first.
      </p>

      <h2>8. Disclaimers and liability</h2>
      <p>
        To the extent the law allows, {APP_NAME} is provided &quot;as is&quot;, without warranties of any kind, and
        we are not liable for indirect, incidental or consequential damages. Our total liability for any claim
        relating to the service is limited to the amount you paid us in the 12 months before the claim. Some places
        don&apos;t allow these limits, so they may not apply to you. Nothing here limits rights you have under
        consumer protection law.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        If we make material changes, we&apos;ll notify you by email or in the app before they take effect. Continuing
        to use {APP_NAME} after that means you accept the updated terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        {companyName} — <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
    </LegalPage>
  );
}
