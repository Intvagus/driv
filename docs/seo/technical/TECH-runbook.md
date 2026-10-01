# Technical SEO runbook — all 20 `Technical SEO` tab items

Written 2026-10-01. **Every item in the tracker's Technical SEO tab was
still "Not Started" when this was written — three weeks after the audit
that found a site compromise whose entry point is still unverified.**
That gap matters more than anything else in this file.

Why this is a document and not more tracker edits like the other tabs got:
almost everything here requires WordPress admin, hosting/cPanel, or FTP
access to execute — none of which this agent has (see `CLAUDE.md`
Capability Matrix, bucket 4). This environment's network policy also
blocks fetching drranairfan.com directly (confirmed 2026-10-01 — `WebFetch`
returned `EGRESS_BLOCKED` for the domain itself, not just third-party
sites), so even read-only checks like "what does robots.txt say" couldn't
be done here. What follows is: what I could verify remotely (via Google
Search Console API access and public `site:` search), and a precise,
ordered checklist for whoever has the access this agent doesn't.

Run this in order. Don't skip to the SEO items (`TECH-06` onward) while
`TECH-01`/`TECH-02` are still undone — a site with an open backdoor can be
reinfected the moment it's cleaned, and every other fix is wasted effort
until the entry point is closed.

---

## Phase 1 — Stop the bleeding (do this today)

### ☐ TECH-01 — Confirm the backdoor is closed (Critical)
Nothing in this session can verify this — it needs direct server/file
access. Checklist for whoever has it:
1. Take a full backup first, before touching anything.
2. Scan with Wordfence or Sucuri (free tiers are enough for a first pass).
3. Check `wp-content/uploads/` for any `.php` files — uploads should never
   contain executable PHP; their presence is close to a smoking gun.
4. Diff `wp-config.php`, `.htaccess`, and the active theme's `functions.php`
   against a known-clean version or backup from before July 2026.
5. Review **Users** in wp-admin for any admin account that shouldn't exist.
6. If no clean entry point can be identified with confidence, restore from
   a pre-July-2026 backup rather than trying to patch around an unknown hole.

### ☐ TECH-02 — Rotate every credential (Critical, Low effort)
Do this regardless of what TECH-01 finds — assume the attacker had write
access and captured whatever was there at the time.
- WordPress admin password(s)
- Hosting/cPanel password
- FTP/SFTP credentials
- Database password
- Regenerate all WordPress salts in `wp-config.php` (forces every existing
  session/cookie to invalidate)

### ☐ TECH-04 — Check Search Console for manual actions / security issues (Critical, Low effort)
**I checked whether this is possible via the Search Console API this
agent has access to — it is not.** `Manual actions` and `Security issues`
are only exposed through the Search Console web UI, not the `searchAnalytics`/
`sitemaps`/`urlInspection` API surface. Someone needs to log into
https://search.google.com/search-console directly and check both reports.
If a manual action exists, **do not file a reconsideration request until
TECH-01/TECH-02 are done and the site is verifiably clean** — filing early
and failing burns a review cycle.

---

## Phase 2 — Remove the ranking surface the attacker used

### ☐ TECH-03 — Noindex tag archives (Critical, Low effort)
Rank Math → Titles & Meta → Taxonomies → Tags → set to noindex.
**Current state, confirmed via public `site:` search (2026-10-01):** the
two specific spam-era URLs (`/tag/smoking/`, `/tag/gene-therapy/`) no
longer appear in a `site:drranairfan.com` search — consistent with the
tracker's note that the spam has dropped out of Google's index naturally.
But tag archives **in general are still indexed** (confirmed — legitimate
ones like `/tag/gluten/`, `/tag/alcohol/`, `/tag/abhrs/` etc. are live in
search results right now), so the underlying surface this fix closes is
still open. This is still worth doing even though the immediate spam is
gone — it's what let it rank in the first place, and it's still thin,
duplicate content.

### ☐ TECH-05 — Verify paginated tag archives are also excluded
Covered by the TECH-03 fix, but confirm paginated URLs
(`/tag/finasteride/page/4/` style) aren't still being crawled/indexed
separately — check Search Console's Pages report after the tag noindex
change has had time to take effect.

### ☐ TECH-14 — Category archives (Medium)
**Confirmed via `site:` search (2026-10-01):** `/category/facial/` is
still indexed and currently shows legitimate content (Hydrafacial/beard
transplant articles, not spam) — but it's exactly the kind of thin
auto-generated archive page the tracker flags. Either noindex categories
the same way as tags, or pick the few that genuinely function as content
hubs and give them real intro copy + curated internal links rather than
leaving them as raw archives.

### ☐ TECH-13 — Index bloat (Medium)
**Partially checked via `site:drranairfan.com` search** rather than the
Search Console Pages report (which needs the UI, not just API access) —
tag and category archives are confirmed still in the index alongside
genuine content pages. A full comparison of indexed-vs-intended page count
still needs the Pages report in Search Console directly.

