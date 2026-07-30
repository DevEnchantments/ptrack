-- ============================================================================
-- FDD alignment: issue-register extensions (docs/FDD-ALIGNMENT.md section 1.5).
-- FDD issue register columns not yet in P-Track: recommendation, reported_by,
-- date_closed. All optional; reported_by is free text (the FDD register shows
-- a name, not a linked user).
-- Run once in the Supabase SQL editor (idempotent). Until it runs, issue
-- endpoints 500 (the API selects these columns).
-- ============================================================================

alter table issues add column if not exists recommendation text;
alter table issues add column if not exists reported_by    text;
alter table issues add column if not exists date_closed    date;
