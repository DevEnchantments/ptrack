-- =============================================================
-- P-Track (rebuild) — Phase 1 Schema: Data Collection
-- Target: Supabase / PostgreSQL
--
-- Scope: the core project record + the nine record types that
-- attach to it. Fresh design (not bound to the legacy EBA_PROJ_*
-- structure).
--
-- Conventions:
--   * UUID primary keys (gen_random_uuid()).
--   * created_at / updated_at on every main table; updated_at is
--     maintained by a trigger.
--   * created_by / updated_by reference profiles(id) — audit
--     foundation for the later security/audit phase.
--   * Categorized fields use lookup tables (configurable "code
--     tables"), matching P-Track's config-driven design.
--   * Row-Level Security is intentionally NOT enabled here:
--     authorization is enforced in the NestJS backend layer.
--     RLS is a hardening step for the security phase.
-- =============================================================

-- ------------------------------------------------------------
-- 0. Helper: auto-update updated_at
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- 1. Profiles (application user record; extends Supabase auth.users)
--    Populate via a trigger on auth.users, or from the backend on
--    first login.
-- ------------------------------------------------------------
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated
  before update on profiles
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 2. Lookup / code tables
-- ------------------------------------------------------------

-- Project-level lookups
create table project_statuses (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,          -- e.g. On Track, At Risk, Off Track
  color      text,                          -- optional RAG colour
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

create table project_sizes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- User-creatable project categories (sort_order optional here).
create table project_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table deal_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

create table regions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

create table countries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  iso_code   text,
  region_id  uuid references regions (id) on delete set null,
  is_active  boolean not null default true
);

-- People lookups
create table project_roles (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null unique,   -- e.g. Owner, Team Member, Sponsor
  sort_order           int  not null default 0,
  is_active            boolean not null default true,
  default_access_level text not null default 'read_only'
                         check (default_access_level in ('read_only','read_write','read_write_admin'))
);

create table involvement_levels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,          -- e.g. High, Medium, Low
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- Action item lookups
create table action_item_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- Issue lookups
create table issue_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

create table issue_levels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,          -- e.g. Low, Medium, High, Critical
  rank       int  not null default 0,       -- severity ordering
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- Resource lookups
create table resource_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- Update lookups
create table update_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

create table update_classes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int  not null default 0,
  is_active  boolean not null default true
);

