import { NextResponse } from "next/server";
import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

// Served as a route (not the app/manifest.ts file convention) so sections
// with their own installable app, like /tracker, can override the
// `manifest` metadata — the file convention always wins over nested layouts.
export const dynamic = "force-static";

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    name: SITE_NAME,
    short_name: "Dr. Rana Irfan",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#15323F",
    theme_color: "#15323F",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
  return NextResponse.json(manifest, { headers: { "Content-Type": "application/manifest+json" } });
}
