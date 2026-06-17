"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { ProcedureCard } from "@/components/sections/ProcedureCard";
import { PROCEDURES } from "@/lib/constants";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function ProceduresPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "surgical" | "non_surgical">("all");

  const filtered = PROCEDURES.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
              Our Services
            </span>
            <h1 className="heading-1 text-white mt-2 mb-4">Hair Restoration Procedures</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Advanced surgical and non-surgical treatments tailored to your unique needs.
            </p>
          </div>
        </section>

        {/* Search + Filter */}
        <section className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="container-custom flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search procedures..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "surgical", "non_surgical"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-brand-dark text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-brand-gold"
                  }`}
                >
                  {f === "all" ? "All" : f === "surgical" ? "Surgical" : "Non-Surgical"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="section-padding">
          <div className="container-custom">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-20">No procedures found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((proc, i) => (
                  <ProcedureCard key={proc.slug} {...proc} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
