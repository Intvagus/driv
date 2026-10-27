-- ============================================================
-- ROOTLINE — clinic referrals
-- Which clinic's link or QR card brought a user in. Set once, when
-- the user's tracker_preferences row is first created.
-- ============================================================

ALTER TABLE tracker_preferences
  ADD COLUMN referred_by TEXT CHECK (referred_by ~ '^[a-z0-9-]{1,40}$');

CREATE INDEX tracker_preferences_referred_by_idx ON tracker_preferences (referred_by)
  WHERE referred_by IS NOT NULL;
