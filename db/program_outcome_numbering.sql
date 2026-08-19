-- Stop two outcomes in one project sharing a number (FOLLOW-UPS F5).
-- Run once in the Supabase SQL editor. Idempotent (if not exists).
--
-- !! Creating an outcome fails with a 409 on genuine duplicates once this has
--    been run — which is the point. The service retries an auto-assigned
--    number, so only a caller supplying a colliding number sees the error. !!
--
-- Auto-numbering reads the highest number in use and adds one. Two creates
-- landing together read the same value and both write it: the read and the
-- write are not atomic, and no application-side fix closes that. Only the
-- database can say "this number is taken".
--
-- Partial, so outcomes with no number (sort_order null) are unconstrained and
-- any number of them may coexist.

create unique index if not exists program_outcomes_project_sort_order_key
  on public.program_outcomes (project_id, sort_order)
  where sort_order is not null;
