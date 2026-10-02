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
| `/api/tracker/checkout` | Redirects to Lemon Squeezy checkout with the user id attached |
| `/api/tracker/webhook` | Lemon Squeezy webhook → `tracker_subscriptions` |
| `/api/tracker/reminders` | Daily cron: emails users whose check-in is due |
| `/tracker/unsubscribe` | Confirm-to-unsubscribe page linked from every email |

Free plan: 3 check-ins (enforced in the database by RLS). Pro: unlimited
check-ins + report. Prices are set in `src/lib/tracker/config.ts` (display)
and in Lemon Squeezy (actual charge) — keep them matching.

## Launch checklist

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
5. **Env vars** — see `.env.local.example`. `SUPABASE_SERVICE_ROLE_KEY` is
   required by the webhook and the reminder cron.

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

## Next steps worth building

- Wrap as an installable PWA, then App Store / Play Store builds.
- Pakistan launch: local pricing via JazzCash/Easypaisa, Urdu UI, clinic referral program.
