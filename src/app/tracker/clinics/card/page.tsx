import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { PrintButton } from "@/components/tracker/PrintButton";
import { APP_NAME, FREE_CHECKIN_LIMIT } from "@/lib/tracker/config";
import { refFromName } from "@/lib/tracker/referral";
import { trackerUrl } from "@/lib/tracker/urls";

export const metadata: Metadata = {
  title: { absolute: `Clinic QR Cards — ${APP_NAME}` },
  robots: { index: false, follow: false },
};

// 10 cards of 3.5 x 2 in on US Letter (2 columns x 5 rows), the standard
// perforated business-card sheet layout: 0.75 in side and 0.5 in top margins.
const CARDS = Array.from({ length: 10 });

// The print rules hide the rest of the page and pin the sheet to the paper edge.
const PRINT_CSS = `
@page { size: letter; margin: 0; }
@media print {
  body * { visibility: hidden; }
  .rl-sheet, .rl-sheet * { visibility: visible; }
  .rl-sheet { position: absolute; left: 0; top: 0; box-shadow: none !important; transform: none !important; }
}`;

export default async function ClinicCardPage({
  searchParams,
}: {
  searchParams: { name?: string; line?: string };
}) {
  const name = (searchParams.name ?? "").trim().slice(0, 60);
  const line = (searchParams.line ?? "").trim().slice(0, 70);
  const code = refFromName(name);

  if (!code) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Enter your clinic name first</h1>
        <Link href="/tracker/clinics#card" className="mt-4 inline-block text-rl-primary hover:underline">
          Back to the card maker
        </Link>
      </main>
    );
  }

  const url = trackerUrl(`/tracker/r/${code}`);
  // SVG markup produced by the qrcode library from our own URL (no user HTML).
  const qrSvg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0F1B2D", light: "#FFFFFF" } });

  return (
    <main className="px-4 py-8">
      <style>{PRINT_CSS}</style>
      <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-rl-border bg-white p-5 print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="text-sm">
            <h1 className="text-lg font-semibold">Cards for {name}</h1>
            <p className="mt-1 text-slate-600">
              Your clinic link: <span className="font-mono text-rl-ink">{url}</span>
            </p>
            <p className="mt-1 text-slate-500">
              Print at 100% scale (turn off &quot;fit to page&quot;) on US Letter. Scan one card with your phone
              before printing a batch.
            </p>
          </div>
          <PrintButton />
        </div>
        <Link href="/tracker/clinics#card" className="mt-3 inline-block text-sm text-rl-primary hover:underline">
          ← Change details
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div
          className="rl-sheet relative mx-auto bg-white shadow-lg"
          style={{ width: "8.5in", height: "11in", padding: "0.5in 0.75in", boxSizing: "border-box" }}
        >
          <div className="grid" style={{ gridTemplateColumns: "3.5in 3.5in", gridAutoRows: "2in" }}>
            {CARDS.map((_, i) => (
              <div
                key={i}
                className="flex overflow-hidden text-rl-ink"
                style={{ width: "3.5in", height: "2in", padding: "0.16in 0.18in", outline: "0.5pt dashed #CBD5E1", boxSizing: "border-box" }}
              >
                <div className="flex min-w-0 flex-1 flex-col pr-[0.12in]">
                  <p className="line-clamp-2 font-semibold uppercase leading-tight text-rl-primary" style={{ fontSize: "6.5pt", letterSpacing: "0.04em" }}>
                    Recommended by {name}
                  </p>
                  <p className="mt-[0.05in] font-bold leading-tight" style={{ fontSize: "11.5pt" }}>
                    Track your hair growth, month by month
                  </p>
                  <p className="mt-[0.05in] leading-snug text-slate-600" style={{ fontSize: "7pt" }}>
                    Same 4 photo angles every month, side-by-side comparisons, and a report for your follow-ups.
                  </p>
                  {line && (
                    <p className="mt-[0.04in] font-medium leading-snug" style={{ fontSize: "7pt" }}>
                      {line}
                    </p>
                  )}
                  <p className="mt-auto flex items-center gap-[0.05in] font-semibold" style={{ fontSize: "8pt" }}>
                    <img src="/tracker/icons/icon-192.png" alt="" style={{ width: "0.18in", height: "0.18in", borderRadius: "0.04in" }} />
                    {APP_NAME} · free for {FREE_CHECKIN_LIMIT} check-ins
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center justify-center">
                  <div
                    className="[&>svg]:h-full [&>svg]:w-full"
                    style={{ width: "1.05in", height: "1.05in" }}
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <p className="mt-[0.05in] font-semibold" style={{ fontSize: "7pt" }}>
                    Scan to start
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
