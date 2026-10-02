# OP-02 — 301 redirects for the 7 duplicate pairs

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

## Not a redirect — a cannibalization issue, flagged separately

`/hair-transplant-cost-in-pakistan/` and `/updated-hair-transplant-prices-in-pakistan/`
compete for the same pricing intent (214 clicks/pos 11 vs 12 clicks/pos
51), but the weaker page is also the parent hub for the city-specific
pricing subpages (Islamabad, Lahore, Karachi, etc.) — redirecting it away
would orphan those. This needs a content decision (which page becomes the
pricing pillar), not a redirect rule. Marked `Needs review` in the
tracker rather than `Merge/301`.

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

Source URL in Rank Math's redirect manager is typically entered as the
relative path (as shown) — it matches against the request path regardless
of domain.

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
```

Back up `.htaccess` before editing it — a broken rule here can take the
entire site down, not just these four URLs.

## Status

Drafted and ready. Tracker (`OP-02 Blog Audit` tab) updated: each winner
marked `Keep`, each loser marked `Merge/301` with this same destination.
Not applied — needs WordPress/hosting access this agent doesn't have.
