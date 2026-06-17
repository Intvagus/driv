"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { BeforeAfterCard } from "@/components/sections/BeforeAfterCard";
import { PROCEDURES } from "@/lib/constants";

const galleryItems = [
  { technique: "FUE", grafts: 2800, monthsPostOp: 12, description: "Crown and hairline restoration", category: "surgical" },
  { technique: "DHI", grafts: 2200, monthsPostOp: 10, description: "Hairline design and density", category: "surgical" },
  { technique: "Sapphire FUE", grafts: 3000, monthsPostOp: 14, description: "Full scalp coverage", category: "surgical" },
  { technique: "FUE", grafts: 1800, monthsPostOp: 8, description: "Temples and mid-scalp", category: "surgical" },
  { technique: "DHI", grafts: 2600, monthsPostOp: 12, description: "Vertex restoration", category: "surgical" },
  { technique: "FUE", grafts: 500, monthsPostOp: 6, description: "Beard transplant", category: "surgical" },
  { technique: "Sapphire FUE", grafts: 2400, monthsPostOp: 11, description: "Female hairline refinement", category: "surgical" },
  { technique: "PRP", grafts: 0, monthsPostOp: 6, description: "PRP therapy result", category: "non_surgical" },
  { technique: "FUE", grafts: 3200, monthsPostOp: 16, description: "Advanced stage restoration", category: "surgical" },
];

export default function ResultsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = galleryItems.filter((item) => {
    if (filter === "all") return true;
    return item.technique === filter;
  });

  const techniques = ["all", ...Array.from(new Set(galleryItems.map((i) => i.technique)))];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
              Real Results
            </span>
            <h1 className="heading-1 text-white mt-2 mb-4">Before &amp; After Gallery</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Authentic patient results — every photo is from a real patient with their
              written consent. No filters, no editing.
            </p>
          </div>
        </section>

        <section className="py-6 bg-gray-50 border-b">
          <div className="container-custom flex flex-wrap gap-2 justify-center">
            {techniques.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === t
                    ? "bg-brand-dark text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-brand-gold"
                }`}
              >
                {t === "all" ? "All Techniques" : t}
              </button>
            ))}
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <BeforeAfterCard key={i} {...item} index={i} />
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
