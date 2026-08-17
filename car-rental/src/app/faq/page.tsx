import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const faqs = [
  {
    q: "How fast can I actually get a car?",
    a: "If a car shows as available at your pickup point, you can reserve and be driving within about 10 minutes — there's no counter to wait at.",
  },
  {
    q: "Do I need to talk to anyone to pick up the car?",
    a: "No. Your confirmation email unlocks the car directly. Support is available by chat or phone if anything comes up.",
  },
  {
    q: "What if I need to change my dates?",
    a: "Edit your reservation from your account page any time before pickup. Cancellations are free up to an hour before your pickup time.",
  },
  {
    q: "Is insurance included?",
    a: "Yes — every rental includes basic coverage by default. You can add additional protection at checkout.",
  },
  {
    q: "What happens if I return the car late?",
    a: "You're charged for the extra time at the same daily rate. If you know you'll be late, extend from your account page to avoid any friction.",
  },
  {
    q: "Which documents do I need at pickup?",
    a: "A valid driver's license and the card used to book. Both are verified once, during checkout — not again at the car.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Frequently asked
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-12">
          <div className="mx-auto max-w-2xl divide-y divide-border border-t border-border">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium sm:text-base">
                  {item.q}
                  <span className="shrink-0 text-muted transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
