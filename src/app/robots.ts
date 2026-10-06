import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { TRACKER_DISALLOWED_PATHS } from "@/lib/tracker/public-paths";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/api/", ...TRACKER_DISALLOWED_PATHS],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
