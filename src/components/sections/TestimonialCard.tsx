"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface TestimonialCardProps {
  patientName: string;
  rating: number;
  review: string;
  procedure?: string;
  index?: number;
}

export function TestimonialCard({
  patientName,
  rating,
  review,
  procedure,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <Quote className="h-8 w-8 text-brand-gold/30 mb-3" />

          {/* Stars */}
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "text-brand-gold fill-brand-gold"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
            &ldquo;{review}&rdquo;
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-dark to-brand-dark-light flex items-center justify-center text-white font-bold text-sm">
              {patientName.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-brand-dark text-sm">
                {patientName}
              </div>
              {procedure && (
                <div className="text-brand-gold text-xs">{procedure}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
