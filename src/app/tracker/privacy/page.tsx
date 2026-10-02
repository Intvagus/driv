import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/tracker/LegalPage";
import { APP_NAME, LEGAL } from "@/lib/tracker/config";

// Plain-language template — have it reviewed by a lawyer before launch.

export const metadata: Metadata = { title: { absolute: `Privacy Policy — ${APP_NAME}` } };

export default function PrivacyPage() {
  const { companyName, contactEmail } = LEGAL;
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {APP_NAME} (&quot;we&quot;, &quot;us&quot;) is operated by {companyName}. This policy explains what we collect when
        you use {APP_NAME}, why, and the choices you have. The short version: your photos and health information are
        used only to run the app for you. We don&apos;t sell them, don&apos;t use them for advertising, and don&apos;t
        use them to train AI models.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your email address and a securely hashed password (or a sign-in link sent
          to your email).
        </li>
        <li>
          <strong>Photos you take:</strong> pictures of your scalp and hairline from your check-ins.
        </li>
        <li>
          <strong>Health information you enter:</strong> check-in dates, shedding ratings, notes, the treatments you
          use, their doses and the days you mark them as taken.
        </li>
        <li>
          <strong>Subscription status:</strong> whether you have Pro and when it renews. Payments are processed by our
          reseller, Lemon Squeezy, which acts as the merchant of record. We never see or store your card number.
        </li>
        <li>
          <strong>Technical data:</strong> standard server logs (such as IP address, browser type and time of
          request) kept for security and troubleshooting, and cookies that keep you signed in. We don&apos;t use
          advertising or cross-site tracking cookies.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To provide the app: store your check-ins, show comparisons and build your reports.</li>
        <li>To email you check-in reminders, which you can turn off at any time.</li>
        <li>To manage your subscription and respond to support requests.</li>
        <li>To keep the service secure and working, and to meet legal obligations.</li>
      </ul>

      <h2>Consumer health data</h2>
      <p>
        Your photos, treatments and check-in information are &quot;consumer health data&quot; under laws such as
        Washington&apos;s My Health My Data Act and Nevada&apos;s SB 370. We collect it only to provide the service
        you asked for and with your consent, which you give by entering it. We do not sell it. We share it only with
        the service providers listed below, who process it on our behalf. You can see all of it in the app, and
        delete it at any time.
      </p>

      <h2>Who we share it with</h2>
      <p>We use a small number of service providers, bound by contract to protect your data:</p>
      <ul>
        <li>
          <strong>Supabase</strong>: database, sign-in and encrypted photo storage.
        </li>
        <li>
          <strong>Vercel</strong>: website hosting.
        </li>
        <li>
          <strong>Resend</strong>: sending reminder and sign-in emails (receives your email address only).
        </li>
        <li>
          <strong>Lemon Squeezy</strong>: payments, tax and invoices for Pro.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law, or to a successor if {APP_NAME} is sold or merged, in
        which case this policy will continue to apply to your data.
      </p>

      <h2>How we protect it</h2>
      <p>
        Data is encrypted in transit and at rest. Photos are kept in private storage that only your account can
        access, and are shown to you through links that expire after one hour. Our providers may store data in the
        United States or other countries.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your data while your account is open. When you delete your account, your photos and data are removed
        from our live systems immediately; copies in encrypted backups are erased as those backups expire.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>
          <strong>Access and copy:</strong> everything you&apos;ve entered is visible in the app, and the Report page
          lets you save your photos and history as a PDF.
        </li>
        <li>
          <strong>Correct:</strong> delete individual check-ins or treatments in the app, or email us to correct
          anything else.
        </li>
        <li>
          <strong>Delete:</strong> delete your whole account from the{" "}
          <Link href="/tracker/app/account">Account page</Link>, or email us.
        </li>
        <li>
          <strong>Emails:</strong> turn reminders off in the app or with the link in any email.
        </li>
      </ul>
      <p>
        Residents of California and other US states with privacy laws may also request details of the personal
        information we hold and how it is used. We do not sell or &quot;share&quot; personal information for
        cross-context behavioral advertising, and we won&apos;t treat you differently for exercising your rights.
        Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with any request; we may need to verify your
        identity first.
      </p>

      <h2>Children</h2>
      <p>{APP_NAME} is for adults 18 and over. We don&apos;t knowingly collect data from anyone under 18.</p>

      <h2>Changes</h2>
      <p>
        If we make material changes we&apos;ll email you or show a notice in the app before they take effect. The date
        at the top shows the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        {companyName} — <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
    </LegalPage>
  );
}
