# Bijli Guard

Free electricity bill calculator for all 12 Pakistani distribution companies,
plus a meter-reading tracker that warns households before they cross 200 units.
A fully static site (no server, no database): readings stay in the user's
browser. Earns through Google AdSense.

## Run locally

```bash
cd bijli-guard
npm install
npm run dev      # http://localhost:3000
npm test         # tariff + tracker logic tests
npm run build    # static site in out/
```

## Go live (free hosting on Vercel)

1. Vercel → **Add New → Project** → import this repository again, and set
   **Root Directory** to `bijli-guard`. It's a separate project from the
   clinic site. Framework: Next.js (auto-detected).
2. Buy a domain (about Rs 3,000/year, e.g. a `.pk` or `.com`), add it in this
   project's **Settings → Domains**, then set the variables below and redeploy.
3. Submit `https://<domain>/sitemap.xml` in Google Search Console.
4. After 20–30 days of traffic, apply for Google AdSense with the domain. When
   approved, set the AdSense variables and redeploy. Ads and `/ads.txt`
   switch on automatically.

| Variable | Example | Needed for |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://bijliguard.pk` | Canonical links and sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@bijliguard.pk` | About and privacy pages (AdSense requires a contact) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-1234567890123456` | Ads and `/ads.txt` (after approval) |
| `NEXT_PUBLIC_AD_SLOT_TOP` | `1234567890` | Ad under the tracker |
| `NEXT_PUBLIC_AD_SLOT_CONTENT` | `0987654321` | Ad under the calculators |

## Monthly upkeep (10 minutes)

Rates live in **`src/lib/tariff.ts`**. Each month NEPRA announces a new fuel
charge adjustment (FCA). Update `fca.perUnit` and `fca.label`, bump
`lastReviewed`, and push. Vercel redeploys automatically. When NEPRA notifies
new slab rates, update the slab tables the same way and run `npm test`.

If the government ends the six-month penalty for crossing 200 units, set
`protectedMonths` to `1` (the warning text adjusts automatically).

**Accuracy note:** the slab rates come from S.R.O. 279(I)/2026 as reproduced by
several published summaries. NEPRA's own site couldn't be reached when this was
built, and some summaries disagree. Check the figures against an actual bill or
the official notification before promoting the site. Duty rates marked
`dutyVerified: false` in `src/lib/discos.ts` also need confirming.
