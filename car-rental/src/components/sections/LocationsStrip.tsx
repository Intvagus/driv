import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locations } from "@/lib/fleet-data";

export function LocationsStrip() {
  return (
    <section>
      <div className="mx-auto max-w-content px-6 py-16 sm:py-24">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Pickup points across the city
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
          Every location keeps a live fleet on-site — no transfers, no
          waiting on a shuttle.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {locations.map((loc) => (
            <Link
              key={loc.name}
              href={`/fleet?location=${encodeURIComponent(loc.name)}`}
              className="focus-ring group rounded-card border border-border bg-surface p-6 transition-colors duration-150 hover:border-accent/50"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {loc.name}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-muted transition-colors duration-150 group-hover:text-accent" />
              </div>
              <p className="mt-2 text-sm text-muted">{loc.address}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                <span>{loc.hours}</span>
                <span>{loc.cars} cars on-site</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
