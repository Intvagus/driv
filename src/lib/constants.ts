export const SITE_NAME = "Dr. Rana Irfan Hair Transplant Clinic";
export const SITE_DESCRIPTION =
  "Premium hair restoration clinic in Islamabad, Pakistan. Expert FUE, DHI, Sapphire FUE hair transplant procedures by Dr. Rana Irfan.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drranairfan.com";
export const WHATSAPP_NUMBER = "+923001234567"; // TODO: Replace with actual number
export const CLINIC_PHONE = "+92-51-1234567"; // TODO: Replace with actual phone
export const CLINIC_EMAIL = "info@drranairfan.com"; // TODO: Replace with actual email
export const CLINIC_ADDRESS = "Blue Area, Islamabad, Pakistan"; // TODO: Replace with actual address

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Procedures", href: "/procedures" },
  { label: "Conditions", href: "/conditions" },
  { label: "Results", href: "/results" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const PROCEDURES = [
  {
    title: "FUE Hair Transplant",
    slug: "fue-hair-transplant",
    category: "surgical" as const,
    technique: "FUE",
    description:
      "Follicular Unit Extraction (FUE) is the gold standard in hair transplantation, harvesting individual follicles for natural results.",
    graftRange: "1,000 – 4,000 grafts",
    duration: "6–8 hours",
    downtime: "7–10 days",
    pricePerGraft: 120, // PKR placeholder
    icon: "✦",
  },
  {
    title: "DHI Hair Transplant",
    slug: "dhi-hair-transplant",
    category: "surgical" as const,
    technique: "DHI",
    description:
      "Direct Hair Implantation (DHI) uses a specialized Choi pen for precise implantation without pre-made incisions, maximizing density.",
    graftRange: "1,000 – 3,500 grafts",
    duration: "6–8 hours",
    downtime: "7–10 days",
    pricePerGraft: 140,
    icon: "✦",
  },
  {
    title: "Sapphire FUE",
    slug: "sapphire-fue",
    category: "surgical" as const,
    technique: "Sapphire FUE",
    description:
      "Sapphire-tipped blades create micro-channels for higher density implantation, faster healing, and more natural hairline design.",
    graftRange: "1,000 – 4,000 grafts",
    duration: "6–8 hours",
    downtime: "5–7 days",
    pricePerGraft: 150,
    icon: "✦",
  },
  {
    title: "Beard Transplant",
    slug: "beard-transplant",
    category: "surgical" as const,
    technique: "FUE/DHI",
    description:
      "Restore or enhance your beard density and shape with precision follicle transplantation for natural-looking results.",
    graftRange: "500 – 2,500 grafts",
    duration: "4–6 hours",
    downtime: "5–7 days",
    pricePerGraft: 130,
    icon: "✦",
  },
  {
    title: "PRP Therapy",
    slug: "prp-therapy",
    category: "non_surgical" as const,
    technique: "PRP",
    description:
      "Platelet-Rich Plasma therapy harnesses your body's own growth factors to stimulate hair follicles and slow hair loss.",
    graftRange: "N/A",
    duration: "1 hour",
    downtime: "None",
    pricePerGraft: 0,
    icon: "✦",
  },
  {
    title: "Female Hair Transplant",
    slug: "female-hair-transplant",
    category: "surgical" as const,
    technique: "FUE/DHI",
    description:
      "Tailored hair restoration solutions for women experiencing thinning or hair loss, preserving natural patterns.",
    graftRange: "500 – 3,000 grafts",
    duration: "4–8 hours",
    downtime: "7–10 days",
    pricePerGraft: 130,
    icon: "✦",
  },
];

export const CONDITIONS = [
  {
    title: "Male Pattern Baldness",
    slug: "male-pattern-baldness",
    description: "Androgenetic alopecia is the most common form of hair loss in men, following the Norwood scale.",
    icon: "👨",
  },
  {
    title: "Female Pattern Hair Loss",
    slug: "female-pattern-hair-loss",
    description: "Diffuse thinning affecting women, typically following the Ludwig classification scale.",
    icon: "👩",
  },
  {
    title: "Alopecia Areata",
    slug: "alopecia-areata",
    description: "An autoimmune condition causing patchy hair loss on the scalp and other areas of the body.",
    icon: "🔬",
  },
  {
    title: "Traction Alopecia",
    slug: "traction-alopecia",
    description: "Hair loss caused by prolonged tension on the hair follicles from tight hairstyles.",
    icon: "💆",
  },
  {
    title: "Scarring Alopecia",
    slug: "scarring-alopecia",
    description: "Permanent hair loss due to scarring from injury, burns, or inflammatory conditions.",
    icon: "🩹",
  },
  {
    title: "Beard & Eyebrow Loss",
    slug: "beard-eyebrow-loss",
    description: "Patchy or complete loss of facial hair including beard, mustache, and eyebrow areas.",
    icon: "✨",
  },
];

export const NORWOOD_STAGES = [
  "Stage I",
  "Stage II",
  "Stage IIa",
  "Stage III",
  "Stage IIIa",
  "Stage III Vertex",
  "Stage IV",
  "Stage IVa",
  "Stage V",
  "Stage Va",
  "Stage VI",
  "Stage VII",
];

export const BOOKING_STATUSES = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "yellow" },
  confirmed: { label: "Confirmed", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
  completed: { label: "Completed", color: "blue" },
} as const;

export const PAYMENT_STATUSES = {
  deposit_pending: { label: "Deposit Pending", color: "yellow" },
  deposit_submitted: { label: "Deposit Submitted", color: "blue" },
  deposit_confirmed: { label: "Deposit Confirmed", color: "green" },
  deposit_rejected: { label: "Deposit Rejected", color: "red" },
  balance_pending: { label: "Balance Pending", color: "orange" },
  fully_paid: { label: "Fully Paid", color: "green" },
} as const;
