-- ============================================================
-- ROOTLINE — hardening
-- A photo row may only point at a file inside its owner's own storage
-- folder. Without this, a user could record another user's file path
-- and have it removed when deleting their own account.
-- ============================================================

DELETE FROM tracker_photos WHERE storage_path NOT LIKE user_id::TEXT || '/%';

ALTER TABLE tracker_photos
  ADD CONSTRAINT tracker_photos_path_in_own_folder
  CHECK (storage_path LIKE user_id::TEXT || '/%');
