# TECH-22 — fix the site-wide title-tag bug, step by step

## Likely root cause, check this first

The pattern (H1 reads correctly, but `<title>` shows the raw lowercase
URL slug) points to the WordPress **Post Title** field — the plain-text
field at the very top of the editor, above the Elementor canvas — having
been left as the slug-style text (e.g. `fut-hair-transplant`) instead of
a real title, while the on-page heading was set separately inside
Elementor. Rank Math's title template normally pulls from that same Post
Title field, which is exactly what would produce what's live now.

This matters because it changes where the real fix goes: fixing it in
Rank Math's per-page **SEO Title** field (Step 2 below) overrides
whatever's wrong with the Post Title either way, so do that on every
page regardless. But also fixing the Post Title field itself (Step 1) is
worth doing too, since other things on the site (browser tab titles that
don't go through Rank Math, admin lists, RSS) read from it directly, and
leaving it wrong risks the same bug resurfacing if the SEO Title field
ever gets cleared.

**Changing the Post Title does not change the URL.** The permalink/slug
is a separate field and won't move unless you deliberately edit it — so
this is safe and won't create a redirect problem.

## Step 1 — Fix the WordPress Post Title (root cause)

For each of the 7 pages below:

1. wp-admin → **Pages** (or **Posts**, whichever this page is), find it,
   click **Edit**
2. At the very top of the editor, above the Elementor/content area, find
   the plain **Add title** field
3. Replace whatever's there (the lowercase slug-style text) with the
   proper title from the table below
4. Don't touch the **Permalink** shown just below it — leave the URL
   exactly as-is
5. **Update**

## Step 2 — Set the Rank Math SEO Title explicitly (the fix that sticks)

Do this on every page too, even after Step 1 — it's the belt-and-suspenders
fix, since it overrides the Post Title/template either way:

1. On the same edit screen, scroll down to the **Rank Math SEO** panel
   (below the content editor), or open the Rank Math icon from
   Elementor's own left-hand panel if editing there
2. Click **Edit Snippet**
3. **SEO Title** — paste the exact text from the table below (already
   under the ~60-character guideline)
4. Leave **Meta Description** as whatever the redesign already set,
   unless you're already in there for `OP-03`/content work — this fix is
   scoped to titles only
5. **Update**

## The 7 titles to set

| Page | Current (broken) | Set to |
|---|---|---|
| Homepage `/` | `Dr Rana Irfan - Dr Rana Irfan - Hair Transplant Surgeon` | `Hair Transplant in Islamabad \| Dr. Rana Irfan, ABHRS` |
| `/about/` | `about - Dr Rana Irfan - Hair Transplant Surgeon` | `About Dr. Rana Irfan \| ABHRS Certified Surgeon, Islamabad` |
| `/fue-hair-transplant/` | `fue hair transplant - Dr Rana Irfan - Hair Transplant Surgeon` | `FUE Hair Transplant in Islamabad \| Dr. Rana Irfan` |
| `/fut-hair-transplant/` | `fut-hair-transplant - Dr Rana Irfan - Hair Transplant Surgeon` | `FUT / LSE Hair Transplant in Islamabad \| Dr. Rana Irfan` |
| `/beard-transplant/` | `beard-transplant - Dr Rana Irfan - Hair Transplant Surgeon` | `Beard Transplant in Islamabad \| Dr. Rana Irfan` |
| `/eyebrow-transplant/` | `eyebrow-transplant - Dr Rana Irfan - Hair Transplant Surgeon` | `Eyebrow Transplant in Islamabad \| Dr. Rana Irfan` |
| `/female-hair-losses/` | `female-hair-losses - Dr Rana Irfan - Hair Transplant Surgeon` | `Female Hair Loss Treatment in Islamabad \| Dr. Rana Irfan` |
| `/faq/` | `faq - Dr Rana Irfan - Hair Transplant Surgeon` | `Hair Transplant FAQs - Islamabad \| Dr. Rana Irfan` |

Notes on the homepage title specifically: this is the same fix `OP-06`
already called for, just trimmed to fit the ~60-character guideline —
`OP-06`'s original wording (`Hair Transplant in Islamabad - Dr. Rana
Irfan, ABHRS Certified Surgeon`) runs about 70 characters, long enough to
get truncated in search results. The version above keeps the same
money-keyword-first structure in about 54 characters. Doing this also
closes `OP-06`'s row, not just `TECH-22`'s.

## Step 3 — Check the global title template (prevents this recurring)

Worth five minutes once the 7 pages above are fixed, so new pages don't
inherit the same bug:

1. wp-admin → **Rank Math → Titles & Meta → Pages** (and separately
   **Posts**, if blog posts ever get redesigned too)
2. Check the **Single Page Title** field — it should read something like
   `%title% %sep% %sitename%`, where `%title%` is Rank Math's own
   variable for the formatted title. If it looks different, or if
   `%title%` has been swapped for a slug-based variable, that's the
   actual systemic cause and fixing it here prevents every future edit
   from repeating this bug.
3. If it already looks correct, the bug was specific to how the Post
   Title field got set during this redesign (Step 1's explanation), not
   the template itself — nothing further to do here.

## After fixing

1. Visit each of the 7 URLs in an incognito window and check the browser
   tab / page-source `<title>` directly (view-source, or right-click →
   Inspect) to confirm the new title is live — Rank Math and some caching
   plugins can take a few minutes to reflect a change.
2. If a caching plugin is active (check **Settings** or a plugin named
   WP Rocket/W3 Total Cache/LiteSpeed Cache etc.), clear its cache for
   these 7 URLs specifically, since a stale cached `<title>` would look
   identical to the bug still being present.
3. Mark `TECH-22` and `OP-06` as `Done` in the tracker once confirmed live.

## Status

Drafted and ready. Not applied — needs WordPress/Rank Math access this
agent doesn't have.
