"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ProcedureCardProps {
  title: string;
  slug: string;
  category: "surgical" | "non_surgical";
  technique: string;
  description: string;
  graftRange: string;
  duration: string;
  downtime: string;
  index?: number;
}

export function ProcedureCard({
  title,
  slug,
  category,
  technique,
  description,
  graftRange,
  duration,
  downtime,
  index = 0,
}: ProcedureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/procedures/${slug}`} className="block h-full group">
        <Card className="h-full transition-all duration-300 group-hover:border-brand-gold/50 group-hover:shadow-lg group-hover:-translate-y-1">
          {/* Top gold bar */}
          <div className="h-1 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-t-xl" />
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={category === "surgical" ? "default" : "gold"} className="text-xs">
                {category === "surgical" ? "Surgical" : "Non-Surgical"}
              </Badge>
              <span className="text-brand-gold text-sm font-medium">{technique}</span>
            </div>

            <h3 className="text-lg font-serif font-bold text-brand-dark mb-2 group-hover:text-brand-dark-light transition-colors">
              {title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 text-brand-gold" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                <span>{downtime} downtime</span>
              </div>
            </div>

            {graftRange !== "N/A" && (
              <p className="text-xs text-gray-500 mb-4">
                <span className="font-medium text-brand-dark">Grafts:</span> {graftRange}
              </p>
            )}

            <div className="flex items-center gap-1 text-brand-gold text-sm font-semibold group-hover:gap-2 transition-all">
              Learn More
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
