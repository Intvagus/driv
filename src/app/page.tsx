import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { ProcedureCard } from "@/components/sections/ProcedureCard";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { BeforeAfterCard } from "@/components/sections/BeforeAfterCard";
import { BlogCard } from "@/components/sections/BlogCard";
import { QuickConsultForm } from "@/components/sections/QuickConsultForm";
import { PROCEDURES } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PhoneCall } from "lucide-react";

const testimonials = [
  {
    patientName: "Ahmed R.",
    rating: 5,
    review:
      "I traveled from Dubai specifically to have my procedure with Dr. Rana Irfan. The results after 14 months are beyond what I expected. My hairline looks completely natural.",
    procedure: "FUE Hair Transplant",
  },
  {
    patientName: "Farhan K.",
    rating: 5,
    review:
      "The entire team was professional and caring. Dr. Rana explained every step clearly. Six months post-op and I'm already seeing incredible density growth.",
    procedure: "DHI Hair Transplant",
  },
  {
    patientName: "Bilal S.",
    rating: 5,
    review:
      "I was nervous about the procedure but the clinic made me feel at ease from day one. The Sapphire FUE technique gave me minimal downtime and amazing results.",
    procedure: "Sapphire FUE",
  },
];

const blogPosts = [
  {
    title: "FUE vs DHI Hair Transplant: Which Technique Is Right for You?",
    slug: "fue-vs-dhi-hair-transplant",
    excerpt:
      "Understanding the differences between FUE and DHI techniques can help you make an informed decision about your hair restoration journey.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-09-15",
    tags: ["FUE", "DHI", "Guide"],
  },
  {
    title: "What to Expect in the First Month After a Hair Transplant",
    slug: "first-month-after-hair-transplant",
    excerpt:
      "The post-operative phase can be confusing. Here's a week-by-week breakdown of what you'll experience and how to maximize your results.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-08-28",
    tags: ["Recovery", "Post-Op"],
  },
  {
    title: "PRP Therapy for Hair Loss: A Complete Guide",
    slug: "prp-therapy-hair-loss-guide",
    excerpt:
      "Platelet-Rich Plasma therapy is gaining popularity as both a standalone treatment and a complement to hair transplant surgery. Learn how it works.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-08-10",
    tags: ["PRP", "Non-Surgical"],
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Quick Consultation */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                  Free Online Assessment
                </span>
                <h2 className="heading-2 text-brand-dark mt-2 mb-4">
                  Start Your Hair Restoration Journey Today
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Not sure where to start? Get a free, no-obligation consultation
                  with our specialists. Share your details and we&apos;ll contact you
                  within 24 hours.
                </p>
                <ul className="space-y-2">
                  {[
                    "Free assessment, no obligation",
                    "Response within 24 hours",
                    "Personalized treatment plan",
                    "Transparent pricing",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <QuickConsultForm />
            </div>
          </div>
        </section>

        {/* Featured Procedures */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                Our Services
              </span>
              <h2 className="heading-2 text-brand-dark mt-2 mb-4">
                Hair Restoration Procedures
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Advanced surgical and non-surgical treatments tailored to your
                unique hair loss pattern and restoration goals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROCEDURES.map((proc, i) => (
                <ProcedureCard key={proc.slug} {...proc} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="secondary">
                <Link href="/procedures" className="flex items-center gap-2">
                  View All Procedures <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <WhyUsSection />

        {/* Before / After Highlight */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                Real Results
              </span>
              <h2 className="heading-2 text-brand-dark mt-2 mb-4">
                Patient Transformations
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Every result is unique — here are a few of our patients&apos; hair
                restoration journeys.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BeforeAfterCard
                technique="FUE"
                grafts={2800}
                monthsPostOp={12}
                description="Crown and hairline restoration"
                index={0}
              />
              <BeforeAfterCard
                technique="DHI"
                grafts={2200}
                monthsPostOp={10}
                description="Hairline lowering and density"
                index={1}
              />
              <BeforeAfterCard
                technique="Sapphire FUE"
                grafts={3000}
                monthsPostOp={14}
                description="Full scalp coverage"
                index={2}
              />
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="primary">
                <Link href="/results" className="flex items-center gap-2">
                  View Full Gallery <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                Patient Reviews
              </span>
              <h2 className="heading-2 text-brand-dark mt-2 mb-4">
                What Our Patients Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.patientName} {...t} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Blog */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                Knowledge Centre
              </span>
              <h2 className="heading-2 text-brand-dark mt-2 mb-4">
                Latest Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <BlogCard key={post.slug} {...post} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="secondary">
                <Link href="/blog" className="flex items-center gap-2">
                  Read All Articles <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Free Consultation CTA Banner */}
        <section className="section-padding bg-gradient-to-r from-brand-dark to-brand-dark-light">
          <div className="container-custom text-center">
            <h2 className="heading-2 text-white mb-4">
              Ready to Restore Your Confidence?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Book your free, no-obligation consultation today. Our team will
              design a personalized hair restoration plan just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="primary">
                <Link href="/book" className="flex items-center gap-2">
                  Book Free Consultation <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact" className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Call Us Now
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
