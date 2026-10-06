import { SITE_URL } from "@/lib/constants";

// Rootline can run on its own domain (NEXT_PUBLIC_TRACKER_URL, e.g.
// https://rootline.app) while sharing this deployment with the clinic
// site. Middleware maps clean paths on that domain to /tracker/*, so
// rootline.app/guides serves /tracker/guides. Unset: everything stays at
// <clinic site>/tracker.

const ownDomain = process.env.NEXT_PUBLIC_TRACKER_URL?.replace(/\/$/, "") || "";

export const TRACKER_OWN_DOMAIN = ownDomain.length > 0;
export const TRACKER_ORIGIN = ownDomain || SITE_URL.replace(/\/$/, "");

/** The public form of an internal path: "/tracker/guides" -> "/guides" on the own domain. */
export function trackerPath(path: string) {
  if (!TRACKER_OWN_DOMAIN) return path;
  if (path === "/tracker" || path.startsWith("/tracker?")) return `/${path.slice("/tracker".length)}`;
  return path.startsWith("/tracker/") ? path.slice("/tracker".length) : path;
}

/** Absolute public URL for an internal path, for emails, QR codes, canonicals and sitemaps. */
export function trackerUrl(path: string) {
  return `${TRACKER_ORIGIN}${trackerPath(path)}`;
}
