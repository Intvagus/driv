# OP-02 — 301 redirects for the 7 duplicate pairs + 1 cannibalization fix

Ready to apply once the content-merge step is done — **not before.** A
301 moves the URL's authority, not its text; whatever's only on the page
being retired needs to be copied into the winner manually first, or it's
just gone. Checklist per pair:

1. Open both posts, copy anything genuinely unique from the loser into the winner.
2. Apply the redirect (either method below).
3. Visit the old URL in a private/incognito window and confirm it lands on
   the new one with a single hop (not a chain, not a loop).
4. Update any internal links on the site that still point to the old URL
   to point directly at the new one instead (don't rely on the redirect
   for internal links — it works, but it's an avoidable extra hop).

## The 7 redirects

The first 4 were found in the initial OP-02 audit; the last 3 were found
in a follow-up systematic pairwise scan across all 250 URLs (the first
pass only spot-checked within topic clusters, not across them — these 3
are the same topic published twice under *different* URL structures:
standalone vs. nested inside a guide series, which doesn't stand out the
way a `-2` suffix does).

| Redirect this (loser) | To this (winner) | Why |
|---|---|---|
| `/can-low-blood-pressure-cause-hair-loss/` | `/low-blood-pressure-and-hair-loss/` | 79 clicks/90d vs 8, position 10.1 vs 22.8 |
| `/does-hair-weigh-anything/` | `/how-much-does-hair-weigh/` | 48 clicks/90d vs 36, better position (6.1 vs 7.1) |
| `/title-can-progesterone-cause-hair-loss/` | `/progesterone-female-hair-loss/` | 15 clicks/90d vs 6; loser's slug still has a leftover "title-" prefix from a bad import |
| `/does-zyn-cause-hair-loss/` | `/does-zyn-cause-hair-loss-2/` | 50 clicks/90d vs 25 — the "-2" URL is the stronger one despite the uglier slug; don't rename it, that just creates another redirect to manage |
| `/hair-transplant-cost-in-islamabad/` | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-islamabad/` | Same topic, standalone vs nested under the pricing hub. Nested wins: 35 clicks/90d vs 4, position 30 vs 57 |
| `/hair-transplant-donor-area-complete-guide/pimples-on-donor-area-after-hair-transplant/` | `/pimples-on-the-donor-area-after-hair-transplant/` | Same topic, nearly identical title, nested in a guide series vs standalone. Standalone wins: 16 clicks/90d vs 3 |
| `/foods-that-increase-dht/` | `/foods-that-increase-dht-production/` | Near-identical diet/DHT content. Winner: 64 clicks/90d vs 23, position 11.4 vs 22.2 |

## Resolved — the pricing-page cannibalization

`/hair-transplant-cost-in-pakistan/` and `/updated-hair-transplant-prices-in-pakistan/`
compete for the same pricing intent (12 clicks/pos 51 vs 214 clicks/pos
11). Originally flagged as a judgment call rather than a straight
redirect, because the weaker page is the parent hub for 12 city-specific
pricing subpages — resolved as follows:

**Redirect 8**
- Source URL: `/hair-transplant-cost-in-pakistan/`
- Destination URL: `/updated-hair-transplant-prices-in-pakistan/`

**Why this direction, and why it's safe:** a Rank Math redirect set to
**Exact** match (as used throughout this doc) only intercepts requests to
that one literal URL — it does not prefix-match, so none of the 12 nested
city pages (`.../hair-transplant-cost-in-multan/` etc.) are affected by
redirecting the hub URL itself. They stay exactly where they are, with
their own URLs unchanged. The direction (hub → updated-prices page, not
the reverse) follows `OP-09`'s own recommended fix, which already treats
`/updated-hair-transplant-prices-in-pakistan/` as the canonical pricing
page worth linking to from the homepage — that's a stronger signal than
just picking whichever page currently ranks better.

**Before applying:** check `/hair-transplant-cost-in-pakistan/`'s content
for anything (a pricing table, an FAQ section) not already on
`/updated-hair-transplant-prices-in-pakistan/`, and copy it over first —
same rule as every other redirect on this page.

**Required follow-up, not optional:** `/updated-hair-transplant-prices-in-pakistan/`
needs internal links added to all 12 city subpages — they're currently
only reachable via the hub page that's about to redirect away. Add a
section (e.g. "Hair Transplant Cost by City") linking each:

| City | Link to |
|---|---|
| Islamabad | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-islamabad/` |
| Multan | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-multan/` |
| Faisalabad | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-faisalabad/` |
| Gujranwala | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-gujranwala/` |
| Rawalpindi | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-rawalpindi/` |
| Peshawar | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-peshawar/` |
| Gujrat | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-gujrat/` |
| Hyderabad | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-hyderabad/` |
| Quetta | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-quetta/` |
| Karachi | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-karachi/` |
| Bahawalpur | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-bahawalpur/` |
| Lahore | `/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-lahore-pakistan/` |

Two of these are worth a second look while you're in there: **Lahore**
pulls 3,438 impressions but sits at position 59.5 (worst of the twelve
despite high demand — something's underperforming on that page relative
to its visibility), and **Karachi** similarly has 2,890 impressions at
position 44.5. Both look like they'd benefit from the same kind of
content attention the pricing pillar itself is getting.

---

## Option A (recommended) — Rank Math's Redirections module

Rank Math is already installed on this site (confirmed throughout this
audit), and it has a built-in redirect manager — safer than editing
`.htaccess` by hand, since a typo there can break the whole site, and
Rank Math's redirects are visible/editable/reversible from wp-admin.

**wp-admin → Rank Math SEO → Redirections → Add New**, one entry per row:

| Source URLs | Destination URL | Redirection Type |
|---|---|---|
| `/can-low-blood-pressure-cause-hair-loss/` | `https://drranairfan.com/low-blood-pressure-and-hair-loss/` | 301 Permanent Redirect |
| `/does-hair-weigh-anything/` | `https://drranairfan.com/how-much-does-hair-weigh/` | 301 Permanent Redirect |
| `/title-can-progesterone-cause-hair-loss/` | `https://drranairfan.com/progesterone-female-hair-loss/` | 301 Permanent Redirect |
| `/does-zyn-cause-hair-loss/` | `https://drranairfan.com/does-zyn-cause-hair-loss-2/` | 301 Permanent Redirect |
| `/hair-transplant-cost-in-islamabad/` | `https://drranairfan.com/hair-transplant-cost-in-pakistan/hair-transplant-cost-in-islamabad/` | 301 Permanent Redirect |
| `/hair-transplant-donor-area-complete-guide/pimples-on-donor-area-after-hair-transplant/` | `https://drranairfan.com/pimples-on-the-donor-area-after-hair-transplant/` | 301 Permanent Redirect |
| `/foods-that-increase-dht/` | `https://drranairfan.com/foods-that-increase-dht-production/` | 301 Permanent Redirect |
| `/hair-transplant-cost-in-pakistan/` | `https://drranairfan.com/updated-hair-transplant-prices-in-pakistan/` | 301 Permanent Redirect |

Source URL in Rank Math's redirect manager is typically entered as the
relative path (as shown) — it matches against the request path regardless
of domain.

**One of these needs extra care:** for `/hair-transplant-cost-in-pakistan/`
(redirect 8), double-check the match-type dropdown is set to **Exact**,
not Contains or any prefix-style match. Exact is the default and is
correct for all 8 of these — but if it ever got switched to something
broader on this particular row, it would also catch and redirect the 12
city subpages nested under it, which is exactly what this fix is
designed to avoid.

## Option B (fallback) — raw `.htaccess`

If the Redirections module isn't enabled, or a server-level redirect is
preferred for performance (skips loading WordPress entirely for these
URLs), add this **above** the `# BEGIN WordPress` block in `.htaccess`
(rules below that block can get intercepted by WordPress's own catch-all
rewrite first):

```apache
RewriteEngine On
RewriteRule ^can-low-blood-pressure-cause-hair-loss/?$ /low-blood-pressure-and-hair-loss/ [R=301,L]
RewriteRule ^does-hair-weigh-anything/?$ /how-much-does-hair-weigh/ [R=301,L]
RewriteRule ^title-can-progesterone-cause-hair-loss/?$ /progesterone-female-hair-loss/ [R=301,L]
RewriteRule ^does-zyn-cause-hair-loss/?$ /does-zyn-cause-hair-loss-2/ [R=301,L]
RewriteRule ^hair-transplant-cost-in-islamabad/?$ /hair-transplant-cost-in-pakistan/hair-transplant-cost-in-islamabad/ [R=301,L]
RewriteRule ^hair-transplant-donor-area-complete-guide/pimples-on-donor-area-after-hair-transplant/?$ /pimples-on-the-donor-area-after-hair-transplant/ [R=301,L]
RewriteRule ^foods-that-increase-dht/?$ /foods-that-increase-dht-production/ [R=301,L]
RewriteRule ^hair-transplant-cost-in-pakistan/?$ /updated-hair-transplant-prices-in-pakistan/ [R=301,L]
```

**Note for redirect 8 in this format specifically:** the `$` anchor at the
end of the pattern is what keeps this scoped to the exact URL — it means
"end of string here." Without it, this rule would also match and redirect
every nested city subpage (`hair-transplant-cost-in-pakistan/hair-transplant-cost-in-multan/`
etc.), which is exactly what it must not do. Leave the `$` in place.

Back up `.htaccess` before editing it — a broken rule here can take the
entire site down, not just these eight URLs.

## Status

Drafted and ready. Tracker (`OP-02 Blog Audit` tab) updated: each winner
marked `Keep`/`Keep & strengthen`, each loser marked `Merge/301` with its
destination. Not applied — needs WordPress/hosting access this agent
doesn't have, and the internal-linking follow-up for redirect 8 is real
content work, not just a redirect rule.
