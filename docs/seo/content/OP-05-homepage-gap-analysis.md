# OP-05 — Homepage/money-keyword competitiveness: gap analysis + fixes

The fix calls for building "a best-in-market Islamabad landing page" —
but the current homepage (crawled 2026-10-24) already has most of the
right section *structure*. This isn't a from-scratch rebuild; it's
filling specific, identifiable gaps, several of which already have their
own tracker rows. Written this way deliberately, to avoid duplicating
`OP-08`/`OP-09`/`OP-11` work under a different name.

## What's already there (confirmed via the heading structure)

- "Hair Transplant in Islamabad Pakistan" — H2, keyword-relevant
- "Understanding Hair Transplants: The Basics" — educational section
- "Expert Hairline Design for a Perfectly Natural Look" — differentiator messaging
- "Meet The Expert" — **surgeon credentials section exists**
- "Patient Testimonials On FUE Hair Transplant With Dr Rana Irfan" — **testimonials exist** (format — video vs. text — unconfirmed, see below)
- "Stage-Wise Hair Restoration" — candidacy/education content
- "Frequently Asked Questions" — **FAQ section exists** (text content unconfirmed, see below)
- Service breakdown: FUE, FUT/LSE, Beard & Eyebrow, Female Hair Loss

## What's missing, against `OP-05`'s own checklist

| Item | Status | Owner |
|---|---|---|
| Pricing table | Missing — no heading suggests one exists | `OP-09` already flagged this independently; draft below |
| Graft calculator | Tool exists at `/graft-calculator/` but isn't embedded/linked from the homepage | New — draft below |
| Before/after gallery | Missing | `OP-08` already flagged this independently |
| Surgeon credentials | **Present** ("Meet The Expert") | Nothing to do |
| Video testimonials | Testimonials exist; can't confirm video vs. text from a heading-only crawl | Needs a direct check — see below |
| Embedded map | Missing | New — draft below |
| FAQ schema | Visible FAQ section exists; can't confirm structured data is attached | Covered by `OP-11` (site-wide schema gap); needs the actual Q&A text before I can draft it — see below |
| Booking form | Can't confirm from headings whether this is a real embedded form or just a CTA button | Needs a direct check — see below |

## Ready-to-use content for the genuinely new gaps

### Pricing table

Using the confirmed rate from `OP-09`/the clinic's own stated pricing:

> **Hair Transplant Pricing**
>
> | | |
> |---|---|
> | Per graft | ~PKR 70 |
> | Typical package (1,000–4,000 grafts) | PKR 100,000 – 400,000 |
>
> *Final pricing depends on graft count, technique, and your consultation assessment. [Get a personalized quote → Book Free Consultation]*

Keep this honest and simple — a real range, not a misleadingly low
"starting from" figure, consistent with `OP-09`'s own instruction to
surface the actual band.

### Graft calculator — just needs linking, not building

The tool already exists. Add a visible card/button on the homepage:

> **Not sure how many grafts you need?** [Try our free Graft Calculator →] (links to `/graft-calculator/`)

This is the lowest-effort item on this whole list — one link, and it
surfaces a tool that already has decent standalone traffic (1,065
clicks/90d per the `OP-02` blog audit) but apparently isn't promoted from
the homepage itself.

### Embedded map

Don't use a generic address pin — embed directly from the clinic's
actual Google Business Profile for accuracy and consistency with local
SEO signals (`OFF-04`): Google Business Profile → **Share** → **Embed a
map** → copy the provided `<iframe>` code. Fallback if GBP access isn't
handy: a standard Google Maps embed using the confirmed address (House
08, Street 60, F-8/4, Islamabad).

## Needs a direct look at the live page, not something I can draft blind

Three items I can't responsibly guess at from a heading-only crawl:

1. **Are the testimonials video or text?** If text-only, that's the
   `OP-05` gap to fill (video testimonials specifically) — if video,
   nothing to do here.
2. **Is there a real embedded booking form, or just a button linking to
   `/book`?** Either can work, but worth knowing which.
3. **What's the actual FAQ question/answer text?** I need this to write
   accurate `FAQPage` JSON-LD for `OP-11` — schema has to match what's
   really on the page, not something I invent. Paste the current FAQ
   text here (or in a reply) and I'll turn it into ready-to-add schema.

## Sequencing note

Given `OP-06`/`OP-22`/`TECH-21` show the homepage was edited yesterday
and may still be in flux, I'd hold off adding the pricing table, map, and
calculator link until whoever's actively editing confirms they're done
with their current pass — adding content to a page mid-edit risks the
same kind of collision that produced the title-tag bug.

## Status

Gap analysis complete, content drafted for the clear gaps. Three items
need the live page checked directly before I can finish them. Nothing
applied — needs WordPress access.
