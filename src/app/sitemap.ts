import { MetadataRoute } from "next";
import { SITE_URL, PROCEDURES, CONDITIONS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/procedures",
    "/conditions",
    "/results",
    "/blog",
    "/about",
    "/contact",
    "/faqs",
    "/book",
    "/consultation",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const procedurePages = PROCEDURES.map((p) => ({
    url: `${SITE_URL}/procedures/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const conditionPages = CONDITIONS.map((c) => ({
    url: `${SITE_URL}/conditions/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...procedurePages, ...conditionPages];
}
