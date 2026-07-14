-- ============================================================================
-- Field-level change history for milestones and action items.
--
-- Values are resolved to display text AT WRITE TIME (FK -> name, date ->
-- DD-MON-YYYY, status -> label). That makes history historically accurate:
-- renaming a milestone later does not silently rewrite what an old entry says.
--
-- changed_by comes from NEW.updated_by, which the NestJS services already set
-- on every write — so changes are attributed to the real user, not the
-- service-role key.
--
-- Run once in the Supabase SQL editor.
-- ============================================================================

create table if not exists record_history (
  id          uuid primary key default gen_random_uuid(),
  table_name  text        not null,               -- 'milestones' | 'action_items'
  record_id   uuid        not null,
  project_id  uuid        not null references projects (id) on delete cascade,
  event       text        not null default 'changed'
                            check (event in ('created', 'changed')),
  field_label text,                               -- null for 'created'
  old_value   text,
  new_value   text,
  changed_by  uuid references profiles (id) on delete set null,
  changed_at  timestamptz not null default now()
);

create index if not exists idx_record_history_record
  on record_history (table_name, record_id, changed_at desc);

-- ---------------------------------------------------------------------------
-- Formatters. Each returns '' for null so the UI renders "" like the original,
-- and so comparisons never trip over null-vs-empty.
-- ---------------------------------------------------------------------------

create or replace function hist_date(p_d date) returns text
  language sql immutable as $$
  select coalesce(upper(to_char(p_d, 'DD-MON-YYYY')), '');
$$;

create or replace function hist_status(p_s text) returns text
  language sql immutable as $$
  select coalesce(
    case p_s
      when 'open'             then 'Open'
      when 'closed_completed' then 'Closed — Completed'
      when 'not_applicable'   then 'Not Applicable'
      else p_s
    end, '');
$$;

create or replace function hist_bool(p_b boolean) returns text
  language sql immutable as $$
  select case when p_b then 'Yes' else 'No' end;
$$;

create or replace function hist_tags(p_t text[]) returns text
  language sql immutable as $$
  select coalesce(array_to_string(p_t, ', '), '');
$$;

create or replace function hist_num(p_n numeric) returns text
  language sql immutable as $$
  select coalesce(p_n::text, '');
$$;

create or replace function hist_text(p_t text) returns text
  language sql immutable as $$
  select coalesce(p_t, '');
$$;

-- FK -> human name.
create or replace function hist_role(p_id uuid) returns text
  language sql stable as $$
  select coalesce((select name from project_roles where id = p_id), '');
$$;

create or replace function hist_profile(p_id uuid) returns text
  language sql stable as $$
  select coalesce(
    (select coalesce(full_name, email) from profiles where id = p_id), '');
$$;

create or replace function hist_milestone(p_id uuid) returns text
  language sql stable as $$
  select coalesce((select name from milestones where id = p_id), '');
$$;

create or replace function hist_ai_type(p_id uuid) returns text
  language sql stable as $$
  select coalesce((select name from action_item_types where id = p_id), '');
$$;

-- ---------------------------------------------------------------------------
-- Writes one row per field, and ONLY when the value actually changed. (The
-- original app logs no-op edits such as "07-JUL-2026" -> "07-JUL-2026"; that is
-- noise, not history, so it is deliberately not reproduced.)
-- ---------------------------------------------------------------------------

create or replace function hist_change(
  p_table   text,
  p_record  uuid,
  p_project uuid,
  p_label   text,
  p_old     text,
  p_new     text,
  p_actor   uuid
) returns void language plpgsql as $$
begin
  if p_old is distinct from p_new then
    insert into record_history (
      table_name, record_id, project_id, event,
      field_label, old_value, new_value, changed_by
    )
    values (p_table, p_record, p_project, 'changed',
            p_label, p_old, p_new, p_actor);
  end if;
end;
$$;

create or replace function log_record_history() returns trigger
  language plpgsql as $$
declare
  v_actor uuid;
begin
  if tg_op = 'INSERT' then
    insert into record_history (
      table_name, record_id, project_id, event, changed_by, changed_at
    )
    values (tg_table_name, new.id, new.project_id, 'created',
            coalesce(new.created_by, new.updated_by), new.created_at);
    return new;
  end if;

  v_actor := new.updated_by;

  if tg_table_name = 'milestones' then
    perform hist_change(tg_table_name, new.id, new.project_id, 'Milestone Name',
                        hist_text(old.name), hist_text(new.name), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Description',
                        hist_text(old.description), hist_text(new.description), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Start Date',
                        hist_date(old.start_date), hist_date(new.start_date), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Due Date',
                        hist_date(old.due_date), hist_date(new.due_date), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Completed Date',
                        hist_date(old.completed_date), hist_date(new.completed_date), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Status',
                        hist_status(old.status), hist_status(new.status), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Assigned Role',
                        hist_role(old.role_id), hist_role(new.role_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Owner',
                        hist_profile(old.owner_id), hist_profile(new.owner_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Major Milestone',
                        hist_bool(old.is_major), hist_bool(new.is_major), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Tags',
                        hist_tags(old.tags), hist_tags(new.tags), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Weightage',
                        hist_num(old.weightage), hist_num(new.weightage), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Percent Complete',
                        hist_num(old.percent_complete), hist_num(new.percent_complete), v_actor);

  elsif tg_table_name = 'action_items' then
    perform hist_change(tg_table_name, new.id, new.project_id, 'Action Item',
                        hist_text(old.title), hist_text(new.title), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Description',
                        hist_text(old.description), hist_text(new.description), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Due Date',
                        hist_date(old.due_date), hist_date(new.due_date), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Status',
                        hist_status(old.status), hist_status(new.status), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Milestone',
                        hist_milestone(old.milestone_id), hist_milestone(new.milestone_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Type',
                        hist_ai_type(old.type_id), hist_ai_type(new.type_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Assigned Role',
                        hist_role(old.role_id), hist_role(new.role_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Owner',
                        hist_profile(old.owner_id), hist_profile(new.owner_id), v_actor);
    perform hist_change(tg_table_name, new.id, new.project_id, 'Tags',
                        hist_tags(old.tags), hist_tags(new.tags), v_actor);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_milestones_history on milestones;
create trigger trg_milestones_history
  after insert or update on milestones
  for each row execute function log_record_history();

drop trigger if exists trg_action_items_history on action_items;
create trigger trg_action_items_history
  after insert or update on action_items
  for each row execute function log_record_history();

-- ---------------------------------------------------------------------------
-- Backfill: one 'created' entry per record that predates the trigger. These are
-- synthetic (reconstructed from created_at/created_by), NOT captured history —
-- no field-level changes exist for these records and none can be recovered.
-- Idempotent: safe to re-run.
-- ---------------------------------------------------------------------------

insert into record_history (
  table_name, record_id, project_id, event, changed_by, changed_at
)
select 'milestones', m.id, m.project_id, 'created', m.created_by, m.created_at
from milestones m
where not exists (
  select 1 from record_history h
  where h.table_name = 'milestones' and h.record_id = m.id and h.event = 'created'
);

insert into record_history (
  table_name, record_id, project_id, event, changed_by, changed_at
)
select 'action_items', a.id, a.project_id, 'created', a.created_by, a.created_at
from action_items a
where not exists (
  select 1 from record_history h
  where h.table_name = 'action_items' and h.record_id = a.id and h.event = 'created'
);
