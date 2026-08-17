import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CarVisual } from "@/components/ui/CarVisual";
import { Badge } from "@/components/ui/Badge";
import { ReservePanel } from "@/components/sections/ReservePanel";
import { fleet } from "@/lib/fleet-data";
import { Users, Gauge, MapPin } from "lucide-react";

export function generateStaticParams() {
  return fleet.map((car) => ({ slug: car.slug }));
}

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = fleet.find((c) => c.slug === params.slug);
  if (!car) notFound();

  const specs = [
    { icon: Users, label: `${car.seats} seats` },
    { icon: Gauge, label: car.transmission },
    { icon: MapPin, label: `${car.location} · ${car.pickupMinutes} min pickup` },
  ];

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Badge tone="accent">{car.carClass}</Badge>
                {!car.available && <Badge tone="muted">Back tomorrow</Badge>}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                {car.name}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                {car.description}
              </p>

              <div className="mt-8">
                <CarVisual className="aspect-[16/9]" />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface">
                      <spec.icon className="h-4 w-4 text-muted" />
                    </div>
                    <span className="text-sm text-text">{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <ReservePanel car={car} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
