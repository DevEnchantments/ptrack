-- ============================================================================
-- Project Templates (original-app roadmap, built supervisor-independent
-- 2026-08-11). One table: the structure snapshot (field defaults + outcomes +
-- milestones with day-offset scheduling) lives in a write-once jsonb payload.
--
-- Run once in the Supabase SQL editor (idempotent). The /templates endpoints
-- 500 until this runs; everything else is unaffected.
-- ============================================================================

create table if not exists project_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  payload     jsonb not null,
  created_by  uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
alter table project_templates enable row level security;
