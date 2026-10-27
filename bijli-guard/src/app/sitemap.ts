import type { MetadataRoute } from "next";
import { DISCOS } from "@/lib/discos";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/calculator/", "/200-units-rule/", "/companies/", "/tariff/", "/about/", "/privacy/", ...DISCOS.map((d) => `/${d.slug}-bill-calculator/`)];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
