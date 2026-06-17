import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { PROCEDURES } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, Calendar, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) return {};
  return {
    title: procedure.title,
    description: procedure.description,
  };
}

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default function ProcedureDetailPage({ params }: Props) {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) notFound();

  const included = [
    "Pre-operative consultation and hair analysis",
    "Local anaesthesia and sedation",
    "The full transplant procedure",
    "Post-operative dressing and medications",
    "Follow-up appointments (1 week, 1 month, 6 months)",
    "24/7 post-op support line",
  ];

  const processSteps = [
    { step: 1, title: "Free Consultation", desc: "Hair analysis and graft count assessment using advanced trichoscopy." },
    { step: 2, title: "Pre-Op Preparation", desc: "Blood tests, medication review, and personalized pre-op care plan." },
    { step: 3, title: "Extraction Phase", desc: "Individual follicle units harvested from the donor area under local anaesthesia." },
    { step: 4, title: "Implantation Phase", desc: "Grafts meticulously placed at the correct angle, depth, and direction." },
    { step: 5, title: "Recovery & Follow-up", desc: "Structured aftercare with scheduled follow-ups to monitor progress." },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant={procedure.category === "surgical" ? "gold" : "secondary"}>
                {procedure.category === "surgical" ? "Surgical" : "Non-Surgical"}
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                {procedure.technique}
              </Badge>
            </div>
            <h1 className="heading-1 text-white mb-4">{procedure.title}</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">{procedure.description}</p>
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { label: "Duration", value: procedure.duration, icon: Clock },
                { label: "Downtime", value: `${procedure.downtime} days`, icon: Calendar },
                { label: "Grafts", value: procedure.graftRange, icon: CheckCircle },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-white/80">
                  <Icon className="h-5 w-5 text-brand-gold" />
                  <span className="font-medium">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/book">Book This Procedure</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/consultation">Free Assessment</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="heading-2 text-brand-dark mb-10 text-center">
              The Procedure Process
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {processSteps.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-dark font-bold text-lg flex items-center justify-center mx-auto mb-3 font-serif">
                    {step}
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-1 text-sm">{title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Included */}
        <section className="section-padding">
          <div className="container-custom max-w-3xl mx-auto">
            <h2 className="heading-2 text-brand-dark mb-8 text-center">
              What&apos;s Included
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="py-8 bg-amber-50 border-y border-amber-200">
          <div className="container-custom max-w-3xl mx-auto">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Medical Disclaimer:</strong> Hair transplant results vary between individuals
                depending on hair type, extent of loss, donor density, and post-op care. The information
                on this page is for educational purposes only and does not constitute medical advice.
                Please consult with Dr. Rana Irfan for a personalised assessment.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-brand-dark">
          <div className="container-custom text-center">
            <h2 className="heading-2 text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-8">Book a free consultation to discuss your {procedure.title} options.</p>
            <Button asChild variant="primary" size="xl">
              <Link href="/book" className="flex items-center gap-2">
                Book Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
