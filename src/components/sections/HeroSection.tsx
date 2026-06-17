"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "[X]+", label: "Procedures Completed", icon: CheckCircle },
  { value: "[X]%", label: "Patient Satisfaction", icon: Star },
  { value: "[X]+", label: "Years Experience", icon: Award },
  { value: "[X]+", label: "Happy Patients", icon: Users },
];

// TODO: Verify actual stats with clinic management

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark-light to-[#0d2830]" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-gold/10 blur-2xl" />

      {/* Gold diagonal accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-brand-gold/10 to-transparent" />

      <div className="relative container-custom pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl">
          {/* Pre-heading badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-brand-gold text-sm font-medium">
              Pakistan&apos;s Premier Hair Restoration Clinic
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-1 text-white mb-6"
          >
            Restore Your Hair,{" "}
            <span className="gold-gradient-text">
              Restore Your Confidence
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl"
          >
            Expert FUE, DHI, and Sapphire hair transplant procedures performed
            by Dr. Rana Irfan — combining cutting-edge technology with artistic
            precision for natural, permanent results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button asChild size="lg" variant="primary">
              <Link href="/book" className="flex items-center gap-2">
                Book Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/results">View Before &amp; After Results</Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
              >
                <Icon className="h-6 w-6 text-brand-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-serif">{value}</div>
                <div className="text-white/60 text-xs mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-brand-gold/60 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
