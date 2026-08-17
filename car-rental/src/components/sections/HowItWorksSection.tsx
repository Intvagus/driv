import { MapPin, Smartphone, KeyRound } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Pick a location and time",
    body: "Choose the closest pickup point and the dates you need. Live availability, no phone calls.",
  },
  {
    icon: Smartphone,
    title: "Confirm on your phone",
    body: "Reserve and pay in the same flow. Your confirmation doubles as your key.",
  },
  {
    icon: KeyRound,
    title: "Walk up and drive",
    body: "Skip the counter entirely. Unlock the car with your phone and go.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-content px-6 py-16 sm:py-24">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Three steps, no counter
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
                  <step.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="font-display text-sm text-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
