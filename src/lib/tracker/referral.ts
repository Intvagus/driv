// Clinic referral codes: the slug in /tracker/r/<code>, printed as a QR
// code on the clinic's cards and stored on the user's tracker_preferences.

export const REF_COOKIE = "rl_ref";
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

const VALID = /^[a-z0-9-]{1,40}$/; // keep in sync with 004_rootline_referrals.sql

export function isValidRef(code: string | undefined | null): code is string {
  return !!code && VALID.test(code);
}

/** "Bright Hair Clinic, Austin" -> "bright-hair-clinic-austin" */
export function refFromName(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // drop accents: "ü" -> "u"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= 40) return slug;
  // Too long: cut at the last whole word that fits.
  const cut = slug.slice(0, 41);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 0 ? cut.slice(0, lastDash) : slug.slice(0, 40)).replace(/-+$/g, "");
}
