# OP-11 — Physician + MedicalClinic JSON-LD

Implemented directly in this repo's code (`src/lib/schema.ts`,
`src/components/layout/JsonLd.tsx`, wired site-wide in
`src/app/layout.tsx`) — this is the Next.js rebuild, fully in this
agent's reach (bucket 1). The live WordPress site needs the equivalent
pasted into Rank Math's custom schema/code injection — see "For the live
site" below.

## What's in it, and where each fact came from

| Property | Value | Source |
|---|---|---|
| Clinic name | `Dr. Rana Irfan` (alternate: `Vagus Surgery Clinic`) | Matches the live Google Business Profile listing's name exactly — byte-for-byte NAP match, per this repo's own Local SEO guardrail |
| Address | House 08, Street 60, F-8/4, Islamabad, 44000, Pakistan | Clinic's official knowledge base + confirmed live on the GBP listing (which also supplied the zip code, `44000`, not previously recorded anywhere in this tracker) |
| Phone / email | Uses `CLINIC_PHONE`/`CLINIC_EMAIL` from `lib/constants.ts` | Same values just wired in from the NAP task — kept consistent with what the rest of the site displays (see discrepancy note below) |
| Geo-coordinates | `33.7113397, 73.0464433` | Pulled live from the clinic's actual Google Business Profile (DataForSEO, 2026-10-24) — not estimated from the address |
| Opening hours | Mon–Sat 09:00–18:00, closed Sunday | Live GBP listing's own published hours — see note below, this isn't the same number OP-11's original evidence cited |
| Price range | PKR 100,000 – PKR 400,000 | Clinic's official knowledge base (typical package cost) |
| Medical specialty | `PlasticSurgery` | Judgment call — schema.org's `MedicalSpecialty` enum has no "hair restoration" term; `PlasticSurgery` is the closest standard value. Flagging this rather than silently picking it. |
| Languages | English, Urdu | Clinic's official knowledge base (also notes ~90% of patients are international) |
| `sameAs` (clinic) | GBP listing, OlaDoc, WhatClinic, Facebook, Instagram, YouTube, X | All confirmed real profile URLs, not guessed |
| `aggregateRating` | 4.8 / 636 reviews | Live, real rating pulled from the GBP listing on 2026-10-24 — not fabricated. Will drift over time; re-check before treating this as current in a future audit. |
| Physician `sameAs` | ABHRS, ISHRS, IMCAS, LinkedIn, + socials | Same confirmed set used in `OP-01`/`OP-12` |
| Physician `alumniOf` | Quaid-e-Azam Medical College | Clinic's official knowledge base timeline (graduated 1994) |

## Two things worth a second look, not acted on silently

1. **Phone number discrepancy.** The live Google Business Profile lists
   `+92 51 2287661` (a landline) — different from `CLINIC_PHONE`
   (`+92 333 5010042`, a mobile, per the clinic's official knowledge
   base). The schema above uses the mobile number to stay consistent
   with what this site's Footer/Navbar/Contact page already display —
   but worth asking the clinic which number is the actual front-desk
   line GBP should show, since local-pack NAP matching cares about this
   byte-for-byte. Possible these are both legitimate (landline for GBP,
   mobile/WhatsApp for direct patient contact) — flagging rather than
   guessing.
2. **An unconfirmed credential surfaced in the GBP listing's own
   "services" text**: one service entry reads "President, American Board
   of Hair Restoration Surgery (ABHRS) Vice President, International
   Board of Hair Restoration Surgery (IBHRS USA)". The IBHRS Vice
   Presidency isn't in the clinic's official knowledge base or anywhere
   else confirmed in this engagement, and GBP "services" text is
   self-published marketing copy, not a verified field — lower-trust than
   the knowledge base. Not added to any schema or draft on that basis
   alone. Worth checking directly with the clinic — it would also help
   close `OFF-08`'s still-open "IBHRS profile URL not located" item if
   real.

## Opening-hours note

`OP-11`'s original evidence cited "11am–5pm Mon–Sat" — that's actually
the clinic's **free in-clinic consultation** window specifically (per
the knowledge base), not the clinic's general opening hours. The live
GBP listing's own published hours are Mon–Sat 09:00–18:00, closed
Sunday — that's what `openingHoursSpecification` represents here, since
the schema property's actual meaning is general business hours, and
this is the authoritative, current, real figure for that. If the
consultation window specifically needs its own structured
representation later (e.g. via `makesOffer`), that's a separate,
narrower addition, not a substitute for the real opening hours.

## For the live WordPress site (not yet applied)

Same two JSON-LD objects (`src/lib/schema.ts` has the exact structure),
pasted via Rank Math's "Schema" tab (custom schema type) or a code
injection plugin. Needs WordPress access this agent doesn't have — this
is the live-site half of `OP-11`, tracked separately from the in-repo
work above since the live site's actual `CLINIC_PHONE` display should be
checked against it first (same discrepancy as noted above).

## Status

**In this repo**: done. `src/lib/schema.ts`, `src/components/layout/JsonLd.tsx`,
wired into `src/app/layout.tsx`. Verified with `npm run build` — renders
valid JSON on every page, mentally checked against schema.org's required/
recommended properties for `MedicalClinic` and `Physician`.

**On the live WordPress site**: not applied — needs WordPress/Rank Math
access, and the phone-number discrepancy resolved first.
