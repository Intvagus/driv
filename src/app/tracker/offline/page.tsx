import { WifiOff } from "lucide-react";
import { RootlineLogo } from "@/components/tracker/Logo";
import { ReloadButton } from "@/components/tracker/ReloadButton";

export const metadata = { robots: { index: false, follow: false } };

// Pre-cached by the service worker and shown when a page can't load.
export default function OfflinePage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <RootlineLogo />
        </div>
        <div className="rounded-2xl border border-rl-border bg-white p-6 shadow-sm">
          <WifiOff className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
          <h1 className="mt-3 text-xl font-semibold">You&apos;re offline</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your photos are stored securely online, so Rootline needs a connection. Check your signal and try again.
          </p>
          <ReloadButton />
        </div>
      </div>
    </main>
  );
}
