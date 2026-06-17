"use client";

import { motion } from "framer-motion";
import {
  Award,
  Microscope,
  Shield,
  HeartHandshake,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Board-Certified Surgeon",
    description:
      "Dr. Rana Irfan is a PMDC-certified surgeon with specialized training in advanced hair restoration techniques from internationally recognized institutions.",
  },
  {
    icon: Microscope,
    title: "Advanced Technology",
    description:
      "We use state-of-the-art FUE motorized extraction systems, sapphire blades, and DHI Choi pens for precise, minimally invasive procedures.",
  },
  {
    icon: Shield,
    title: "Guaranteed Results",
    description:
      "Our procedures come with a comprehensive aftercare program and result guarantee, ensuring you achieve the natural-looking density you desire.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description:
      "Every patient receives a customized treatment plan designed around their unique hair loss pattern, facial structure, and aesthetic goals.",
  },
  {
    icon: Stethoscope,
    title: "Medical-Grade Facility",
    description:
      "Our clinic operates under strict medical protocols with sterile operating theatres, international safety standards, and licensed medical staff.",
  },
  {
    icon: TrendingUp,
    title: "Proven Track Record",
    description:
      "With [X]+ successful procedures and a [X]% patient satisfaction rate, our results speak for themselves. [Verify stats with clinic].",
  },
];

const stats = [
  { value: "[X]+", label: "Procedures" },
  { value: "[X]+", label: "Years Experience" },
  { value: "[X]%", label: "Satisfaction Rate" },
  { value: "[X]+", label: "International Patients" },
];

// TODO: Replace all [X] placeholder stats with actual verified numbers

export function WhyUsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand-dark to-brand-dark-light">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="heading-2 text-white mt-2 mb-4">
            Why Dr. Rana Irfan
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A commitment to excellence, precision, and patient satisfaction that
            sets us apart as Pakistan&apos;s leading hair transplant clinic.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="text-center bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="text-3xl md:text-4xl font-bold font-serif text-brand-gold">
                {value}
              </div>
              <div className="text-white/60 text-sm mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 hover:border-brand-gold/30 rounded-xl p-6 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center mb-4 group-hover:bg-brand-gold/30 transition-colors">
                <Icon className="h-6 w-6 text-brand-gold" />
              </div>
              <h3 className="text-white font-serif font-semibold text-lg mb-2">
                {title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
