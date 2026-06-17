import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CONDITIONS } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
              Conditions We Treat
            </span>
            <h1 className="heading-1 text-white mt-2 mb-4">Hair Loss Conditions</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Understanding your specific condition is the first step toward effective treatment.
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONDITIONS.map((condition) => (
                <Link
                  key={condition.slug}
                  href={`/conditions/${condition.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-gold/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{condition.icon}</div>
                  <h2 className="font-serif font-bold text-brand-dark text-xl mb-2 group-hover:text-brand-gold transition-colors">
                    {condition.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {condition.description}
                  </p>
                  <div className="flex items-center gap-1 text-brand-gold text-sm font-semibold">
                    Learn More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