-- ------------------------------------------------------------
-- 3. Projects (core entity)
-- ------------------------------------------------------------
create table projects (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  owner_id        uuid references profiles (id) on delete set null,
  sponsor         text,                       -- free text; swap to FK if sponsors are users
  status_id       uuid references project_statuses (id) on delete restrict,
  size_id         uuid references project_sizes (id)    on delete restrict,
  deal_type_id    uuid references deal_types (id)       on delete restrict,
  region_id       uuid references regions (id)          on delete restrict,
  country_id      uuid references countries (id)        on delete restrict,
  start_date      date,
  target_end_date date,
  actual_end_date date,
  parent_project_id uuid references projects (id)          on delete set null,
  category_id     uuid references project_categories (id)  on delete set null,
  goal            text,
  customer        text,
  tags            text[],
  primary_url     text,
  access_control  text not null default 'open'
                    check (access_control in ('open','restricted')),
  created_by      uuid references profiles (id) on delete set null,
  updated_by      uuid references profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger trg_projects_updated
  before update on projects
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 4. Project People  (users assigned to / watching a project)
-- ------------------------------------------------------------
create table project_members (
  id                   uuid primary key default gen_random_uuid(),
  project_id           uuid not null references projects (id) on delete cascade,
  user_id              uuid references profiles (id) on delete cascade,   -- null for pending (not-yet-registered) members
  pending_name         text,                                              -- display name while user_id is null
  role_id              uuid references project_roles (id)       on delete set null,
  involvement_level_id uuid references involvement_levels (id)  on delete set null,
  access_type          text not null default 'assigned'
                         check (access_type in ('assigned','viewer')),    -- "is assigned" vs "can see"
  access_level         text not null default 'read_only'
                         check (access_level in ('read_only','read_write','read_write_admin')),
  status               text not null default 'active'
                         check (status in ('active','pending')),
  notes                text,
  created_by           uuid references profiles (id) on delete set null,
  updated_by           uuid references profiles (id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (user_id is not null or pending_name is not null),
  unique (project_id, user_id)
);
create trigger trg_project_members_updated
  before update on project_members
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 5. Milestones
-- ------------------------------------------------------------
create table milestones (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects (id) on delete cascade,
  name             text not null,
  description      text,
  start_date       date,
  due_date         date,
  status           text not null default 'open'
                     check (status in ('open','closed_completed','not_applicable')),
  role_id          uuid references project_roles (id) on delete set null,
  owner_id         uuid references profiles (id) on delete set null,
  is_major         boolean not null default false,
  tags             text[],
  weightage        numeric,
  percent_complete numeric,
  completed_date   date,
  created_by       uuid references profiles (id) on delete set null,
  updated_by       uuid references profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_milestones_updated
  before update on milestones
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 6. Action Items (+ owners + comments)
-- ------------------------------------------------------------
create table action_items (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects (id) on delete cascade,
  title        text not null,
  description  text,
  type_id      uuid references action_item_types (id) on delete set null,
  milestone_id uuid references milestones (id)        on delete set null,
  role_id      uuid references project_roles (id)     on delete set null,
  owner_id     uuid references profiles (id)          on delete set null, -- legacy single owner; multi-owner via action_item_owners
  due_date     date,
  status       text not null default 'open'
                 check (status in ('open','closed_completed','not_applicable')),
  tags         text[],
  created_by   uuid references profiles (id) on delete set null,
  updated_by   uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_action_items_updated
  before update on action_items
  for each row execute function set_updated_at();

-- Up to four owners per action item (slot 1-4).
create table action_item_owners (
  id             uuid primary key default gen_random_uuid(),
  action_item_id uuid not null references action_items (id) on delete cascade,
  user_id        uuid not null references profiles (id)     on delete cascade,
  slot           int  not null check (slot between 1 and 4),
  created_at     timestamptz not null default now()
);

create table action_item_comments (
  id             uuid primary key default gen_random_uuid(),
  action_item_id uuid not null references action_items (id) on delete cascade,
  body           text not null,
  author_id      uuid references profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. Issues
-- ------------------------------------------------------------
create table issues (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  title       text not null,
  description text,
  category_id uuid references issue_categories (id) on delete set null,
  level_id    uuid references issue_levels (id)     on delete set null,
  status      text not null default 'open'
                check (status in ('open','in_progress','resolved','closed')),
  raised_by   uuid references profiles (id) on delete set null,
  created_by  uuid references profiles (id) on delete set null,
  updated_by  uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_issues_updated
  before update on issues
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 8. Resources
-- ------------------------------------------------------------
create table resources (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  name        text not null,
  type_id     uuid references resource_types (id) on delete set null,
  description text,
  created_by  uuid references profiles (id) on delete set null,
  updated_by  uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_resources_updated
  before update on resources
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 9. Links
-- ------------------------------------------------------------
create table links (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  label       text,
  url         text not null,
  description text,
  is_gold     boolean not null default false,
  tags        text[],
  created_by  uuid references profiles (id) on delete set null,
  updated_by  uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_links_updated
  before update on links
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 10. Attachments (metadata; the file itself lives in Supabase Storage)
-- ------------------------------------------------------------
create table attachments (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects (id) on delete cascade,
  file_name    text not null,
  bucket       text not null default 'project-attachments',
  storage_path text not null,                 -- path/key within the Storage bucket
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 11. Updates (lightweight status notes / headlines)
-- ------------------------------------------------------------
create table updates (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  headline   text,
  body       text,
  type_id    uuid references update_types (id)   on delete set null,
  class_id   uuid references update_classes (id) on delete set null,
  author_id  uuid references profiles (id) on delete set null,
  created_by uuid references profiles (id) on delete set null,
  updated_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_updates_updated
  before update on updates
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 12. Status Reports (+ link to the updates they bundle)
-- ------------------------------------------------------------
create table status_reports (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  title       text,
  summary     text,
  report_date date not null default current_date,
  status_id   uuid references project_statuses (id) on delete set null, -- overall health at report time
  author_id   uuid references profiles (id) on delete set null,
  created_by  uuid references profiles (id) on delete set null,
  updated_by  uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_status_reports_updated
  before update on status_reports
  for each row execute function set_updated_at();

-- Many-to-many: a status report references one or more updates
create table status_report_updates (
  status_report_id uuid not null references status_reports (id) on delete cascade,
  update_id        uuid not null references updates (id)        on delete cascade,
  primary key (status_report_id, update_id)
);

-- ------------------------------------------------------------
-- 13. Indexes on foreign keys (Postgres does not create these
--     automatically; they matter for project-scoped queries)
-- ------------------------------------------------------------
create index idx_project_members_project on project_members (project_id);
create index idx_milestones_project       on milestones (project_id);
create index idx_action_items_project     on action_items (project_id);
create index idx_ai_comments_item         on action_item_comments (action_item_id);
create index idx_ai_owners_item            on action_item_owners (action_item_id);
create index idx_issues_project           on issues (project_id);
create index idx_resources_project        on resources (project_id);
create index idx_links_project            on links (project_id);
create index idx_attachments_project      on attachments (project_id);
create index idx_updates_project          on updates (project_id);
create index idx_status_reports_project   on status_reports (project_id);