-- ============================================================================
-- FDD alignment, Wave 1.2: dedicated person fields (Fig 11 form + Fig 10
-- workflow actors — docs/FDD-ALIGNMENT.md section 1.1).
--
-- ASSUMED (2026-08-03): dedicated FK columns rather than member-role
-- derivation (supervisor question; Fig 10 shows these same people as the
-- workflow chain, so explicit fields are needed for Wave 4 regardless).
-- Project Owner reuses the existing projects.owner_id column.
--
-- Run once in the Supabase SQL editor (idempotent). Until it runs, project
-- endpoints 500 (the API selects/joins the new columns).
-- ============================================================================

alter table projects add column if not exists project_manager_id  uuid references profiles(id);
alter table projects add column if not exists project_manager2_id uuid references profiles(id);
alter table projects add column if not exists pmo_partner_id      uuid references profiles(id);

-- The API joins profiles!owner_id; guarantee a real FK exists on owner_id
-- without duplicating one that's already there (checked by column, not name).
do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    where c.conrelid = 'projects'::regclass
      and c.contype = 'f'
      and c.conkey = array[(
        select attnum from pg_attribute
        where attrelid = 'projects'::regclass and attname = 'owner_id'
      )]::smallint[]
  ) then
    alter table projects
      add constraint projects_owner_id_fkey
      foreign key (owner_id) references profiles(id);
  end if;
end $$;
