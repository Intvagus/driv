"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  index?: number;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  tags,
  index = 0,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${slug}`} className="block h-full group">
        <Card className="h-full transition-all duration-300 group-hover:border-brand-gold/40 group-hover:shadow-lg">
          {/* Image placeholder */}
          <div className="aspect-video bg-gradient-to-br from-brand-dark to-brand-dark-light rounded-t-xl flex items-center justify-center">
            <span className="text-brand-gold/40 text-4xl font-serif">Rı</span>
          </div>

          <CardContent className="pt-4">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2">
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h3 className="font-serif font-bold text-brand-dark text-base leading-snug mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
              {title}
            </h3>

            {excerpt && (
              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                {excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(publishedAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {author && <span>by {author}</span>}
              </div>
              <ArrowRight className="h-4 w-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
