import { MetadataRoute } from "next";
import { SITE_URL, PROCEDURES, CONDITIONS } from "@/lib/constants";
import { GUIDES, isIndexable } from "@/lib/tracker/guides";

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

  // Rootline tracker: public pages only. Medical guides are listed once a
  // reviewer has signed off (see src/lib/tracker/guides.ts).
  const trackerPages = [
    "/tracker",
    "/tracker/guides",
    "/tracker/clinics",
    "/tracker/privacy",
    "/tracker/terms",
    "/tracker/refunds",
    ...GUIDES.filter(isIndexable).map((g) => `/tracker/guides/${g.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/tracker" ? 0.9 : 0.6,
  }));

  return [...staticPages, ...procedurePages, ...conditionPages, ...trackerPages];
}
