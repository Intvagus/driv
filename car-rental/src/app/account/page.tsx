import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

const bookings = [
  {
    reference: "DRV-7QX2K1",
    car: "Model 3",
    location: "Downtown",
    dates: "Aug 12 – Aug 14",
    status: "Completed",
  },
  {
    reference: "DRV-3M9PLD",
    car: "CX-5",
    location: "Airport",
    dates: "Jul 28 – Jul 29",
    status: "Completed",
  },
];

export default function AccountPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Your bookings
            </h1>
            <p className="mt-2 text-sm text-muted">
              Manage upcoming reservations and view past trips.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-12">
          <div className="divide-y divide-border rounded-card border border-border bg-surface">
            {bookings.map((b) => (
              <div
                key={b.reference}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-semibold">
                      {b.car}
                    </h3>
                    <Badge tone="muted">{b.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {b.location} &middot; {b.dates}
                  </p>
                </div>
                <span className="text-xs text-muted">{b.reference}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
