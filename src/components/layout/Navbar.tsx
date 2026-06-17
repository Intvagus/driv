"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_LINKS, WHATSAPP_NUMBER } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-brand-dark/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-brand-gold font-serif text-lg font-bold group-hover:text-brand-gold-light transition-colors">
              Dr. Rana Irfan
            </span>
            <span className="text-white/80 text-xs tracking-widest uppercase">
              Hair Transplant Clinic
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "text-brand-gold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
            <Button asChild size="sm" variant="primary">
              <Link href="/book">Book Free Consultation</Link>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-brand-dark border-t border-white/10 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-brand-gold bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 pb-1">
                <Button asChild className="w-full" variant="primary">
                  <Link href="/book">Book Free Consultation</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
