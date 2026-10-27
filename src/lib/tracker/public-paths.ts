import { GUIDES, isIndexable } from "./guides";

/** Public, indexable Rootline pages (internal paths), for the sitemaps. */
export const TRACKER_PUBLIC_PATHS = [
  "/tracker",
  "/tracker/guides",
  "/tracker/clinics",
  "/tracker/privacy",
  "/tracker/terms",
  "/tracker/refunds",
  // Medical guides are listed once a reviewer has signed off.
  ...GUIDES.filter(isIndexable).map((g) => `/tracker/guides/${g.slug}`),
];

/** Paths kept out of search engines. */
export const TRACKER_DISALLOWED_PATHS = [
  "/tracker/app/",
  "/tracker/unsubscribe",
  "/tracker/offline",
  "/tracker/r/",
  "/tracker/clinics/card",
];
