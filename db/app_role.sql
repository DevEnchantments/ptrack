-- Security phase: global application role (FDD 3.2 roles 1/2/6; FR-15).
-- Run once in the Supabase SQL editor. Idempotent.
--
-- !! Run this BEFORE pulling the enforcement code: until the column exists,
-- !! admin/PMO surfaces (Code Tables, Import, provisioning, cycle close,
-- !! project creation) return 403 for everyone, because the backend treats
-- !! an unreadable role as plain 'user'. Nothing else breaks.
--
-- Mapping (docs/FDD-ALIGNMENT.md section 8):
--   admin     = FDD System Administrator
--   pmo       = FDD PMO Administrator
--   executive = FDD Management / Executive Viewer (read-only, aggregates)
--   user      = everyone else; per-project powers come from membership
--               access_level, projects.owner_id/manager ids, risks.owner_id

alter table public.profiles
  add column if not exists app_role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_app_role_check;
alter table public.profiles
  add constraint profiles_app_role_check
  check (app_role in ('admin', 'pmo', 'executive', 'user'));

-- The one real account today. Future admins are promoted with the same
-- statement (or via a future admin UI).
update public.profiles
   set app_role = 'admin'
 where email = 'test@ptrack.local';
