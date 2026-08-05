-- ============================================================================
-- FDD alignment, Wave 6.1: in-app notifications (FDD 3.9; docs/FDD-ALIGNMENT).
--
-- ASSUMED (2026-08-03): channel = in-app first (email needs SMTP infra, an
-- infra decision). Event-driven triggers ship now (workflow transitions +
-- budget threshold at 80% — threshold value is a supervisor question);
-- time-based triggers (milestone overdue, progress reminders) need a
-- scheduler and are deliberately deferred.
--
-- Run once in the Supabase SQL editor (idempotent). The header bell errors
-- until it runs.
-- ============================================================================

create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id),
  project_id uuid references projects(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
alter table notifications enable row level security;

create index if not exists notifications_user_created_idx
  on notifications (user_id, created_at desc);
