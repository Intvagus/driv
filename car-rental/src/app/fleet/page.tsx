import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CarCard } from "@/components/ui/CarCard";
import { fleet, carClasses } from "@/lib/fleet-data";
import { cn } from "@/lib/utils";

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FleetPage({
  searchParams,
}: {
  searchParams: { class?: string; location?: string; start?: string; end?: string };
}) {
  const activeClass = searchParams.class ?? "All";
  const activeLocation = searchParams.location;

  const cars = fleet.filter((car) => {
    const classMatch = activeClass === "All" || car.carClass === activeClass;
    const locationMatch = !activeLocation || car.location === activeLocation;
    return classMatch && locationMatch;
  });

  const start = formatDate(searchParams.start);
  const end = formatDate(searchParams.end);

  function classHref(cls: string) {
    const params = new URLSearchParams();
    if (cls !== "All") params.set("class", cls);
    if (activeLocation) params.set("location", activeLocation);
    if (searchParams.start) params.set("start", searchParams.start);
    if (searchParams.end) params.set("end", searchParams.end);
    const qs = params.toString();
    return qs ? `/fleet?${qs}` : "/fleet";
  }

  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {activeLocation ? `Cars in ${activeLocation}` : "The fleet"}
            </h1>
            {(start || end || activeLocation) && (
              <p className="mt-2 text-sm text-muted">
                {activeLocation ? `${activeLocation} · ` : ""}
                {start && end ? `${start} – ${end}` : "Pick your dates on any car"}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {carClasses.map((cls) => (
                <Link
                  key={cls}
                  href={classHref(cls)}
                  className={cn(
                    "focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150",
                    activeClass === cls
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted hover:text-text"
                  )}
                >
                  {cls}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-12">
          {cars.length === 0 ? (
            <p className="text-sm text-muted">
              No cars match those filters right now. Try a different class or
              location.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car.slug} car={car} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
