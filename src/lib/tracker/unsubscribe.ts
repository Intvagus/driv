import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { trackerPath } from "./urls";

// Unsubscribe links carry the user id plus an HMAC of it, so they work
// without signing in but can't be forged for someone else.

function secret() {
  const s = process.env.TRACKER_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET;
  if (!s) throw new Error("TRACKER_UNSUBSCRIBE_SECRET (or CRON_SECRET) is not set");
  return s;
}

export function unsubscribeToken(userId: string) {
  return createHmac("sha256", secret()).update(`unsubscribe:${userId}`).digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string) {
  const expected = Buffer.from(unsubscribeToken(userId), "utf8");
  const given = Buffer.from(token, "utf8");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribePageUrl(siteUrl: string, userId: string) {
  return `${siteUrl}${trackerPath("/tracker/unsubscribe")}?u=${userId}&t=${unsubscribeToken(userId)}`;
}

/** Endpoint for RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). */
export function oneClickUnsubscribeUrl(siteUrl: string, userId: string) {
  return `${siteUrl}/api/tracker/unsubscribe?u=${userId}&t=${unsubscribeToken(userId)}`;
}
