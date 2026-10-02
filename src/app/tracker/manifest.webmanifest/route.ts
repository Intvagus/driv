import { NextResponse } from "next/server";
import { APP_NAME, APP_TAGLINE } from "@/lib/tracker/config";

// Web app manifest for the tracker only. Scoped to /tracker/ so installing
// it never captures the clinic site (which has its own /manifest.webmanifest).
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      id: "/tracker/app",
      name: `${APP_NAME} — Hair Progress Tracker`,
      short_name: APP_NAME,
      description: APP_TAGLINE,
      start_url: "/tracker/app?source=pwa",
      scope: "/tracker/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#F7FAF9",
      theme_color: "#0F766E",
      categories: ["health", "lifestyle", "medical"],
      icons: [
        { src: "/tracker/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/tracker/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/tracker/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      shortcuts: [
        {
          name: "New check-in",
          short_name: "Check-in",
          url: "/tracker/app/new",
          icons: [{ src: "/tracker/icons/icon-192.png", sizes: "192x192" }],
        },
        {
          name: "Compare photos",
          short_name: "Compare",
          url: "/tracker/app/compare",
          icons: [{ src: "/tracker/icons/icon-192.png", sizes: "192x192" }],
        },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } }
  );
}