### ☐ TECH-20 — Spam URL removal (Low)
**Checked via `site:` search (2026-10-01) for the specific spam patterns
named in the audit** (`/tag/smoking`, `/tag/gene-therapy`, and generic
gambling/adult terms) — none currently appear in Google's index for this
domain. This is a good sign but not authoritative; confirm against the
Search Console Removals/Pages report directly before treating this as
closed. If anything does turn up, submit it via Search Console → Removals
only after TECH-01/02 are done.

---

## Phase 3 — Harden against reinfection

### ☐ TECH-09 — `define('DISALLOW_FILE_EDIT', true);` in `wp-config.php`
### ☐ TECH-10 — 2FA on every admin account; remove unused admins; restrict `/wp-admin` by IP where practical
### ☐ TECH-16 — Automated daily offsite backups (30-day retention), auto-updates for core/plugins, a staging environment
### ☐ TECH-17 — Continuous malware scanning (Wordfence/Sucuri) with email alerts, plus uptime monitoring

These four are standard post-incident hardening, all low/medium effort,
all requiring hosting or wp-admin access this agent doesn't have.

---

## Phase 4 — Performance and measurement (only after Phases 1-3)

### ☐ TECH-06 — Hero image is lazy-loaded, delaying LCP
Exclude the hero from the lazy-load optimization plugin; add
`fetchpriority="high"` and `loading="eager"` to that one image.

### ☐ TECH-07 — Core Web Vitals never measured
**Still blocked from this session** — the DataForSEO Lighthouse action
errored on the live site earlier in this engagement
(`ERRORED_DOCUMENT_REQUEST`, likely the host's bot protection) and the
workspace's DataForSEO credits were at zero as of the last check. Until
either is resolved: run PageSpeed Insights manually on the homepage,
`/fue-hair-transplant/`, and `/updated-hair-transplant-prices-in-pakistan/`,
treating mobile LCP as the priority metric, and record the baseline
numbers in the tracker's Notes column for `TECH-07`.

### ☐ TECH-08 — Switch Search Console reporting to the domain property
**Diagnosed precisely this session.** The account has `siteOwner`
permission on the URL-prefix property (`https://drranairfan.com/`) but
only `siteUnverifiedUser` on the domain property (`sc-domain:drranairfan.com`)
— confirmed via `google_search_console.site_list`. That's exactly why
queries against the domain property were failing earlier in this
engagement (HTTP 403) while the URL-prefix property works fine. To
actually fix this: someone with access needs to complete Google's domain
property verification (a DNS TXT record, typically) in Search Console
directly — that's outside what an API call can do.

### ☐ TECH-11 — Verify robots.txt contents
### ☐ TECH-12 — Verify XML sitemap contents, resubmit once clean
**Both blocked from this session** — this environment can't fetch
drranairfan.com directly (confirmed via `WebFetch`:
`EGRESS_BLOCKED`), so even reading these two public files had to be left
for someone with normal browser/terminal access. Once reviewed and the
sitemap confirmed free of spam/tag URLs, resubmitting it in Search Console
is something I can do via the API if asked (`google_search_console.sitemap_submit`)
— that's a live external action though, so per `CLAUDE.md` bucket 2 it
needs your explicit go-ahead when the time comes, not something to do
unprompted.

### ☐ TECH-15 — Elementor/plugin overhead
Audit installed plugins, remove unused ones, enable Elementor's optimized
DOM output and CSS/JS minification, add a caching layer + CDN given the
international patient base.

### ☐ TECH-18 — Connect GA4
No analytics connector is attached in this workspace at all (confirmed —
see `CLAUDE.md` bucket 4). Needs a GA4 property created/shared and
connected before this agent can touch it; connect it to Search Console and
set up conversion events for the consultation form, WhatsApp click, and
phone click once it exists.

### ☐ TECH-19 — Floating WhatsApp click-to-chat
This is about the **live WordPress site**, which has no persistent
WhatsApp CTA. Worth noting: **the Next.js rebuild in this repo already has
this** (`src/components/layout/WhatsAppFAB.tsx`, rendered site-wide) — so
this is only a live-site gap, not something the rebuild needs to add.
Side finding: this row's evidence cites the WhatsApp number as
**+92 332 5017478**, which is different from the phone number
(+92 333 5010042) found in `OFF-07`'s NAP data — worth confirming which
number belongs where before either gets used as the source of truth for
`lib/constants.ts` (`ACTION-PLAN.md` P0 NAP task).

---

## Summary for the tracker

`In Progress` — real diagnostic findings recorded this session, even
though the actual fix is still someone else's to execute: `TECH-03, 04,
05, 08, 13, 14, 19, 20`.

`Blocked` — nothing remotely checkable; needs WordPress/hosting access,
GSC UI access, DataForSEO credits, or a GA4 connection this agent doesn't
have, and no diagnostic progress was possible: `TECH-01, 02, 06, 07, 09,
10, 11, 12, 15, 16, 17, 18`.
