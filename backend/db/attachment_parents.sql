-- Task-level attachments (FDD Appendix A parent scoping) — 2026-08-13
-- Generalizes attachments beyond the project: an attachment may optionally be
-- scoped to a parent record inside its project (action items now; milestones
-- allowed by the constraint for later). Polymorphic, so no FK — integrity is
-- enforced in AttachmentsService (parent must exist in the same project) and
-- ActionItemsService deletes a task's attachments (rows + Storage objects)
-- when the task is deleted.
--
-- Run in the Supabase SQL editor. Idempotent — safe to re-run.
-- NOTE: attachment routes 500 on the new columns until this has been run.

alter table attachments add column if not exists parent_type text;
alter table attachments add column if not exists parent_id   uuid;

-- Both set or both null, and only known parent kinds.
alter table attachments drop constraint if exists attachments_parent_check;
alter table attachments add constraint attachments_parent_check check (
  ((parent_type is null) = (parent_id is null))
  and (parent_type is null or parent_type in ('action_item', 'milestone'))
);

create index if not exists idx_attachments_parent
  on attachments (parent_type, parent_id);

-- RLS is already enabled on attachments (deny-all lockdown); nothing to add.
