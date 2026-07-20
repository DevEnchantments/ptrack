-- Replace an action item's owner set atomically, in one round-trip.
-- Run once in the Supabase SQL editor.
--
-- Called by ActionItemsRepository.replaceOwners() (via supabase.rpc) instead of
-- the old delete-all + re-insert pair, which was two round-trips and could lose
-- the owners entirely if the process died between the two calls.
--
-- Deliberately SECURITY INVOKER (the default): the NestJS service role bypasses
-- RLS as usual, while an anon caller hitting this function through PostgREST is
-- still stopped by the deny-all RLS on action_item_owners.

create or replace function public.replace_action_item_owners(
  p_action_item_id uuid,
  p_owner_ids uuid[]
) returns void
language plpgsql
as $$
begin
  delete from public.action_item_owners
   where action_item_id = p_action_item_id;

  insert into public.action_item_owners (action_item_id, user_id, slot)
  select p_action_item_id, t.user_id, t.ord::int
    from unnest(p_owner_ids) with ordinality as t(user_id, ord);
end;
$$;
