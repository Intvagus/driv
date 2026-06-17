import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CONDITIONS, PROCEDURES } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProcedureCard } from "@/components/sections/ProcedureCard";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const condition = CONDITIONS.find((c) => c.slug === params.slug);
  if (!condition) return {};
  return { title: condition.title, description: condition.description };
}

export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export default function ConditionDetailPage({ params }: Props) {
  const condition = CONDITIONS.find((c) => c.slug === params.slug);
  if (!condition) notFound();

  const surgicalProcedures = PROCEDURES.filter((p) => p.category === "surgical").slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom">
            <div className="text-5xl mb-6">{condition.icon}</div>
            <h1 className="heading-1 text-white mb-4">{condition.title}</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">{condition.description}</p>
            <Button asChild variant="primary" size="lg">
              <Link href="/consultation">Get Free Assessment</Link>
            </Button>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <h2 className="heading-2 text-brand-dark mb-6">About {condition.title}</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                {condition.title} is one of the most common forms of hair loss affecting
                patients we treat at our clinic. Understanding the underlying causes,
                progression patterns, and available treatment options is essential for
                achieving the best possible outcomes.
              </p>
              <p>
                Our approach begins with a thorough trichoscopic analysis and a detailed
                medical history review. This allows Dr. Rana Irfan to design a personalized
                treatment plan that addresses both the immediate cosmetic concern and the
                long-term health of your hair follicles.
              </p>
              <h3>Treatment Options</h3>
              <p>
                Depending on the severity and pattern of your hair loss, treatment options
                may include surgical hair transplantation (FUE, DHI, or Sapphire FUE),
                non-surgical interventions such as PRP therapy, or a combination approach
                for optimal results.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="heading-2 text-brand-dark mb-8 text-center">
              Recommended Procedures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {surgicalProcedures.map((proc, i) => (
                <ProcedureCard key={proc.slug} {...proc} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-brand-dark">
          <div className="container-custom text-center">
            <h2 className="heading-2 text-white mb-4">
              Start Your Assessment
            </h2>
            <p className="text-white/70 mb-8">
              Get a free, personalized hair loss assessment and treatment plan.
            </p>
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
