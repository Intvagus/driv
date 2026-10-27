import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { LangToggle } from "@/components/LangToggle";
import { LangProvider } from "@/lib/i18n";
import { ADSENSE_CLIENT, SITE_NAME, SITE_URL } from "@/lib/site";

const urdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-urdu", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Electricity Bill Calculator & 200-Unit Tracker (Pakistan)`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free electricity bill calculator for all Pakistani companies (LESCO, IESCO, MEPCO, K-Electric and more), plus a meter-reading tracker that warns you before you cross 200 units.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_PK" },
};

export const viewport: Viewport = { themeColor: "#0E7A4F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urdu.variable}>
      <body className="min-h-screen bg-page text-ink antialiased">
        {ADSENSE_CLIENT && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        <LangProvider>
          <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <img src="/icon.svg" alt="" width={28} height={28} />
                {SITE_NAME}
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link href="/calculator/" className="hidden text-slate-600 hover:text-ink sm:inline">Calculator</Link>
                <Link href="/200-units-rule/" className="hidden text-slate-600 hover:text-ink sm:inline">200-unit rule</Link>
                <LangToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
          <footer className="border-t border-line bg-white px-4 py-8 text-sm text-slate-600">
            <div className="mx-auto max-w-3xl space-y-3">
              <nav className="flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/calculator/" className="hover:underline">Bill calculator</Link>
                <Link href="/companies/" className="hover:underline">All companies</Link>
                <Link href="/200-units-rule/" className="hover:underline">200-unit rule</Link>
                <Link href="/tariff/" className="hover:underline">Rates used</Link>
                <Link href="/about/" className="hover:underline">About</Link>
                <Link href="/privacy/" className="hover:underline">Privacy</Link>
              </nav>
              <p className="text-xs text-slate-500">
                {SITE_NAME} is an independent tool and is not affiliated with NEPRA, PITC or any electricity company. Figures are
                estimates; your official bill is final.
              </p>
            </div>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
