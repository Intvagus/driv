-- ============================================================
-- ROOTLINE — monthly check-in reminder emails
-- A row here marks a user as a tracker user (the clinic site shares
-- auth, so clinic patients must never get tracker emails) and holds
-- their reminder state.
-- ============================================================

CREATE TABLE tracker_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  -- Which check-in cycle the last reminder belonged to: the latest
  -- check-in's date, or 'baseline' before the first check-in.
  reminder_cycle TEXT,
  reminders_in_cycle SMALLINT NOT NULL DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tracker_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tracker_preferences_select_own" ON tracker_preferences
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tracker_preferences_insert_own" ON tracker_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());
-- Users may only flip their own opt-in; reminder bookkeeping columns are
-- written by the cron job with the service role.
CREATE POLICY "tracker_preferences_update_own" ON tracker_preferences
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
REVOKE UPDATE ON tracker_preferences FROM authenticated, anon;
GRANT UPDATE (email_reminders) ON tracker_preferences TO authenticated;
