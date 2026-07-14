-- ============================================================================
-- Adds the 'deleted' event to record_history (deletion audit).
--
-- Deletions are written by the NestJS service layer, not the trigger: a DELETE
-- trigger only sees OLD.updated_by — the last editor — while the service knows
-- who actually asked for the deletion.
--
-- Run once in the Supabase SQL editor (idempotent).
-- ============================================================================

alter table record_history
  drop constraint if exists record_history_event_check;

alter table record_history
  add constraint record_history_event_check
  check (event in ('created', 'changed', 'deleted'));
