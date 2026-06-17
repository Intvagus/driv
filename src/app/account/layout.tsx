import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import Link from "next/link";

const accountLinks = [
  { label: "Overview", href: "/account" },
  { label: "Appointments", href: "/account/appointments" },
  { label: "Payments", href: "/account/payments" },
  { label: "Profile", href: "/account/profile" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="bg-brand-dark py-8">
          <div className="container-custom">
            <h1 className="text-white font-serif text-2xl font-bold">My Account</h1>
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold transition-colors bg-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
