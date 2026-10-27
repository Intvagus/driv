import { TRACKER_PUBLIC_PATHS } from "@/lib/tracker/public-paths";
import { trackerUrl } from "@/lib/tracker/urls";

// Served as /sitemap.xml on Rootline's own domain (see middleware).
export const dynamic = "force-static";

export function GET() {
  const now = new Date().toISOString();
  const urls = TRACKER_PUBLIC_PATHS.map(
    (path) =>
      `<url><loc>${trackerUrl(path)}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${
        path === "/tracker" ? "1.0" : "0.6"
      }</priority></url>`
  ).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
