-- KPI ↔ project linkage (decision under the 2026-08-18 delegation): KPIs stay
-- entity-level; an OPTIONAL project link surfaces them on that project's KPI
-- tab. Run once in the Supabase SQL editor. Idempotent.
--
-- !! Until this runs, saving a KPI with a project link fails (unknown
-- !! column); everything else keeps working.

alter table public.kpis
  add column if not exists project_id uuid references public.projects (id) on delete set null;

create index if not exists idx_kpis_project on public.kpis (project_id);
