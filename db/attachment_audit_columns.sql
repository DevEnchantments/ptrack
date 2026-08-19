-- Give attachments an edit trail (FOLLOW-UPS F2).
-- Run once in the Supabase SQL editor. Idempotent (if not exists).
--
-- !! Editing an attachment's metadata returns 500 until this has been run. !!
--
-- The table recorded uploaded_by/created_at and nothing about later edits, so
-- "who last changed this file's description or gold flag" was unanswerable.
-- That was originally filed as a service oversight; checking first showed the
-- columns simply did not exist.
--
-- updated_by is stamped by AttachmentsService.update(). updated_at carries a
-- default for the insert path and is stamped by the service on edits, matching
-- program_outcomes and kpis: those tables have no moddatetime trigger either,
-- and adding one here would race the value the service already writes.

alter table public.attachments
  add column if not exists updated_by uuid references public.profiles (id),
  add column if not exists updated_at timestamptz not null default now();

-- Existing rows have never been edited, so their edit trail is their upload.
update public.attachments
   set updated_by = uploaded_by
 where updated_by is null;
