# OP-01 — Author byline + medical reviewer content

The tracker calls this the **prime suspect for the April 2026 demotion
(-46% impressions)** — YMYL health content with no visible author
attribution is exactly what Google's medical-content systems penalize.
This is drafted content, ready to apply; implementing it site-wide needs
WordPress/Elementor access this agent doesn't have (ideally as a reusable
theme/template block, not pasted into each post by hand — ask whoever
has access whether the theme or Rank Math supports a global author-box
template before resorting to manual edits across hundreds of posts).

Only credentials confirmed in this engagement are used below. Where
something is unconfirmed, it's marked — don't fill it in without checking.

---

## Dr. Rana Irfan — full bio box (use at the bottom of every post he authors)

> **About the Author**
>
> **Dr. Rana Irfan** is a hair restoration surgeon based in Islamabad, Pakistan, with over 25 years of experience in FUE, DHI, and Sapphire FUE hair transplantation. He is an ABHRS Diplomate and the **first non-American to serve as President of the American Board of Hair Restoration Surgery (ABHRS), USA** — he is currently its Immediate Past President. He is also a **Fellow of the International Society of Hair Restoration Surgery (FISHRS)** and **President (2025) of the Hair Restoration Society of Pakistan (HRSP)**.
>
> [ABHRS Profile](https://abhrs.org/directory/listing/rana-irfan-md) · [ISHRS Profile](https://ishrs.org/doctor/594807/) · [IMCAS Profile](https://www.imcas.com/en/profile/dr-rana-irfan-2) · [LinkedIn](https://www.linkedin.com/in/dr-rana-irfan-01806427/) · [Facebook](https://facebook.com/ranairfandr/) · [Instagram](https://instagram.com/hairtransplantisb/) · [X/Twitter](https://x.com/RanaIrfanDr)
>
> **Open question, not resolved here — see note below:** which Instagram handle is actually current.

**Short version (for a "Medically reviewed by" line at the top of a post):**

> Medically reviewed by **Dr. Rana Irfan**, ABHRS Diplomate, Immediate Past President ABHRS · FISHRS · President HRSP

**Update 2026-10-06**: the HRSP presidency and the "first non-American
ABHRS President" detail are now confirmed — the user shared Dr. Irfan's
IMCAS profile (imcas.com/en/profile/dr-rana-irfan-2), which independently
states both. Previously both were withheld pending confirmation; now
included. Still not independently confirmed: a specific procedure count
(25,000+ appeared only in a search-result summary, never a primary
source) — left out, don't add it without a better source.

**LinkedIn and Facebook URLs added** (confirmed via the IMCAS profile's
own icons, exact URLs from the browser status bar): LinkedIn matches a
second independent source found earlier this session, so treat it as
solid. Facebook (`facebook.com/ranairfandr/`) is new information not
seen elsewhere yet.

**Instagram — a real conflict, not resolved**: the IMCAS profile's
Instagram icon points to `doctorranairfan` — the *same* handle `OFF-06`
flagged as the **wrong** one on the live WordPress site (vs. the
"official" `hairtransplantisb` per that row's evidence). Two
possibilities: either `OFF-06`'s "official account" claim needs a second
look, or these are genuinely two different accounts (e.g. a personal vs.
a clinic account) and IMCAS has the personal one. Either way, don't
silently pick one — ask the clinic directly which Instagram is current
before finalizing this in schema or anywhere else. (Also worth knowing:
the IMCAS link itself is technically broken — it's a doubled URL,
`https://www.instagram.com/https://www.instagram.com/doctorranairfan/`
— not something this agent can fix, it's IMCAS's own page, but worth
mentioning if anyone ends up in contact with them about anything else.)

---

## Dr. Uzma Irfan — bio box (placeholder, needs her actual credentials)

The tracker explicitly allows byline-ing posts to either doctor — relevant
for content specifically about female hair loss/restoration, where she's
the more appropriate reviewer. I have almost nothing confirmed about her
individually (only that she's described as "also a qualified hair
restoration surgeon" practicing alongside Dr. Rana Irfan at the clinic) —
**don't publish a bio box for her built on that alone.** Before using this,
get: her specific board certifications/fellowships (if any — ABHRS, ISHRS,
or others), years of experience, and any real profile URLs (society
directory, LinkedIn, etc.) to link as `sameAs`.

> **About the Author**
>
> **Dr. Uzma Irfan** is a hair restoration surgeon at Vagus Surgery Clinic in Islamabad, Pakistan. [Credentials/fellowship/years of experience — CONFIRM before publishing.]
>
> [Profile links — CONFIRM before publishing.]

---

## Applying this across "hundreds of blog posts"

Two different jobs, don't conflate them:
1. **New/edited posts going forward** — straightforward, add the byline +
   bio box to the template.
2. **The existing back-catalog** — this should happen *together* with the
   `OP-02` blog audit (`docs/seo/DrRanaIrfanSEOIssueTracker.xlsx`, tab
   `OP-02 Blog Audit`), not before it. No point adding a careful author
   byline to a page that audit is about to 410 or merge elsewhere — work
   the consolidation first, then add bylines to what's left standing.

## Status

Drafted and ready. Tracker `OP-01` row updated accordingly — still
`Blocked` on actual publication (needs WordPress access), but no longer
blocked on *content*.
