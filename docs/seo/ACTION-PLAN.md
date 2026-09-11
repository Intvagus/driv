# SEO Action Plan — drranairfan.com rebuild

Living backlog. Check items off in place; when a priority tier is fully
done, move it to "Completed" at the bottom with the date. Re-prioritize
whenever a new dated audit lands in this folder.

Priority = business impact × search opportunity × technical impact × lead-gen
potential, weighed against effort. **Bucket** refers to the capability
matrix in `CLAUDE.md` (1 = can do automatically, 2 = needs your approval,
3 = can recommend only, 4 = not currently possible).

## P0 — Before this codebase ever goes live

Nothing here is "nice to have." Getting these wrong loses the local-pack
ranking and reviews the WordPress site already earned (see AUDIT §1).

| Task | Bucket | Effort | Notes |
|---|---|---|---|
| Decide and document the migration/cutover plan: freeze the WordPress URL list, map every WP URL → new Next.js URL, write 301 redirects for anything that changes | 2 | M | This needs your decision on final URL structure, not just mine. I can generate the redirect map once you confirm slugs. |
| Fill in real NAP data (`CLINIC_PHONE`, `CLINIC_EMAIL`, `CLINIC_ADDRESS`, `WHATSAPP_NUMBER`) in `lib/constants.ts` — must exactly match the Google Business Profile | 2 | S | Placeholder TODOs today; I can't invent real business data |
| Re-authorize the Google Search Console connection (currently 403) | 2 | S | You'll need to run `connect_account` / reauthorize in the Porter/Search Console tool — I can't grant myself broader access |
| Top up or confirm the DataForSEO/Porter credit balance if you want automated keyword/competitor/CWV research to keep running | 2 | S | Currently `NO_BALANCE` |
| On cutover day: submit the new sitemap in GSC, use URL Inspection to request indexing on key pages, and monitor Search Console's Change of Address / coverage reports for a spike in 404s or dropped impressions | 2 | S | I can run the submission/inspection calls once GSC access is restored and you approve going live |

## P1 — High impact, can start now, in-repo only

| Task | Category | Bucket | Effort |
|---|---|---|---|
| Wire `/blog` and `/blog/[slug]` to the real `blog_posts` Supabase table (status=published, ordered by `published_at`), replacing the single hardcoded post | Content/Keyword | 1 | M |
| Add JSON-LD structured data: `MedicalBusiness`/`MedicalClinic` + `Physician` on the homepage/about, `MedicalProcedure` on each procedure page, `FAQPage` on `/faqs`, `BreadcrumbList` site-wide, `BlogPosting` on blog posts | Schema | 1 | M |
| Add `alternates.canonical` to every page's metadata, and give the root `openGraph`/`twitter` blocks a real default share image | Technical/On-page | 1 | S |
| Rewrite title templates to stay under ~60 chars and descriptions under ~155, per page type (procedure, condition, blog) | On-page | 1 | S |
| Fix the two dead footer links: either build `/privacy` and `/terms` (needed anyway — the site collects PII in `consultation_leads`/`bookings`) or remove the links until they exist | Technical / Trust | 1 | S |
| Replace `href="#"` social links in the footer with the real profile URLs once you provide them, and add them as `sameAs` in the `Physician`/`MedicalBusiness` schema | Off-page / Entity | 2 | S |
| Build internal linking: related-procedures block on each procedure page, related-conditions ↔ procedures cross-links, contextual links from blog posts to the procedure/condition pages they discuss | Internal linking | 1 | M |
| Wire GA4 (once you create/share a property) for goal tracking on the actual conversion events: `consultation_leads` insert, `bookings` insert, WhatsApp click | Content/Keyword, measurement | 2 | M |

## P2 — High impact, needs real assets or external access

| Task | Category | Bucket | Effort |
|---|---|---|---|
| Real photography/video: doctor portrait, clinic photos, consented before/after galleries, procedure walkthroughs — replace every gradient placeholder | Image/Video SEO | 3 | L — needs a shoot, not code |
| Once real images exist: convert to `next/image`, write descriptive alt text per image (procedure + angle + technique, not generic "before/after"), serve via Supabase storage `gallery`/`blog-images` buckets already defined in the schema | Image/Video SEO | 1 | M |
| Local SEO: verify/complete the Google Business Profile (categories, services list, Q&A seeding, photo uploads, review response cadence) | Local SEO | 3 | — no GBP connector available; needs manual GBP admin access |
| Build a `LocalBusiness`/`MedicalClinic` schema block with real geo-coordinates, opening hours, and `sameAs` once NAP + socials are final | Local SEO / Schema | 1 | S (blocked on P0 NAP task) |
| Competitor content-gap analysis (Royce Clinic, HairnHair, JJ Aesthetics — the local-pack competitors found in this audit) to pick blog topics with real search demand | Content/Keyword | 2 | M — DataForSEO action, costs credits |
| Full technical site crawl of the live WordPress site before decommissioning it, to make sure the redirect map (P0) has 100% URL coverage | Technical | 1 (once credits restored) | M |

## P3 — Ongoing / ranking-maintenance work, once live

| Task | Category | Bucket |
|---|---|---|
| Monthly: re-pull GSC query/page performance, track click/impression/position trend per procedure/condition page | Content/Keyword | 1 |
| Quarterly: re-run local-pack tracking for the head terms (`hair transplant islamabad`, `FUE hair transplant islamabad`, `DHI hair transplant pakistan`, etc.) | Local SEO | 1 (costs credits) |
| Ongoing: expand FAQ content and structure it for AEO/GEO — direct, quotable, source-attributed answers to the questions people actually type into ChatGPT/Gemini/Perplexity as well as Google ("how much does a hair transplant cost in Islamabad", "FUE vs DHI which is better") | AEO/GEO, Content | 1 |
| Ongoing: build topical authority — a real content cluster per condition (male pattern baldness, alopecia areata, etc.) linking out to the procedures that treat it and in from the blog | Entity/Topic authority | 1 |
| Off-page: legitimate backlink building — medical directories (PMDC-recognized), guest contributions to PK health/lifestyle publications, patient testimonial video partnerships | Off-page | 3 — relationship-based, not something I can execute directly |
| Recurring Core Web Vitals check via PageSpeed Insights (manual, until Lighthouse-via-API access is confirmed working) | CWV/Performance | 3 |

## What I will *not* do, ever, regardless of priority

- Fabricate reviews, testimonials, credentials, or before/after results.
- Generate fake schema data (ratings, review counts, prices) that doesn't
  reflect reality.
- Keyword-stuff, cloak content, buy links, or use PBNs/link farms.
- Auto-publish AI-written medical content without a clear "reviewed by Dr.
  Rana Irfan" pass — this is a YMYL (health) site.
- Deploy to production or change DNS/hosting without explicit approval.

## Completed

*(nothing yet — this plan was created 2026-09-11)*
