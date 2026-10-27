import Link from "next/link";
import { MailX } from "lucide-react";
import { RootlineLogo } from "@/components/tracker/Logo";

export const metadata = { robots: { index: false, follow: false } };

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { u?: string; t?: string; done?: string };
}) {
  const { u, t, done } = searchParams;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <Link href="/tracker" className="mb-8 flex justify-center">
          <RootlineLogo />
        </Link>
        <div className="rounded-2xl border border-rl-border bg-white p-6 shadow-sm">
          <MailX className="mx-auto h-10 w-10 text-rl-primary" aria-hidden />
          {done ? (
            <>
              <h1 className="mt-3 text-xl font-semibold">You&apos;re unsubscribed</h1>
              <p className="mt-2 text-sm text-slate-600">
                You won&apos;t get check-in reminders anymore. You can turn them back on from your dashboard any time.
              </p>
            </>
          ) : u && t ? (
            <>
              <h1 className="mt-3 text-xl font-semibold">Stop check-in reminders?</h1>
              <p className="mt-2 text-sm text-slate-600">
                We only email when your monthly check-in is due — at most twice a month.
              </p>
              <form method="post" action="/api/tracker/unsubscribe" className="mt-5">
                <input type="hidden" name="u" value={u} />
                <input type="hidden" name="t" value={t} />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-rl-primary py-2.5 font-semibold text-white hover:bg-rl-primary-dark"
                >
                  Unsubscribe
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="mt-3 text-xl font-semibold">Link not valid</h1>
              <p className="mt-2 text-sm text-slate-600">
                Use the unsubscribe link from one of our emails, or turn reminders off from your dashboard.
              </p>
            </>
          )}
          <Link href="/tracker/app" className="mt-4 inline-block text-sm text-rl-primary hover:underline">
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
