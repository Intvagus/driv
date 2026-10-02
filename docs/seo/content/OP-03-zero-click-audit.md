# OP-03 — Zero-click / AI-Overview-absorbed content

`OP-03`'s named examples (`/how-to-stop-hair-growth-on-moles/`,
`/best-haircuts-for-thin-hair/`, `/white-stuff-in-hair-not-dandruff/`)
are already in the `OP-02 Blog Audit` tab with dispositions (two marked
`Prune (410)`, one `Consolidate - low priority`) — nothing new to do on
those three specifically, they're handled.

What this pass adds: `OP-03`'s actual signature — **ranking fine
(position ≤10) but earning almost no clicks at real impression volume**,
the signal that an AI Overview or featured snippet is answering the query
before anyone reaches the page — is a precise, computable pattern, not
just "this topic sounds generic." Ran it across all 250 URLs from the
`OP-02` dataset (impressions ≥ 2,000, position ≤ 10, CTR ≤ 1.5%).

## 59 URLs match the pattern

The large majority are already covered by `OP-02`'s prune/consolidate
recommendations — good cross-validation that those calls were right, not
new work. Full list isn't repeated here; cross-reference the `OP-02 Blog
Audit` tab by URL if useful.

## What's new: 6 of the 59 are pages marked `Keep`

These are pages `OP-02` kept because they're legitimately on-topic — but
being on-topic doesn't exempt a page from the zero-click problem, and
"keep as-is" isn't actually the right instruction for these six. They
need active rewriting to compete with AI Overviews, not passive retention.

| URL | Impressions (90d) | Clicks | CTR | Position | Why it was kept |
|---|---|---|---|---|---|
| `/can-hair-grow-back-after-thinning/` | 16,669 | **4** | **0.02%** | 5.2 | Core candidacy question |
| `/hair-prp-price-in-pakistan/` | 17,373 | 130 | 0.75% | 8.1 | Core commercial/pricing page |
| `/scalp-exercises-expert-guide/scalp-stretching-exercises/` | 6,893 | 9 | 0.13% | 5.9 | Post-op care |
| `/scalp-reduction-surgery/` | 3,006 | 32 | 1.06% | 8.1 | Core procedure page |
| `/scalp-exercises-expert-guide/scalp-stitches-and-exercise/` | 5,960 | 81 | 1.36% | 5.7 | Post-op care |
| `/pimples-on-the-donor-area-after-hair-transplant/` | 2,033 | 16 | 0.79% | 8.5 | Post-op care (also the surviving page in one of the duplicate redirects) |

**`/can-hair-grow-back-after-thinning/` is the worst case on the entire
site**: position 5.2 — genuinely good ranking — and 16,669 impressions,
but only 4 clicks in 90 days. That's not a ranking problem, it's a "the
answer box already told them" problem. Fixing this isn't about ranking
higher; it's about giving someone a reason to click through even when
they already have a one-line answer — a photo, a tool, a specific next
step a snippet can't contain.

### What actually fixes a zero-click page (not just this site — AI
Overviews absorb pure definitional answers by design)

- Lead the page with something a snippet can't reproduce: a before/after
  photo, an interactive element (like the existing `/graft-calculator/`,
  which is *not* on this zero-click list despite similar topic adjacency —
  worth noting as the internal model to copy), a specific price or
  timeline.
- Add a clear next step above the fold — a booking CTA, a WhatsApp link —
  so the 1-in-1000 visitor who does click has something to do immediately.
- For `/can-hair-grow-back-after-thinning/` specifically: reframe from
  "can hair grow back" (purely definitional, AI answers it in one
  sentence) toward "is MY hair loss reversible" — a self-assessment
  angle (Norwood stage, a short quiz, "book a free consultation to find
  out") that a generic AI answer genuinely can't replace.

Priority order: the 3 core/commercial rows first
(`can-hair-grow-back-after-thinning`, `hair-prp-price-in-pakistan`,
`scalp-reduction-surgery`) — these sit closest to the booking decision.
The 3 post-op care pages are lower priority; they serve existing
patients post-surgery more than they drive new leads.

## The other half of `OP-03`'s fix: redirect effort toward commercial/medical-tourism intent

`OP-03` doesn't just say stop writing definitional content — it says
redirect that effort toward content *AI Overviews can't replace the
click for*: commercial and medical-tourism intent. Two gaps already
named elsewhere in this tracker are exactly that:

- **`OP-04`** — no dedicated International Patients hub, despite ~90% of
  patients traveling from abroad. This is inherently non-definitional
  (visa logistics, accommodation, day-by-day timelines, country-specific
  cost comparisons) — not something a one-line AI answer satisfies.
- **`OP-10`** — no definitive page for the IFI technique, the clinic's
  own proprietary, eponymous method. Nobody else can write this page;
  it's the opposite of commodity definitional content.

Recommend treating `OP-04`/`OP-10` as where the editorial time freed up
by `OP-02`'s pruning goes next, rather than more "does X cause hair
loss" posts.

## Status

Analysis complete. `OP-03`'s named examples: handled via `OP-02`. The 6
"Keep but zero-click" pages: flagged with rewrite direction, not yet
rewritten — needs WordPress access and, for the reframing work, input
from the clinic on what a real self-assessment/next-step should look
like.
