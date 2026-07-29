-- ============================================================================
-- FDD alignment, Stage 1: the "no-decision-needed" Project fields.
-- Source: FDD Fig 11 (Edit Project form), Appendix A (Project object),
-- section 3.3.2 (mandatory-field candidates). See docs/FDD-ALIGNMENT.md.
--
-- Deliberately NOT here (pending supervisor answers): sector, type, status
-- value swap, strategic program, external stakeholders, manager/PMO person
-- fields, manual progress, at-risk.
--
-- utilized_budget is an ordinary editable column for now; FDD section 3.7
-- leaves manual-vs-derived open (our question 8). If the answer is "derived",
-- the API locks it without a schema change.
--
-- Run once in the Supabase SQL editor (idempotent).
-- ============================================================================

-- Two new lookup tables, same shape as the existing ones (id/name/sort_order/
-- is_active) so LookupsService can serve them unchanged.
create table if not exists tiers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table tiers enable row level security;

create table if not exists strategic_objectives (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
alter table strategic_objectives enable row level security;

-- Seeds: only values visible in the FDD screenshots. Tier 1-3 from Fig 1;
-- the one readable strategic objective from Fig 11 (name truncated on screen,
-- seeded with the readable part; correct via admin/SQL once confirmed).
insert into tiers (name, sort_order)
select v.name, v.sort_order
from (values ('Tier 1', 1), ('Tier 2', 2), ('Tier 3', 3)) as v(name, sort_order)
where not exists (select 1 from tiers);

insert into strategic_objectives (name, sort_order)
select '1-Empowered Health Conscious Population', 1
where not exists (select 1 from strategic_objectives);

-- New Project columns (all optional until mandatory rules are confirmed).
alter table projects add column if not exists reference_id            text;
alter table projects add column if not exists project_number          text;
alter table projects add column if not exists plan_year               int;
alter table projects add column if not exists finance_code            text;
alter table projects add column if not exists target_group            text;
alter table projects add column if not exists is_priority             boolean not null default false;
alter table projects add column if not exists approved_budget         numeric;
alter table projects add column if not exists utilized_budget         numeric;
alter table projects add column if not exists internal_stakeholder    text;
alter table projects add column if not exists tier_id                 uuid references tiers(id);
alter table projects add column if not exists strategic_objective_id  uuid references strategic_objectives(id);
