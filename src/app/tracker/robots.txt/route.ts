import { TRACKER_DISALLOWED_PATHS } from "@/lib/tracker/public-paths";
import { TRACKER_ORIGIN, trackerPath } from "@/lib/tracker/urls";

// Served as /robots.txt on Rootline's own domain (see middleware).
export const dynamic = "force-static";

export function GET() {
  const disallow = [
    "/api/",
    ...TRACKER_DISALLOWED_PATHS,
    // The same pages under their short paths.
    ...TRACKER_DISALLOWED_PATHS.map(trackerPath).filter((p) => !TRACKER_DISALLOWED_PATHS.includes(p)),
  ];
  const body = [
    "User-agent: *",
    "Allow: /",
    ...disallow.map((p) => `Disallow: ${p}`),
    "",
    `Sitemap: ${TRACKER_ORIGIN}/sitemap.xml`,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
