import { SearchWidget } from "./SearchWidget";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-content px-6 pb-14 pt-14 sm:pt-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Reserve in 60 seconds.
            <br />
            Drive in <span className="text-accent">10 minutes.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">
            No counter, no waiting, no paperwork. Book a car in your
            neighborhood and pick it up on your own time — today, if you need
            it.
          </p>
        </div>

        <div className="mt-9">
          <SearchWidget />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-accent text-accent" />
            4.9 average from 12,000+ rentals
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span>3 pickup points, open now</span>
        </div>
      </div>
    </section>
  );
}
