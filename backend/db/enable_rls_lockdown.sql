-- ============================================================================
-- Closes the PostgREST side door: enables RLS on every public table, with NO
-- policies. Zero policies = deny-all for the anon/authenticated roles, so the
-- auto-generated Supabase REST API can no longer read or write any table
-- directly. NestJS is unaffected — the service-role key has BYPASSRLS, which
-- is precisely why the middle tier holds that key.
--
-- This is NOT the deferred "RLS enforcement" phase. That phase = designing
-- per-user policies. This = locking the door until those policies exist.
--
-- Idempotent; also safe to re-run after adding new tables (and every NEW table
-- must get RLS enabled too — see CLAUDE.md gotchas).
-- ============================================================================

do $$
declare
  t record;
begin
  for t in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- Verify: every public table should show rowsecurity = true.
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
