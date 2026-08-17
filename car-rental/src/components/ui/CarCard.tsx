import Link from "next/link";
import { Car } from "@/types/car";
import { CarVisual } from "./CarVisual";
import { Badge } from "./Badge";
import { ArrowUpRight } from "lucide-react";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/fleet/${car.slug}`}
      className="focus-ring group block rounded-card border border-border bg-surface p-3 transition-colors duration-150 hover:border-accent/50"
    >
      <div className="relative">
        <CarVisual />
        {!car.available && (
          <div className="absolute left-3 top-3">
            <Badge tone="muted">Back tomorrow</Badge>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">
            {car.name}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {car.carClass} &middot; {car.location} &middot; {car.pickupMinutes} min pickup
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors duration-150 group-hover:text-accent" />
      </div>
      <div className="mt-3 flex items-baseline gap-1 px-1">
        <span className="font-display text-xl font-bold">${car.pricePerDay}</span>
        <span className="text-sm text-muted">/ day</span>
      </div>
    </Link>
  );
}
