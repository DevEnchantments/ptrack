-- Security phase, part 2: UI-managed authorization (FDD role 1 —
-- "configure lists, master data, LOVs, roles, workflow parameters").
-- Run once in the Supabase SQL editor. Idempotent. Requires db/app_role.sql.
--
-- !! Until this is run, the backend falls back to the code-seeded defaults
-- !! (identical behavior to before), and the Permissions grid shows an error.
--
-- Design (docs/FDD-ALIGNMENT.md section 8):
--   * The CAPABILITY CATALOG is code (each key maps to guarded routes).
--   * WHICH ROLE HOLDS WHICH capability is this table — editable in
--     Administration -> Users & Roles by anyone holding users.manage_roles.
--   * admin bypasses capability checks entirely (hard-coded), so the system
--     can never be configured into a state nobody can repair.
--   * The per-project view/write/manage ladder stays code — structural, not
--     role policy.

create table if not exists public.role_capabilities (
  id         uuid primary key default gen_random_uuid(),
  role       text not null check (role in ('pmo', 'executive', 'user')),
  capability text not null,
  created_at timestamptz not null default now(),
  unique (role, capability)
);
alter table public.role_capabilities enable row level security;

-- Who changed which role/grant, from what to what. RBAC's paper trail —
-- record_history cannot hold these rows (its project_id is NOT NULL).
create table if not exists public.access_audit (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles (id) on delete set null,
  action     text not null,   -- 'role_changed' | 'grants_replaced'
  target     text not null,   -- user id or role name
  old_value  text,
  new_value  text,
  created_at timestamptz not null default now()
);
alter table public.access_audit enable row level security;

-- Seed = exactly the enforcement shipped 2026-08-17 (behavior unchanged on
-- day one). Mirrored in code as DEFAULT_GRANTS (the fallback when this table
-- is unreadable).
insert into public.role_capabilities (role, capability)
values
  ('pmo', 'projects.create'),
  ('pmo', 'cycles.close'),
  ('pmo', 'kpis.manage'),
  ('pmo', 'templates.instantiate')
on conflict (role, capability) do nothing;
