-- ============================================================================
-- FDD alignment, Wave 1.3: external stakeholders + sector + strategic
-- programs (docs/FDD-ALIGNMENT.md section 1.1, Fig 11).
--
-- ASSUMED (2026-08-03):
--  * external_stakeholders = free-text chips, stored text[] like tags.
--    Migrates to a join table only if they turn out directory-backed.
--  * sector = its own creatable lookup (unseeded — values typed in-app);
--    category is left untouched (parallel fields are reversible).
--  * strategic_programs cascade under strategic_objectives (Fig 11 order:
--    Objective -> Program), values managed via SQL for now.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, project
-- endpoints 500 (the API selects/joins the new columns).
-- ============================================================================

alter table projects add column if not exists external_stakeholders text[];

create table if not exists sectors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table sectors enable row level security;

create table if not exists strategic_programs (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  objective_id uuid references strategic_objectives(id),
  sort_order   int,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table strategic_programs enable row level security;

alter table projects add column if not exists sector_id            uuid references sectors(id);
alter table projects add column if not exists strategic_program_id uuid references strategic_programs(id);
