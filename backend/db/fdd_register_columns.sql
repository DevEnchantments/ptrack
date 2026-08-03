-- ============================================================================
-- FDD alignment, Wave 1.1: register columns + FDD status values.
-- (docs/FDD-ALIGNMENT.md section 1.1 / Fig 1 register columns.)
--
-- ASSUMED (2026-08-03, proceeding without supervisor confirmation):
--  * manual_progress = user-entered percent (FDD 2.4: "manual" = user-entered).
--  * at_risk = manual toggle for now; becomes formula-suggested in Wave 2.
--  * FDD status values are ADDED alongside the existing demo values (nothing
--    deleted/renamed), using a standard five-value set; exact FDD LOVs are
--    supervisor question 2. Insert is guarded per name, case-insensitive.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, project
-- endpoints 500 (the API selects the new columns).
-- ============================================================================

alter table projects add column if not exists manual_progress numeric;
alter table projects add column if not exists at_risk boolean not null default false;

insert into project_statuses (name, sort_order)
select v.name,
       (select coalesce(max(sort_order), 0) from project_statuses) + v.rn
from (values
  ('Not Started', 1),
  ('In Progress', 2),
  ('On Hold', 3),
  ('Completed', 4),
  ('Cancelled', 5)
) as v(name, rn)
where not exists (
  select 1 from project_statuses p where lower(p.name) = lower(v.name)
);
