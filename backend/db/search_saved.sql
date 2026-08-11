-- ============================================================================
-- Saved searches (global search, from the original-app roadmap — built
-- supervisor-independent 2026-08-11). Per-user named queries re-run from the
-- Ctrl+K palette.
--
-- Run once in the Supabase SQL editor (idempotent). Live search needs no
-- schema; only the saved-search endpoints 500 until this runs.
-- ============================================================================

create table if not exists saved_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  query      text not null,
  created_at timestamptz not null default now()
);
alter table saved_searches enable row level security;

create index if not exists saved_searches_user_idx
  on saved_searches (user_id, created_at desc);
