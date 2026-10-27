import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bijli Guard — 200 Unit Tracker",
    short_name: "Bijli Guard",
    description: "Electricity bill calculator and 200-unit warning for Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F8F7",
    theme_color: "#0E7A4F",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
