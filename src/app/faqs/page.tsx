import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Am I a good candidate for a hair transplant?",
    a: "Good candidates typically have stable hair loss, sufficient donor hair density at the back/sides of the scalp, realistic expectations, and are generally in good health. The best way to determine candidacy is a free consultation with Dr. Rana Irfan.",
  },
  {
    q: "What is the difference between FUE, DHI, and Sapphire FUE?",
    a: "FUE (Follicular Unit Extraction) involves extracting individual follicles and creating recipient sites separately. DHI (Direct Hair Implantation) uses a Choi pen to implant directly without pre-made incisions. Sapphire FUE uses sapphire blades instead of steel for creating channels, enabling higher density and faster healing.",
  },
  {
    q: "How long does a hair transplant procedure take?",
    a: "Depending on the number of grafts, procedures typically take between 4–8 hours in a single session. Larger sessions may require two days.",
  },
  {
    q: "Is the procedure painful?",
    a: "Local anaesthesia is administered before the procedure, ensuring you feel no pain during the extraction or implantation phases. Mild soreness for 2–3 days post-op is normal and managed with prescribed medication.",
  },
  {
    q: "When will I see results?",
    a: "Transplanted hair typically sheds within 2–4 weeks (shock loss) — this is completely normal. New growth begins around 3–4 months. Significant results are visible at 6–9 months, with full results at 12–18 months.",
  },
  {
    q: "How many grafts will I need?",
    a: "The number of grafts depends on your Norwood stage and desired density. Typically: Stage III–IV: 1,500–2,500 grafts; Stage V–VI: 2,500–3,500 grafts; Stage VII: 3,500–4,000+ grafts. Dr. Rana Irfan will provide an exact count after trichoscopic analysis.",
  },
  {
    q: "Is the result permanent?",
    a: "Yes. Transplanted follicles are taken from the DHT-resistant donor zone at the back of the scalp, making them genetically programmed to remain for life.",
  },
  {
    q: "What is the downtime after a hair transplant?",
    a: "Most patients return to desk work within 3–5 days. Strenuous activity should be avoided for 2 weeks. Redness and minor scabbing resolve within 7–14 days.",
  },
  {
    q: "What payment options are available?",
    a: "We accept bank transfer, JazzCash, and EasyPaisa. A deposit is required to confirm your booking, with the balance due on the day of the procedure. Please contact us for current pricing.",
  },
  {
    q: "Do you treat international patients?",
    a: "Yes, we regularly treat patients from the UAE, UK, Saudi Arabia, and other countries. We can assist with travel planning and accommodation recommendations.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <h1 className="heading-1 text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Everything you need to know about hair transplant procedures at our clinic.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center bg-brand-dark rounded-2xl p-8">
              <h2 className="font-serif text-xl font-bold text-white mb-3">
                Still Have Questions?
              </h2>
              <p className="text-white/70 mb-6">
                Book a free consultation and our team will answer every question.
              </p>
              <Button asChild variant="primary">
                <Link href="/book" className="flex items-center gap-2">
                  Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
