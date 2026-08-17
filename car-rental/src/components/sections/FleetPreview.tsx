import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fleet } from "@/lib/fleet-data";
import { CarCard } from "@/components/ui/CarCard";

export function FleetPreview() {
  const cars = fleet.slice(0, 4);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-content px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready when you are
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Every car detailed and fueled before it&apos;s handed off.
            </p>
          </div>
          <Link
            href="/fleet"
            className="focus-ring hidden shrink-0 items-center gap-1.5 text-sm font-medium text-text transition-colors duration-150 hover:text-accent sm:flex"
          >
            View full fleet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>

        <Link
          href="/fleet"
          className="focus-ring mt-8 flex items-center gap-1.5 text-sm font-medium text-text sm:hidden"
        >
          View full fleet <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
