-- ============================================================================
-- FDD alignment: risks module (docs/FDD-ALIGNMENT.md section 1.4, Fig 6).
-- New record type: risk register entries with five lookup tables.
--
-- Score (probability x impact) is deliberately NOT stored: the formula awaits
-- supervisor sign-off (OI-02, docs/FORMULAS.md rule). It will be computed at
-- read time once signed off, so no schema change will be needed.
--
-- SEED VALUES ARE PLACEHOLDERS using standard risk-management sets. The FDD
-- Fig 6 screenshot is too low-res to read the exact LOV values (supervisor
-- question 4 / OI-05). Replace via SQL when confirmed; the app reads whatever
-- is in the tables.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, risk
-- endpoints and the project sections aggregate 500.
-- ============================================================================

create table if not exists risk_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table risk_categories enable row level security;

create table if not exists risk_sources (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table risk_sources enable row level security;

create table if not exists risk_probability_levels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table risk_probability_levels enable row level security;

create table if not exists risk_impact_levels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table risk_impact_levels enable row level security;

create table if not exists risk_responses (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table risk_responses enable row level security;

-- Placeholder seeds (guarded: only when the table is empty).
insert into risk_probability_levels (name, sort_order)
select v.name, v.sort_order
from (values ('Low', 1), ('Medium', 2), ('High', 3)) as v(name, sort_order)
where not exists (select 1 from risk_probability_levels);

insert into risk_impact_levels (name, sort_order)
select v.name, v.sort_order
from (values ('Low', 1), ('Medium', 2), ('High', 3)) as v(name, sort_order)
where not exists (select 1 from risk_impact_levels);

insert into risk_responses (name, sort_order)
select v.name, v.sort_order
from (values ('Avoid', 1), ('Mitigate', 2), ('Transfer', 3), ('Accept', 4)) as v(name, sort_order)
where not exists (select 1 from risk_responses);

insert into risk_sources (name, sort_order)
select v.name, v.sort_order
from (values ('Internal', 1), ('External', 2)) as v(name, sort_order)
where not exists (select 1 from risk_sources);

-- risk_categories: left unseeded (org-specific; create via SQL when known).

create table if not exists risks (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  statement       text not null,
  identified_by   text,
  date_identified date,
  source_id       uuid references risk_sources(id),
  category_id     uuid references risk_categories(id),
  owner_id        uuid references profiles(id),
  probability_id  uuid references risk_probability_levels(id),
  impact_id       uuid references risk_impact_levels(id),
  response_id     uuid references risk_responses(id),
  response_plan   text,
  priority        text,
  action          text,
  status          text not null default 'open',
  type            text not null default 'risk',
  -- FKs required: the API joins profiles!created_by / profiles!updated_by,
  -- and PostgREST resolves those hints through real constraints.
  created_by      uuid references profiles(id),
  updated_by      uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table risks enable row level security;

-- Repair for installs created before the created_by/updated_by FKs existed
-- (idempotent: skipped when the constraints are already present).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'risks_created_by_fkey'
  ) then
    alter table risks
      add constraint risks_created_by_fkey
      foreign key (created_by) references profiles(id);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'risks_updated_by_fkey'
  ) then
    alter table risks
      add constraint risks_updated_by_fkey
      foreign key (updated_by) references profiles(id);
  end if;
end $$;
