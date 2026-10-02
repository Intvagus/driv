# OP-03 — step-by-step fix for the 6 zero-click pages

Two separate things fix a zero-click page, and you need both:
1. **The search-result snippet itself** (SEO Title + Meta Description, via
   Rank Math) — this is what competes with an AI Overview for the click
   in the first place. Rewritten to promise something personal/specific
   that a generic AI answer can't give.
2. **On-page content**, added near the top — for the rare visitor who
   does click through, something to do immediately (not a wall of text).

Do **not** rewrite the existing page content from scratch — these pages
already rank well (that's not the problem), so keep what's there and
**add** the new section above or right after the intro. Rewriting
wholesale risks losing the ranking you already have.

---

## Priority 1: `/can-hair-grow-back-after-thinning/`

Worst case on the site: position 5.2, but 0.02% CTR (4 clicks from
16,669 impressions in 90 days).

### Step 1 — Fix the search snippet (Rank Math)

1. wp-admin → **Posts**, find this post, click **Edit**
2. Scroll down to the **Rank Math SEO** panel (below the content editor)
3. Click **Edit Snippet** (or the General tab if it opens directly)
4. **SEO Title** — replace with:
   ```
   Is Hair Loss Reversible? Find Your Norwood Stage
   ```
5. **Meta Description** — replace with:
   ```
   Hair regrowth depends on your Norwood stage and how long you've been thinning. Get a free trichoscopic assessment from ABHRS-certified Dr. Rana Irfan to find out.
   ```
6. Save/Update the post.

### Step 2 — Add a self-assessment box near the top

In the content editor (block editor or Elementor, whichever this post
uses), add this as a new block **right after the opening paragraph**,
before the existing generic explanation:

> **Find Out If Your Hair Loss Is Reversible**
>
> Whether your hair grows back depends on your Norwood stage and how long you've been losing hair — not something a generic answer can tell you. The only way to know for certain is a trichoscopic assessment.
>
> **[Book Your Free Consultation]** → link to your existing `/consultation` or `/book` page

If this post is built in **Elementor**: click **Edit with Elementor**
instead of the plain editor, add a new Text/Heading widget in that
position, and a Button widget for the CTA linking to your booking page.

---

## Priority 2: `/hair-prp-price-in-pakistan/`

Position 8.1, 0.75% CTR — a pricing page that should convert much better
than it does.

**SEO Title:**
```
PRP Hair Treatment Cost in Pakistan (2026 Pricing)
```

**Meta Description:**
```
PRP hair treatment pricing in Pakistan, explained. See real cost ranges and book a free consultation with ABHRS-certified Dr. Rana Irfan in Islamabad.
```

**On-page addition** (near the top, before the detailed pricing breakdown):

> **Get Your Personalized PRP Quote**
>
> PRP pricing depends on the number of sessions and whether it's combined with other treatments. For an exact quote based on your hair loss stage, book a free consultation.
>
> **[Book Your Free Consultation]**

---

## Priority 3: `/scalp-reduction-surgery/`

Position 8.1, 1.06% CTR.

**SEO Title:**
```
Scalp Reduction Surgery in Islamabad – Candidacy & Cost
```

**Meta Description:**
```
Is scalp reduction right for you? Dr. Rana Irfan, ABHRS-certified surgeon, explains candidacy, technique, and recovery. Free consultation available.
```

**On-page addition** (near the top):

> **Is Scalp Reduction Right for You?**
>
> Candidacy depends on scalp laxity, donor density, and your hair loss pattern — best assessed in person. Book a free consultation to find out.
>
> **[Book Your Free Consultation]**

---

## Lower priority: the 3 post-op care pages

`/scalp-exercises-expert-guide/scalp-stretching-exercises/`,
`/scalp-exercises-expert-guide/scalp-stitches-and-exercise/`,
`/pimples-on-the-donor-area-after-hair-transplant/` — these serve
existing patients recovering from surgery more than they drive new
leads, so they're lower priority. When you get to them, the same
two-step pattern applies, but the CTA should point toward your post-op
support channel (WhatsApp follow-up, per `OFF-05`) rather than a new
consultation — these readers have usually already had the procedure.

---

## After each page is updated

Give it 1-2 weeks, then re-check its clicks/impressions/CTR in Search
Console. If CTR is still flat, the snippet change isn't landing — try a
different angle in the title before touching the on-page content again.
