-- ============================================================================
-- Milestone dependencies (Gantt arrows, 2026-08-12). ENHANCEMENT beyond the
-- FDD: Appendix A's milestone object has no predecessor concept — added on
-- Fares's direction for MS-Project-style finish-to-start arrows. Informational
-- only: no auto-scheduling (that is a DHTMLX PRO feature and a business rule
-- we have no mandate for).
--
-- source = the predecessor; target = the milestone that depends on it.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, milestone
-- endpoints 500 (the API embeds the new table in its selects).
-- ============================================================================

create table if not exists milestone_dependencies (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  source_id  uuid not null references milestones(id) on delete cascade,
  target_id  uuid not null references milestones(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (source_id, target_id),
  check (source_id <> target_id)
);
alter table milestone_dependencies enable row level security;

create index if not exists milestone_deps_project_idx
  on milestone_dependencies (project_id);
create index if not exists milestone_deps_target_idx
  on milestone_dependencies (target_id);
