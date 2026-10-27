-- ============================================================
-- ROOTLINE — hair-loss progress tracker (consumer app at /tracker)
-- Self-contained: shares Supabase auth with the clinic site but
-- touches none of its tables.
-- ============================================================

-- Monthly check-ins (one per photo session)
CREATE TABLE tracker_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taken_on DATE NOT NULL DEFAULT CURRENT_DATE,
  shedding SMALLINT CHECK (shedding BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX tracker_checkins_user_idx ON tracker_checkins (user_id, taken_on DESC);

-- One photo per standard angle per check-in
CREATE TABLE tracker_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL REFERENCES tracker_checkins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  angle TEXT NOT NULL CHECK (angle IN ('front', 'top', 'crown', 'sides')),
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (checkin_id, angle)
);

-- Treatments the user is on (minoxidil, finasteride, PRP, ...)
CREATE TABLE tracker_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT,
  started_on DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily "I took it" ticks, used for adherence
CREATE TABLE tracker_treatment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID NOT NULL REFERENCES tracker_treatments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_on DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (treatment_id, logged_on)
);

-- Pro subscription state, written only by the Lemon Squeezy webhook
-- (service role). Users can read their own row.
CREATE TABLE tracker_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  variant_id TEXT,
  ls_subscription_id TEXT UNIQUE,
  ls_customer_id TEXT,
  customer_portal_url TEXT,
  renews_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HELPERS (SECURITY DEFINER so they can be used inside RLS
-- policies without recursion; both only ever look at auth.uid())
-- ============================================================
CREATE OR REPLACE FUNCTION tracker_is_pro()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM tracker_subscriptions s
    WHERE s.user_id = auth.uid()
      AND (
        s.status IN ('active', 'on_trial', 'past_due')
        OR (s.status = 'cancelled' AND s.ends_at > NOW())
      )
  );
$$;

CREATE OR REPLACE FUNCTION tracker_checkin_count()
RETURNS INT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::INT FROM tracker_checkins WHERE user_id = auth.uid();
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE tracker_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_treatment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tracker_checkins_select_own" ON tracker_checkins
  FOR SELECT USING (user_id = auth.uid());
-- Free plan: 3 check-ins (keep in sync with FREE_CHECKIN_LIMIT in src/lib/tracker/config.ts)
CREATE POLICY "tracker_checkins_insert_own" ON tracker_checkins
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND (tracker_is_pro() OR tracker_checkin_count() < 3)
  );
CREATE POLICY "tracker_checkins_update_own" ON tracker_checkins
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "tracker_checkins_delete_own" ON tracker_checkins
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "tracker_photos_select_own" ON tracker_photos
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tracker_photos_insert_own" ON tracker_photos
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM tracker_checkins c WHERE c.id = checkin_id AND c.user_id = auth.uid())
  );
CREATE POLICY "tracker_photos_delete_own" ON tracker_photos
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "tracker_treatments_all_own" ON tracker_treatments
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "tracker_treatment_logs_select_own" ON tracker_treatment_logs
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tracker_treatment_logs_insert_own" ON tracker_treatment_logs
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM tracker_treatments t WHERE t.id = treatment_id AND t.user_id = auth.uid())
  );
CREATE POLICY "tracker_treatment_logs_delete_own" ON tracker_treatment_logs
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "tracker_subscriptions_select_own" ON tracker_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- STORAGE — private bucket, files live under <user_id>/...
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tracker-photos', 'tracker-photos', FALSE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "tracker_photos_storage_select_own" ON storage.objects
  FOR SELECT USING (bucket_id = 'tracker-photos' AND (storage.foldername(name))[1] = auth.uid()::TEXT);
CREATE POLICY "tracker_photos_storage_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tracker-photos' AND (storage.foldername(name))[1] = auth.uid()::TEXT);
CREATE POLICY "tracker_photos_storage_delete_own" ON storage.objects
  FOR DELETE USING (bucket_id = 'tracker-photos' AND (storage.foldername(name))[1] = auth.uid()::TEXT);
