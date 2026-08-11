-- ============================================================================
-- Pending-member email (account provisioning, 2026-08-11). The linking key
-- for turning placeholder people into real accounts: provisioning (or a
-- user's first login) claims pending memberships whose pending_email matches.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, the
-- people endpoints 500 (the API selects the new column).
-- ============================================================================

alter table project_members
  add column if not exists pending_email text;
