-- ============================================================================
-- FDD alignment, Wave 7.2: KPI module (docs/FDD-ALIGNMENT.md section 1.8,
-- Figs 27-29). Definitions + readings + action plans.
--
-- ASSUMED (2026-08-03): KPIs are an entity-level registry (Fig 27 carries
-- entity/pillar/objective), not per-project. Achievement % and the
-- data-quality index are NOT computed anywhere — those formulas stay gated
-- on supervisor sign-off (docs/FORMULAS.md); storing raw readings needs no
-- formula, so a later sign-off is compute-on-read only.
--
-- Run once in the Supabase SQL editor (idempotent). The KPIs page errors
-- until it runs.
-- ============================================================================

create table if not exists kpis (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  description        text,
  pillar             text,
  entity             text,
  unit               text,
  polarity           text not null default 'higher_is_better',
  decimal_places     int not null default 0,
  data_source        text,
  calculation_method text,
  frequency          text not null default 'monthly',
  rationale          text,
  baseline           numeric,
  target             numeric,
  is_priority        boolean not null default false,
  tier_id            uuid references tiers(id),
  objective_id       uuid references strategic_objectives(id),
  owner_id           uuid references profiles(id),
  created_by         uuid references profiles(id),
  updated_by         uuid references profiles(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table kpis enable row level security;

create table if not exists kpi_readings (
  id                   uuid primary key default gen_random_uuid(),
  kpi_id               uuid not null references kpis(id) on delete cascade,
  reading_date         date not null,
  value                numeric not null,
  performance_analysis text,
  created_by           uuid references profiles(id),
  created_at           timestamptz not null default now()
);
alter table kpi_readings enable row level security;

create table if not exists kpi_action_plans (
  id          uuid primary key default gen_random_uuid(),
  kpi_id      uuid not null references kpis(id) on delete cascade,
  description text not null,
  owner       text,
  due_date    date,
  status      text not null default 'open',
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);
alter table kpi_action_plans enable row level security;
