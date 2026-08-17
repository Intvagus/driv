import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MessageCircle, Phone, Mail } from "lucide-react";

const channels = [
  {
    icon: MessageCircle,
    title: "Chat with us",
    body: "Fastest for anything mid-rental — pickup issues, extensions, roadside help.",
    action: "Start a chat",
  },
  {
    icon: Phone,
    title: "Call the city line",
    body: "(415) 555-0134 — staffed 24/7 for anything urgent.",
    action: "Call now",
  },
  {
    icon: Mail,
    title: "Email support",
    body: "help@driv.example — for receipts, disputes, and anything non-urgent.",
    action: "Send an email",
  },
];

export default function SupportPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Support
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
              Real help, not a ticket queue. Pick whichever&apos;s fastest for you.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {channels.map((c) => (
              <div
                key={c.title}
                className="flex flex-col rounded-card border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2">
                  <c.icon className="h-4 w-4 text-accent" />
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold">
                  {c.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {c.body}
                </p>
                <button className="focus-ring mt-5 text-left text-sm font-medium text-accent">
                  {c.action} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
