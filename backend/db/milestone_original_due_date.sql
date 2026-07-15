-- ============================================================================
-- Adds original_due_date to milestones (date-slip tracking, as in the demo's
-- milestone History: "Original Due Date changed from ... to ...").
--
-- Semantics: set once at creation (= the first due_date) and NOT editable via
-- the API. When due_date later slips, the original stays put — that gap is the
-- point. Backfill uses the current due_date: the best information available,
-- since slips that happened before this column existed were never recorded.
--
-- Also re-creates log_record_history() with an "Original Due Date" line so any
-- future change to the column (e.g. a Phase 2 "confirm new due dates" flow) is
-- audited. Run once in the Supabase SQL editor (idempotent).
-- ============================================================================

alter table milestones
  add column if not exists original_due_date date;

update milestones
  set original_due_date = due_date
  where original_due_date is null;

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
    perform hist_change(tg_table_name, new.id, new.project_id, 'Original Due Date',
                        hist_date(old.original_due_date), hist_date(new.original_due_date), v_actor);
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
