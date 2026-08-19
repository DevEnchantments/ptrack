-- Let a rejection be told apart from a return (FOLLOW-UPS F3).
-- Run once in the Supabase SQL editor. Idempotent (if not exists).
--
-- !! Rejecting a submission returns 500 until this has been run. !!
--
-- The workflow has five outcomes but only four sets of stamp columns, so
-- reject wrote returned_by/returned_at. Status still recorded WHAT happened,
-- but the audit columns could not say who rejected a submission or when, and a
-- rejection was indistinguishable from a return by timestamp alone.
--
-- Historical rows are left as they are: a submission rejected before this ran
-- keeps its returned_at, and backfilling would invent an audit trail that was
-- never recorded. Rows with status 'rejected' and a null rejected_at are
-- therefore pre-migration by definition.

alter table public.submissions
  add column if not exists rejected_by uuid references public.profiles (id),
  add column if not exists rejected_at timestamptz;
