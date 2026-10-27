// Public site settings, read at build time.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bijliguard.pk").replace(/\/$/, "");
export const SITE_NAME = "Bijli Guard";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com";
// Google AdSense publisher id, e.g. "ca-pub-1234567890123456". Ads render only when set.
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
// AdSense ad unit ids for the two placements.
export const AD_SLOTS = {
  top: process.env.NEXT_PUBLIC_AD_SLOT_TOP,
  inContent: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT,
};
