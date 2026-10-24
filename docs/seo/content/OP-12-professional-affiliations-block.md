# OP-12 — "Professional Affiliations" content block for the About page

This is the actual fix for IMCAS not being indexed: Google discovers and
crawls new pages primarily by following links from pages it already
crawls regularly. `drranairfan.com`'s About page almost certainly gets
crawled far more often than a brand-new, unlinked-to profile on another
domain — so a visible, real link from About → IMCAS gives Google a path
to find it. This also happens to be the correct way to implement `OP-12`
(Person schema `sameAs`) since the visible links and the schema should
point at the same set of profiles.

Add this as a new section on the About page (`/about/`), near the
credentials/bio content already there:

---

### Section: Professional Affiliations & Credentials

> **Dr. Rana Irfan is recognized by the following professional bodies:**
>
> - [American Board of Hair Restoration Surgery (ABHRS)](https://abhrs.org/directory/listing/rana-irfan-md) — Diplomate; first non-American President; Immediate Past President
> - [International Society of Hair Restoration Surgery (ISHRS)](https://ishrs.org/doctor/594807/) — Fellow (FISHRS)
> - [IMCAS](https://www.imcas.com/en/profile/dr-rana-irfan-2) — International Master Course on Aging Science
> - Hair Restoration Society of Pakistan (HRSP) — President (2025)

Each should be a real `<a href>` link (not just plain text, and not a
`rel="nofollow"` — an outbound link that's actually crawlable is the
whole point here), ideally placed somewhere it won't get missed — this
section itself, or integrated into the existing bio paragraph if that
reads more naturally on the page.

### Matching JSON-LD (for `OP-12` itself, the structured-data side)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dr. Rana Irfan",
  "sameAs": [
    "https://abhrs.org/directory/listing/rana-irfan-md",
    "https://ishrs.org/doctor/594807/",
    "https://www.imcas.com/en/profile/dr-rana-irfan-2",
    "https://www.linkedin.com/in/dr-rana-irfan-01806427/",
    "https://facebook.com/ranairfandr/",
    "https://www.instagram.com/hairtransplantisb/",
    "https://www.youtube.com/@vagushairtransplant",
    "https://x.com/RanaIrfanDr"
  ]
}
```

Instagram/YouTube/X added 2026-10-24: the earlier conflict (IMCAS's icon
pointing to `doctorranairfan` instead of `hairtransplantisb`) is now
resolved — `hairtransplantisb` is confirmed the official account per the
clinic's own official knowledge base document, and `doctorranairfan`
looks like a stale link on IMCAS's own page (its icon URL is also
technically broken there, a doubled URL). See `docs/seo/content/OP-01-author-bio-boxes.md`
and `OFF-06` for the full resolution.

## Why this specific fix, not a Search Console request

Google Search Console's "Request Indexing" only works on properties
*you've* verified ownership of. `drranairfan.com` is verified; `imcas.com`
isn't, and can't be — it's IMCAS's site, not the clinic's. There's no
button to push for someone else's page. An inbound link from a page
Google already crawls is the actual lever available here, and it's a
legitimate one, not a workaround — this is literally how Google's crawler
has always discovered new pages.

## Status

Drafted, both the visible content and the matching JSON-LD. Not applied —
needs WordPress access to add to the About page. Once live, IMCAS
indexing is largely a waiting game after that (days to a couple of
weeks is typical for a page one inbound link away from an already-
crawled site) — nothing further to "request."
