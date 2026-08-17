import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { LinkButton } from "@/components/ui/Button";
import { ShieldCheck, Ban, Fuel } from "lucide-react";

const details = [
  {
    icon: ShieldCheck,
    title: "Insurance included",
    body: "Every rental includes basic coverage. Add protection at checkout if you want more.",
  },
  {
    icon: Ban,
    title: "Cancel free, up to an hour out",
    body: "Plans change. Cancel from your confirmation email with no fee up until an hour before pickup.",
  },
  {
    icon: Fuel,
    title: "Full tank, every time",
    body: "Return it however you found it. We handle detailing and refueling between rentals.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              How it works
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
              Built for the rental you need this afternoon, not next month.
            </p>
          </div>
        </div>

        <HowItWorksSection />

        <div className="border-t border-border">
          <div className="mx-auto max-w-content px-6 py-16 sm:py-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {details.map((item) => (
                <div key={item.title}>
                  <item.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <LinkButton href="/fleet">Reserve a car</LinkButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
