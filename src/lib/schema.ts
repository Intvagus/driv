import { SITE_URL, CLINIC_PHONE, CLINIC_EMAIL } from "@/lib/constants";

// Geo-coordinates, opening hours, and the aggregate rating below are pulled
// from the clinic's live Google Business Profile listing (DataForSEO Google
// My Business data, checked 2026-10-24) — not invented. Re-verify
// periodically since the rating/review count drift over time and the
// address record there is the local-SEO source of truth (OP-11/ACTION-PLAN).
const CLINIC_GEO = { latitude: 33.7113397, longitude: 73.0464433 };

const SOCIAL_PROFILES = [
  "https://www.facebook.com/ranairfandr/",
  "https://www.instagram.com/hairtransplantisb/",
  "https://www.youtube.com/@vagushairtransplant",
  "https://x.com/RanaIrfanDr",
];

export const medicalClinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  // Matches the live Google Business Profile listing's name exactly, for
  // byte-for-byte NAP consistency (the practice is branded under the
  // doctor's own name, not a separate trading name).
  name: "Dr. Rana Irfan",
  alternateName: "Vagus Surgery Clinic",
  url: SITE_URL,
  telephone: CLINIC_PHONE,
  email: CLINIC_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "House 08, Street 60, F-8/4",
    addressLocality: "Islamabad",
    postalCode: "44000",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CLINIC_GEO.latitude,
    longitude: CLINIC_GEO.longitude,
  },
  // Live Google Business Profile hours (Mon–Sat 9:00–18:00, closed Sunday) —
  // the broader clinic hours, not to be confused with the narrower 11am–5pm
  // free-consultation window quoted elsewhere on the site.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  priceRange: "PKR 100,000 - PKR 400,000",
  medicalSpecialty: "PlasticSurgery",
  availableLanguage: ["English", "Urdu"],
  sameAs: [
    "https://share.google/ImskkqSJm2Pni8URf",
    "https://oladoc.com/pakistan/islamabad/dr/hair-transplant-surgeon/rana-irfan/660201",
    "https://www.whatclinic.com/hair-loss/pakistan/islamabad/dr-rana-irfan",
    ...SOCIAL_PROFILES,
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "636",
  },
};

export const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: "Dr. Rana Irfan",
  honorificSuffix: "MBBS, ABHRS Diplomate",
  jobTitle: "Hair Restoration Surgeon",
  worksFor: {
    "@type": "MedicalClinic",
    name: "Dr. Rana Irfan",
    url: SITE_URL,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Quaid-e-Azam Medical College",
  },
  sameAs: [
    "https://abhrs.org/directory/listing/rana-irfan-md",
    "https://ishrs.org/doctor/594807/",
    "https://www.imcas.com/en/profile/dr-rana-irfan-2",
    "https://www.linkedin.com/in/dr-rana-irfan-01806427/",
    ...SOCIAL_PROFILES,
  ],
};
