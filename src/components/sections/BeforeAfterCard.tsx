"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface BeforeAfterCardProps {
  technique?: string;
  grafts?: number;
  monthsPostOp?: number;
  description?: string;
  index?: number;
}

export function BeforeAfterCard({
  technique = "FUE",
  grafts = 2500,
  monthsPostOp = 12,
  description,
  index = 0,
}: BeforeAfterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
    >
      <div className="grid grid-cols-2">
        {/* Before */}
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-gray-400 to-gray-600 flex items-end">
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              Before
            </span>
          </div>
        </div>
        {/* After */}
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-brand-dark to-brand-dark-light flex items-end">
            <span className="absolute top-2 right-2 bg-brand-gold/90 text-brand-dark text-xs px-2 py-0.5 rounded-full font-medium">
              After
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-white">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="gold" className="text-xs">{technique}</Badge>
          <Badge variant="secondary" className="text-xs">{grafts} grafts</Badge>
          <Badge variant="secondary" className="text-xs">{monthsPostOp} months</Badge>
        </div>
        {description && (
          <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
