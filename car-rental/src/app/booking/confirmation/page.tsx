import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LinkButton } from "@/components/ui/Button";

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { car?: string; start?: string; end?: string; total?: string; location?: string };
}) {
  const reference = `DRV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-lg px-6 py-16 sm:py-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-7 w-7 text-accent" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">
            You&apos;re reserved.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Confirmation {reference} &middot; sent to your email
          </p>

          <div className="mt-8 space-y-4 rounded-card border border-border bg-surface p-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Car</span>
              <span className="font-medium">{searchParams.car ?? "Your car"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Pickup</span>
              <span className="font-medium">
                {searchParams.location ?? "—"} &middot; {formatDate(searchParams.start) ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Return</span>
              <span className="font-medium">{formatDate(searchParams.end) ?? "—"}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 font-semibold">
              <span>Total paid</span>
              <span>${searchParams.total ?? "—"}</span>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            Unlock the car with the link in your confirmation email — no
            counter stop needed. Need to change something?
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/account" variant="secondary" className="w-full sm:w-auto">
              View my bookings
            </LinkButton>
            <LinkButton href="/fleet" variant="ghost" className="w-full sm:w-auto">
              Reserve another car
            </LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
