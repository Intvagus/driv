import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { locations } from "@/lib/fleet-data";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";

export default function LocationsPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Pickup locations
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
              Three points across the city, each with a live fleet on-site.
              No shuttle, no transfer desk.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-12">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc.name}
                className="rounded-card border border-border bg-surface p-6"
              >
                <h2 className="font-display text-xl font-semibold">
                  {loc.name}
                </h2>
                <div className="mt-4 space-y-2.5 text-sm text-muted">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {loc.address}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {loc.hours}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <span className="text-sm text-text">
                    {loc.cars} cars on-site today
                  </span>
                  <Link
                    href={`/fleet?location=${encodeURIComponent(loc.name)}`}
                    className="focus-ring flex items-center gap-1 text-sm font-medium text-accent"
                  >
                    View cars <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
