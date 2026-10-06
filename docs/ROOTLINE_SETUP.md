# Rootline — hair-loss progress tracker

Consumer app for the US/Gulf market, living at `/tracker` in this repo.
It shares Supabase auth with the clinic site but uses only its own
`tracker_*` tables, its own storage bucket and its own branding.

## What's in it

| Route | What it does |
|---|---|
| `/tracker` | Landing page, pricing, FAQ |
| `/tracker/login` | Sign up / sign in / magic link (`?plan=monthly\|yearly` goes straight to checkout after sign-up) |
| `/tracker/app` | Dashboard: next check-in due, plan status, today's treatment ticks, photo timeline |
| `/tracker/app/new` | Guided 4-angle photo check-in (shows last month's photo as a reference) |
| `/tracker/app/compare` | Any two check-ins, side by side or with a slider |
| `/tracker/app/treatments` | Treatments + 30-day adherence |
| `/tracker/app/report` | Printable doctor report (Pro) |
| `/tracker/app/account` | Plan, billing link, reminders, support/legal links, delete account |
| `/tracker/privacy`, `/tracker/terms`, `/tracker/refunds` | Legal pages (linked in the footer and at sign-up) |
| `/tracker/guides`, `/tracker/guides/[slug]` | 5 SEO articles (content in `src/lib/tracker/guides.ts`) |
| `/tracker/clinics` | Page for clinics + QR card maker |
| `/tracker/clinics/card?name=…` | Printable sheet of 10 QR cards (US Letter) |
| `/tracker/r/<code>` | Clinic referral link printed on the cards |
| `/api/tracker/account/delete` | Deletes all of a user's tracker data and photos |
| `/api/tracker/checkout` | Redirects to Lemon Squeezy checkout with the user id attached |
| `/api/tracker/webhook` | Lemon Squeezy webhook → `tracker_subscriptions` |
| `/api/tracker/reminders` | Daily cron: emails users whose check-in is due |
| `/tracker/unsubscribe` | Confirm-to-unsubscribe page linked from every email |
| `/tracker/manifest.webmanifest`, `/tracker/sw.js` | Installable app (PWA), scoped to `/tracker/` |
| `/tracker/offline` | Shown when a page can't load without a connection |
| `/.well-known/assetlinks.json` | Play Store app verification (once configured) |

Free plan: 3 check-ins (enforced in the database by RLS). Pro: unlimited
check-ins + report. Prices are set in `src/lib/tracker/config.ts` (display)
and in Lemon Squeezy (actual charge) — keep them matching.

## Launch checklist

0. **Legal pages** — set `NEXT_PUBLIC_TRACKER_COMPANY_NAME` (your legal
   business or personal name) and `NEXT_PUBLIC_TRACKER_SUPPORT_EMAIL` (an
   inbox you check). The privacy policy, terms and refund policy are
   plain-language templates written for a US consumer health app. **Have a
   lawyer review them before launch**, especially the health-data section.
   If you change the refund window, update `/tracker/refunds` to match what
   you set in Lemon Squeezy. Lemon Squeezy and Google Play both ask for these
   URLs during review:
   - `https://<your-domain>/tracker/privacy`
   - `https://<your-domain>/tracker/terms`
   - `https://<your-domain>/tracker/refunds`
   - Account deletion (Google Play "Data safety"): `https://<your-domain>/tracker/app/account`

1. **Database** — run `supabase/migrations/002_rootline_tracker.sql` in the
   Supabase SQL editor. It creates the tables, RLS policies and the private
   `tracker-photos` bucket.
2. **Supabase Auth** — under Authentication → URL Configuration, add
   `https://<your-domain>/auth/callback` to the redirect URLs.
3. **Lemon Squeezy** (works for sellers based in Pakistan; pays out via bank/Payoneer and handles US sales tax):
   - Create a store and one subscription product with two variants:
     Monthly $4.99 and Yearly $39.
   - For each variant, copy its "Share" checkout link into
     `LEMONSQUEEZY_CHECKOUT_URL_MONTHLY` / `LEMONSQUEEZY_CHECKOUT_URL_YEARLY`.
   - In the product settings set the post-purchase redirect to
     `https://<your-domain>/tracker/app?upgraded=1`.
   - Settings → Webhooks: URL `https://<your-domain>/api/tracker/webhook`,
     choose a signing secret (→ `LEMONSQUEEZY_WEBHOOK_SECRET`), and tick all
     `subscription_*` events.
   - Test the whole flow in Lemon Squeezy test mode before going live.
4. **Reminder emails** — run `supabase/migrations/003_rootline_reminders.sql`.
   In Resend, verify your sending domain (SPF + DKIM, so emails don't land in
   spam) and set `RESEND_API_KEY` and `TRACKER_EMAIL_FROM`. Set `CRON_SECRET`
   to a long random string: Vercel sends it automatically to the cron in
   `vercel.json` (daily at 15:00 UTC ≈ morning in the US). Before going live,
   preview who would be emailed:
   `curl -H "Authorization: Bearer $CRON_SECRET" "https://<your-domain>/api/tracker/reminders?dry=1"`
5. **Clinic referrals**: run `supabase/migrations/004_rootline_referrals.sql`.
6. **Env vars** — see `.env.local.example`. `SUPABASE_SERVICE_ROLE_KEY` is
   required by the webhook and the reminder cron.

## Clinic program

Clinics make their own cards at `/tracker/clinics`: they type the clinic name
and print 10 QR cards on one US Letter sheet (print at 100% scale). Each QR
code opens `/tracker/r/<clinic-code>`, where the code comes from the clinic
name (e.g. `bright-hair-clinic-austin`). That page sets a 90-day cookie, and the
first time the visitor opens the app, `tracker_preferences.referred_by` records
the clinic. Clinics never get access to patient data.

Sign-ups and paying users per clinic (Supabase SQL editor):

```sql
select p.referred_by as clinic,
       count(*) as signups,
       count(s.user_id) filter (where s.status in ('active', 'on_trial')) as paying
from tracker_preferences p
left join tracker_subscriptions s using (user_id)
where p.referred_by is not null
group by 1
order by 2 desc;
```

Only share the counts with a clinic, never names or emails. That's what the
privacy policy promises.

## SEO guides

Five articles live in `src/lib/tracker/guides.ts`. Two need no medical review
(taking progress photos, choosing a tracker app) and are in the sitemap now.
The other three (minoxidil, finasteride, hair transplant timeline) make health
statements. They stay `noindex` and out of the sitemap until a qualified doctor
has reviewed them and you set `NEXT_PUBLIC_TRACKER_MEDICAL_REVIEWER` (e.g.
`Dr. Rana Irfan, FCPS`). The name then shows on each article and in its
structured data. Sources were found by web search but couldn't be opened from
the build session, so the reviewer should check every source link too.

To add an article, append to `GUIDES`. The page, sitemap entry and
"More guides" links are generated from it.

## Account deletion

Users delete everything from the Account page (type DELETE to confirm):
photos, check-ins, treatments, reminder settings and subscription record.
If they're still subscribed, deletion cancels the subscription through the
Lemon Squeezy API when `LEMONSQUEEZY_API_KEY` is set. Otherwise it asks them
to cancel from the billing portal first, so nobody is charged for a deleted
account. Their login is removed too, unless it's also used on the clinic
site (they have clinic bookings or are staff). In that case only the
Rootline data is deleted.

## How reminders work

- Only people who have opened `/tracker/app` get them (clinic patients share
  the same login system and are never emailed).
- No check-in yet: one "take your baseline" email 2 days after joining.
- Afterwards: one email when the monthly check-in is due (30 days after the
  last one) and one follow-up a week later if they still haven't done it.
  Then nothing until they check in again.
- Free users who've used all 3 check-ins get an "upgrade and continue"
  button instead — this is the main path to paid conversions.
- Users can turn reminders off from the dashboard or with the unsubscribe
  link (one-click unsubscribe is supported, as Gmail and Yahoo require).

## Installable app (PWA)

Rootline installs to the home screen and opens full-screen with its own
icon. Android/Chrome users see an "Install app" button on the dashboard;
iPhone users see "tap Share → Add to Home Screen". It only covers
`/tracker/`, so the clinic site is never captured.

The service worker caches only static files (scripts, styles, icons). Pages,
photos and account data are always fetched live and never stored on the
device, so a shared phone doesn't keep someone's photos after they sign out.

Icons are generated by `node scripts/tracker-icons.mjs` (edit the SVG there
to change them). If you change `public/tracker/sw.js`, bump `VERSION` in it
so phones pick up the new version.

### Getting into the Play Store

1. Deploy, then go to <https://www.pwabuilder.com>, enter
   `https://<your-domain>/tracker`, and generate the **Android** package
   (package name e.g. `com.yourdomain.rootline`).
2. PWABuilder gives you a signing key and its SHA-256 fingerprint. Set
   `ANDROID_PACKAGE_NAME` and `ANDROID_SHA256_CERT_FINGERPRINTS` (comma-separated;
   add Google Play's app-signing fingerprint too, from Play Console → App
   integrity), redeploy, and check `/.well-known/assetlinks.json` loads.
3. Upload the `.aab` to Google Play Console ($25 one-time developer fee).
   Health apps must fill in the Health apps declaration and link a privacy policy.

The App Store needs a native wrapper (e.g. Capacitor) and a $99/year Apple
developer account. Apple rejects apps that are "just a website", so do it
once there's traction and a native feature to add, such as camera framing guides.

## Next steps worth building

- Pakistan launch: local pricing via JazzCash/Easypaisa, Urdu UI, clinic referral program.
