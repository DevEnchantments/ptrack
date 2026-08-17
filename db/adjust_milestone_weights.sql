-- Replace a project's milestone weights atomically, in one round-trip.
-- Run once in the Supabase SQL editor. Idempotent (create or replace).
--
-- !! The Adjust Weights dialog returns 500 until this has been run. !!
--
-- Called by MilestonesRepository.adjustWeights() (via supabase.rpc) instead of
-- the old N independent UPDATEs under Promise.all, where a partial failure
-- could leave the project violating the weights-total-100 rule the service
-- had just enforced (REFACTOR-FINDINGS.md section 2).
--
-- Weight validation stays in the service (it needs a 400 with a message);
-- this function only guarantees all-or-nothing application.
--
-- Deliberately SECURITY INVOKER (the default): the NestJS service role
-- bypasses RLS as usual, while an anon caller hitting this function through
-- PostgREST is still stopped by the deny-all RLS on milestones.

create or replace function public.adjust_milestone_weights(
  p_project_id uuid,
  p_ids uuid[],
  p_weights numeric[],
  p_user_id uuid
) returns void
language plpgsql
as $$
begin
  if array_length(p_ids, 1) is distinct from array_length(p_weights, 1) then
    raise exception 'p_ids and p_weights must have the same length';
  end if;

  -- unnest(a, b) zips the arrays row-wise; null weights clear the column
  -- (equal weighting per FORMULAS.md F1). The project_id filter means ids
  -- from another project are silently skipped, matching the old behaviour.
  update public.milestones m
     set weightage  = t.weightage,
         updated_by = p_user_id
    from unnest(p_ids, p_weights) as t(id, weightage)
   where m.id = t.id
     and m.project_id = p_project_id;
end;
$$;
