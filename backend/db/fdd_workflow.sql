-- ============================================================================
-- FDD alignment, Wave 4: workflow cycles + submissions (FR-14, UC-12/13;
-- docs/FDD-ALIGNMENT.md section 1.6).
--
-- ASSUMED (2026-08-03, supervisor question OI-03 unanswered):
--  * Cycles are calendar months (Fig 32 shows 12/yr), auto-created on first
--    submission of the month — no admin UI needed.
--  * Submission states: draft -> review -> validated -> approved, with
--    returned / rejected branches. Cycle-level locked/closed sit on cycles.
--  * Actors per Fig 10: PM submits, PMO Partner validates, Project Owner
--    approves — enforced only when the project person field is set.
--
-- Run once in the Supabase SQL editor (idempotent). The workflow panel and
-- project sections 500 until it runs.
-- ============================================================================

create table if not exists cycles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  period_start date not null,
  period_end   date not null,
  status       text not null default 'open',
  created_at   timestamptz not null default now(),
  unique (period_start, period_end)
);
alter table cycles enable row level security;

create table if not exists submissions (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  cycle_id         uuid not null references cycles(id),
  status           text not null default 'draft',
  comment          text,
  decision_comment text,
  submitted_by     uuid references profiles(id),
  submitted_at     timestamptz,
  validated_by     uuid references profiles(id),
  validated_at     timestamptz,
  approved_by      uuid references profiles(id),
  approved_at      timestamptz,
  returned_by      uuid references profiles(id),
  returned_at      timestamptz,
  created_by       uuid references profiles(id),
  updated_by       uuid references profiles(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (project_id, cycle_id)
);
alter table submissions enable row level security;
