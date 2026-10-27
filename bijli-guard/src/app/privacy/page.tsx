import type { Metadata } from "next";
import { ADSENSE_CLIENT, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy/" } };

export default function Privacy() {
  return (
    <div className="prose-lite">
      <h1 className="text-2xl font-bold">Privacy policy</h1>
      <p>Last updated: 27 October 2026.</p>
      <h2>Your readings stay on your phone</h2>
      <p>
        The meter readings and settings you enter are saved only in your browser&apos;s local storage on your device. {SITE_NAME}{" "}
        has no accounts and does not send your readings to any server. Clearing your browser data or using &quot;Reset
        everything&quot; deletes them.
      </p>
      <h2>Advertising and cookies</h2>
      <p>
        {ADSENSE_CLIENT ? "This site shows" : "This site may show"} ads from Google AdSense. Google and its partners use cookies to
        serve ads based on your visits to this and other websites. You can turn off personalised advertising in{" "}
        <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ads Settings</a>. Learn more about{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses data from sites that use its services</a>.
      </p>
      <h2>Hosting logs</h2>
      <p>Our hosting provider may keep standard server logs (such as IP address and pages requested) for security and reliability.</p>
      <h2>Contact</h2>
      <p>Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </div>
  );
}
