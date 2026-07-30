-- ============================================================================
-- FDD alignment: program outcomes (docs/FDD-ALIGNMENT.md section 1.2, Fig 2).
-- Fig 2 groups milestones under numbered outcomes with date ranges. New table
-- plus a nullable FK on milestones (ungrouped milestones stay valid).
-- Run once in the Supabase SQL editor (idempotent). Until it runs, milestone
-- endpoints 500 (the API selects/joins the new column).
-- ============================================================================

create table if not exists program_outcomes (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name       text not null,
  sort_order int,
  start_date date,
  end_date   date,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table program_outcomes enable row level security;

alter table milestones
  add column if not exists outcome_id uuid references program_outcomes(id) on delete set null;
