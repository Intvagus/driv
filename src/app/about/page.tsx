import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Award, GraduationCap, Users, CheckCircle, ArrowRight } from "lucide-react";

const credentials = [
  "MBBS – [University, Year] (TODO: Verify)",
  "Fellowship in Hair Restoration Surgery – [Institution] (TODO: Verify)",
  "Member, Pakistan Medical and Dental Council (PMDC)",
  "Member, International Society of Hair Restoration Surgery (ISHRS) (TODO: Verify)",
  "Advanced FUE & DHI Training – [Institution] (TODO: Verify)",
];

const team = [
  { name: "Dr. Rana Irfan", role: "Lead Hair Transplant Surgeon", bio: "Specialist in FUE, DHI, and Sapphire FUE techniques." },
  { name: "Dr. [Team Member]", role: "Anesthesiologist", bio: "Ensures patient comfort and safety throughout every procedure. (TODO: Add team details)" },
  { name: "[Coordinator Name]", role: "Patient Care Coordinator", bio: "Your dedicated guide through every step of the process. (TODO: Add team details)" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                  About
                </span>
                <h1 className="heading-1 text-white mt-2 mb-4">Dr. Rana Irfan</h1>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  With [X]+ years of specialized experience in hair restoration surgery,
                  Dr. Rana Irfan has helped thousands of patients from across Pakistan and
                  internationally to regain their confidence through natural-looking,
                  permanent results. {/* TODO: Verify years of experience */}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["FUE Specialist", "DHI Certified", "PMDC Registered"].map((tag) => (
                    <Badge key={tag} variant="gold">{tag}</Badge>
                  ))}
                </div>
                <Button asChild variant="primary" size="lg">
                  <Link href="/book">Book a Consultation</Link>
                </Button>
              </div>
              {/* Photo placeholder */}
              <div className="aspect-[4/5] bg-gradient-to-br from-brand-dark-light to-[#0d2830] rounded-2xl flex items-center justify-center">
                <div className="text-center text-white/30">
                  <Users className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-sm">Dr. Rana Irfan Photo</p>
                  <p className="text-xs">(Upload via admin panel)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom max-w-3xl mx-auto">
            <h2 className="heading-2 text-brand-dark mb-8 text-center flex items-center justify-center gap-3">
              <GraduationCap className="h-8 w-8 text-brand-gold" />
              Credentials &amp; Qualifications
            </h2>
            <div className="space-y-3">
              {credentials.map((c) => (
                <div key={c} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <Award className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-2 text-brand-dark mb-10 text-center">
              Our Clinic Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map(({ name, role, bio }) => (
                <div key={name} className="text-center bg-white rounded-xl border border-gray-200 p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-dark to-brand-dark-light flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl font-serif">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-brand-dark text-lg mb-1">{name}</h3>
                  <p className="text-brand-gold text-sm font-medium mb-3">{role}</p>
                  <p className="text-gray-600 text-sm">{bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Trust */}
        <section className="section-padding bg-brand-dark">
          <div className="container-custom text-center">
            <h2 className="heading-2 text-white mb-4">
              Why Patients Trust Us
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-10">
              {[
                { value: "[X]+", label: "Procedures" },
                { value: "[X]+", label: "Years Experience" },
                { value: "[X]%", label: "Satisfaction" },
                { value: "[X]+", label: "Countries" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold font-serif text-brand-gold">{value}</div>
                  <div className="text-white/60 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
            {/* TODO: Replace all [X] stat placeholders with verified numbers */}
            <Button asChild variant="primary" size="lg">
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
