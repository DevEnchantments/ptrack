-- ============================================================================
-- Adds reference_identifier to issues — the free-text external ticket /
-- tracking number shown on the demo's Issue dialog next to Category.
--
-- No history-trigger change: issues have no record_history trigger (they are
-- dialog-only, no History tab). Deletion audit already goes through the
-- service layer.
--
-- Run once in the Supabase SQL editor (idempotent).
-- ============================================================================

alter table issues
  add column if not exists reference_identifier text;
