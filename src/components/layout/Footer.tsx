import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import {
  SITE_NAME,
  CLINIC_ADDRESS,
  CLINIC_PHONE,
  CLINIC_EMAIL,
  WHATSAPP_NUMBER,
  NAV_LINKS,
} from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="text-brand-gold font-serif text-xl font-bold">
                Dr. Rana Irfan
              </span>
              <span className="text-white/60 text-xs tracking-widest uppercase mt-0.5">
                Hair Transplant Clinic
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Pakistan&apos;s premier hair restoration clinic, combining advanced
              surgical techniques with compassionate care to deliver natural,
              lasting results.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Procedures */}
          <div>
            <h3 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Procedures
            </h3>
            <ul className="space-y-2">
              {[
                ["FUE Hair Transplant", "/procedures/fue-hair-transplant"],
                ["DHI Hair Transplant", "/procedures/dhi-hair-transplant"],
                ["Sapphire FUE", "/procedures/sapphire-fue"],
                ["Beard Transplant", "/procedures/beard-transplant"],
                ["PRP Therapy", "/procedures/prp-therapy"],
                ["Female Hair Transplant", "/procedures/female-hair-transplant"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-brand-gold text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                <span>{CLINIC_ADDRESS}</span>
              </li>
              <li>
                <a
                  href={`tel:${CLINIC_PHONE}`}
                  className="flex gap-3 text-sm text-white/60 hover:text-brand-gold transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>{CLINIC_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CLINIC_EMAIL}`}
                  className="flex gap-3 text-sm text-white/60 hover:text-brand-gold transition-colors"
                >
                  <Mail className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                  <span>{CLINIC_EMAIL}</span>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs leading-relaxed mb-4">
            <strong className="text-white/60">Medical Disclaimer:</strong> The
            information on this website is for general informational purposes
            only and does not constitute medical advice. Hair transplant
            procedures carry risks. Individual results may vary. Always consult
            with a qualified medical professional before undergoing any
            procedure. Dr. Rana Irfan Hair Transplant Clinic is regulated by the
            Pakistan Medical and Dental Council (PMDC).
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-white/40 text-xs">
              © {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
                ["FAQs", "/faqs"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/40 hover:text-brand-gold text-xs transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
