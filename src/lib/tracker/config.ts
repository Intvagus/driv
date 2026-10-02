// Rootline — hair-loss progress tracker. Product-level constants live here
// so naming, pricing and the free-plan limit can be changed in one place.

export const APP_NAME = "Rootline";
export const APP_TAGLINE = "See your hair progress clearly — month by month.";

// Keep in sync with the RLS insert policy in
// supabase/migrations/002_rootline_tracker.sql.
export const FREE_CHECKIN_LIMIT = 3;

// Days between recommended check-ins.
export const CHECKIN_INTERVAL_DAYS = 30;

export const PRICING = {
  monthly: { label: "Monthly", price: "$4.99", per: "/month" },
  yearly: { label: "Yearly", price: "$39", per: "/year", perMonth: "$3.25", note: "Save 35%" },
} as const;

export type Plan = keyof typeof PRICING;

export type Angle = "front" | "top" | "crown" | "sides";

export const ANGLES: { id: Angle; label: string; tip: string }[] = [
  {
    id: "front",
    label: "Front hairline",
    tip: "Face the camera at eye level, hair pulled back, phone about an arm's length away.",
  },
  {
    id: "top",
    label: "Top / mid-scalp",
    tip: "Tilt your head down toward the camera so the part line and mid-scalp fill the frame.",
  },
  {
    id: "crown",
    label: "Crown",
    tip: "Use a mirror or ask someone to shoot straight down at the back of your head.",
  },
  {
    id: "sides",
    label: "Temples / sides",
    tip: "Turn your head 90° so one temple faces the camera. Use the same side every time.",
  },
];

export const SHEDDING_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Normal",
  4: "High",
  5: "Very high",
};

export const COMMON_TREATMENTS = [
  "Minoxidil (topical)",
  "Minoxidil (oral)",
  "Finasteride",
  "Dutasteride",
  "Ketoconazole shampoo",
  "Biotin / supplements",
  "Microneedling",
  "PRP",
  "Laser cap / LLLT",
];

export const PHOTO_BUCKET = "tracker-photos";
