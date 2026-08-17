import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Built for the rental you need today
          </h1>
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              DRIV started from a simple complaint: renting a car for a same-day
              trip took longer than the trip itself. Counters, forms, and a
              30-minute wait for a car you&apos;d be driving for an afternoon.
            </p>
            <p>
              So we rebuilt the rental around the person who needs a car in the
              next hour, not next month — live inventory at pickup points
              around the city, a reservation flow that takes under a minute,
              and a car that&apos;s already detailed and fueled when you arrive.
            </p>
            <p>
              No counter. No paperwork. Just the car.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
