# OP-02 — Blog URL audit summary

Full row-by-row detail: `docs/seo/DrRanaIrfanSEOIssueTracker.xlsx`, tab
`OP-02 Blog Audit` (250 URLs, every indexed page with ≥1 impression in the
90-day window 04 Jul – 01 Oct 2026, via Search Console). This file is the
cluster-level summary — read it first, then work the tab row by row.

## The headline number

**The "does X cause hair loss" drug/condition content farm out-clicks the
clinic's actual core service content** — 2,844 clicks vs 2,206, on a
domain whose business is surgical hair transplants. That's `OP-02`'s
"topical authority dilution" finding with real numbers attached.

## By cluster

| Cluster | URLs | Clicks (90d) | Impressions (90d) | CTR | Recommended action |
|---|---|---|---|---|---|
| Core procedure/commercial | 67 | 2,206 | 137,418 | 1.6% | Keep & strengthen — this is the business |
| Drug/condition interaction farm | 52 | 2,844 | 151,551 | 1.9% | Consolidate into FAQ hub(s); prune anything with zero plausible relevance (dialysis, etc.) |
| Hair styling/cosmetic (off-topic) | 38 | 1,535 | 343,975 | 0.45% | Prune (410) — largest impression sink, near-zero CTR |
| Finasteride micro-pages | 27 | 1,807 | 106,876 | 1.7% | Consolidate into one pillar guide + FAQ |
| Post-op care | 22 | 289 | 37,887 | 0.76% | Keep — already a reasonably coherent cluster |
| Duplicate pairs | 8 (4 pairs) | 267 | 61,137 | — | Merge each pair, 301 the weaker URL into the stronger |
| Generic informational (off-topic/zero-click) | 7 | 475 | 259,900 | 0.18% | Worst CTR of any cluster — prune or rework to funnel into real services |
| Dermatology/symptom (tangential) | 7 | 119 | 94,784 | 0.13% | Consolidate into one page, low priority |
| Thin archive/technical | 5 | 8,553 | 28,086 | — | Covered by `TECH-03`/`TECH-14` (noindex), not a content decision |
| Facial/skincare (adjacent vertical) | 5 | 93 | 40,926 | 0.23% | Business decision: does the clinic actually offer these services? |
| Core site page | 4 | 549 | 19,881 | 2.8% | Keep (homepage, about, contact, privacy policy) |
| Cancer/chemo hair loss | 4 | 87 | 23,065 | 0.38% | Low-priority keep — adjacent audience, not core |
| Celebrity/pop-culture | 2 | 61 | 2,783 | 2.2% | Keep — genuine local social proof |
| Competitor-brand comparison | 1 | 78 | 5,834 | 1.3% | Prune or rework — `/hims-vs-nutrafol/` sends consideration toward two *other* companies' products |

## Duplicate/near-duplicate pairs found (merge these first — fast, low-risk wins)

1. `/does-zyn-cause-hair-loss/` + `/does-zyn-cause-hair-loss-2/` — a literal re-publish, note the "-2" slug
2. `/low-blood-pressure-and-hair-loss/` + `/can-low-blood-pressure-cause-hair-loss/`
3. `/does-hair-weigh-anything/` + `/how-much-does-hair-weigh/`
4. `/progesterone-female-hair-loss/` + `/title-can-progesterone-cause-hair-loss/` (the second slug still has a leftover "title-" prefix — a content-import error, not just a duplicate topic)

For each pair: keep whichever has more clicks/impressions as the canonical URL, 301 the other into it, merge any unique content from the loser into the winner first.

## Consolidation targets (the actual content work, once backlink-checked)

- **One finasteride pillar page** (`/finasteride-hair-loss-complete-guide/` or similar) absorbing the ~27 micro-pages: dosage, side effects, drug interactions, switching between formulations, the PSA calculator tool, bodybuilding/MTF-specific sections as subheadings rather than separate URLs.
- **One "does X affect hair loss?" FAQ hub** absorbing the plausible subset of the 52-URL drug/condition farm (the ones with real patient relevance — antibiotics, steroids, blood pressure meds, DHT/diet questions) as a single long-form FAQ page with anchor-linked sections, not 50 separate thin pages. Prune the ones with zero plausible connection to this clinic's patients (dialysis, chlamydia, IVF, war trauma).
- **One piedra/scalp-symptom page** absorbing the 7-URL dermatology/symptom cluster (`white-piedra`, `white-piedra-vs-black-piedra`, `white-stuff-in-hair-not-dandruff`, `white-in-hair-follicles`, `trichodynia-scalp-pain`, `paresthesia-of-the-scalp`, `why-your-hair-stings`).

## Before pruning anything (410)

**Check for inbound backlinks first.** `OP-02`'s own fix says "301 anything
with backlinks, delete the rest (410)" — this agent's Backlink Audit work
covered referring *domains*, not which specific blog post each one targets,
so that check still needs doing per-URL before executing deletions (via a
funded backlink tool, per `OFF-01`, or Search Console's Links report in
the UI). Don't 410 first and check later.

## What's still a judgment call, not a data call

A few rows were reclassified away from an obvious keyword match because
they're genuinely relevant despite reading like generic content —
`/can-muslims-do-hair-transplants/`, `/headphones-and-hair-loss/`
(traction alopecia), `/best-treatments-for-alopecia-areata-in-islamabad/`,
`/whats-the-best-way-to-treat-bald-spots-in-4c-hair/`. Worth a second look
from someone at the clinic before finalizing — domain-name-style pattern
matching, even careful pattern matching, isn't a substitute for someone
who actually knows the patient questions that come up in consultation.
