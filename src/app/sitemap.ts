import { MetadataRoute } from "next";
import { SITE_URL, PROCEDURES, CONDITIONS } from "@/lib/constants";
import { TRACKER_PUBLIC_PATHS } from "@/lib/tracker/public-paths";
import { TRACKER_OWN_DOMAIN } from "@/lib/tracker/urls";

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

  // Rootline's public pages, unless it has its own domain (then they're in
  // that domain's /sitemap.xml instead).
  const trackerPages = TRACKER_OWN_DOMAIN
    ? []
    : TRACKER_PUBLIC_PATHS.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "/tracker" ? 0.9 : 0.6,
      }));

  return [...staticPages, ...procedurePages, ...conditionPages, ...trackerPages];
}
