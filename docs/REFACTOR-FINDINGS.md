# Findings for `main` from the exploratory refactor branch

**Status:** the code on `refactor/modularity-pass` is **not being merged**. That branch was
exploratory. This document is the deliverable — everything below describes `main` as it
stands today, so it can be acted on independently.

**Where the code is, if any of it is ever wanted:** branch `refactor/modularity-pass`,
with per-session reasoning in `docs/REFACTOR-PLAN.md` on that branch.

---

## 1. The headline finding: 9 modules return 500 where they should return 404

**This is the item worth acting on.** It is a single defect repeated across the codebase,
not nine separate bugs.

Every project-scoped `update()` in a repository ends in `.single()`. When no row matches —
the record belongs to another project, or was already deleted — PostgREST returns error
`PGRST116`, which falls through `toHttpException()`'s `default` branch and becomes
`InternalServerErrorException`.

So **`PATCH` with a valid UUID belonging to another project returns 500 instead of 404.**
`ParseUUIDPipe` is no defence: the UUID is well-formed, it just isn't yours.

| Module | Status on `main` |
| --- | --- |
| `links`, `status-reports` | **Affected** |
| `attachments`, `issues`, `people`, `resources`, `risks`, `submissions`, `updates` | **Affected** |
| `action-items`, `milestones` | Safe — their services call `get()` first, which 404s |
| `program-outcomes` | Safe — its repository already uses `maybeSingle()` |

Seven of the nine were found by audit; three were read line by line to confirm the pattern
rather than trusting the search.

**The fix, per module (two lines):**

```ts
// repository: .single()  ->  .maybeSingle(), return type gains | null
.select(LIST_SELECT).maybeSingle();
return (data as unknown as Thing) ?? null;

// service: null becomes the 404 the client expected
const updated = await this.repo.update(projectId, id, patch);
if (!updated) throw new NotFoundException('Thing not found.');
return updated;
```

No extra database round-trip. The alternative — a `get()` pre-check, as `action-items` and
`milestones` do — also works but costs one extra read per update.

**Why it matters beyond tidiness:** a 500 tells a client "the server is broken, retry
later"; a 404 tells it "that record isn't yours". Monitoring and any retry logic treat
these very differently, and a wrong-project PATCH is exactly what a buggy or hostile client
does.

---

## 2. Other bugs found, all still present on `main`

**Program-outcome numbering can collide.** New outcomes are numbered `count + 1`. With
outcomes 1-2-3, deleting #2 leaves a count of 2, so the next insert is handed a colliding
**3**. Fix: take the highest number in use, ignoring unnumbered rows.
*Note:* even fixed, two simultaneous creates can still collide — that needs a unique
constraint or sequence, i.e. a schema change.

**`adjustWeights` enforces an invariant it can then break.** It rejects milestone weights
that do not total exactly 100, then applies them as N independent updates via
`Promise.all`. A partial failure leaves the project violating the rule the method just
enforced. Needs a Postgres function, in the style of the existing
`replace_action_item_owners`.

**Storage cleanup failures vanish silently.** `ProjectsService.remove()` catches Storage
errors with a bare `catch {}` and no logging, so orphaned files in the bucket leave no
trace anywhere.

**`add` and `update` return different shapes** in `links`, `action-items` and `milestones`:
the same resource comes back with or without its joins depending on the verb.
`status-reports` does not have this. An API-contract decision rather than a bug, but
clients have to handle both today.

**`frontend/tsconfig.json` has a deprecated `baseUrl`**, so a bare `npx tsc --noEmit` in
`frontend/` fails with TS5101. The build is unaffected because it uses `tsc -b`.

---

## 3. Two things that look like bugs and are not

Recorded so nobody spends an afternoon on them.

**Three modules appear to handle empty-string dates differently** (`|| null`, `?? null`,
straight through). Unreachable: the global `ValidationPipe` plus `@IsDateString()` rejects
`''` with a 400 before any service runs, and `null` is handled identically by all three.

**Milestone `depends_on` looks inconsistent** between create (ignores `[]`) and update
(treats `[]` as "clear the set"). Deliberate: a row inserted microseconds earlier cannot
have dependencies, so create skips a DELETE that would clear nothing.

Both are instances of one lesson: **prove a difference is reachable before harmonising
it.** The validation layer makes several apparent inconsistencies impossible to trigger.

---

## 4. What `main` might want to take, ranked by value per unit of risk

Each item is independent — none requires taking the refactor with it.

**1. The frontend test runner.** `main` has no way to run a frontend test at all. The
branch adds vitest + Testing Library + jsdom, a `test` script, a CI step and 20 tests,
touching no application code. Self-contained, zero risk, and it unblocks every future
frontend test.

**2. The 500 → 404 fixes** (section 1). Nine modules × two lines. Highest
user-facing value in this document.

**3. The characterization tests.** The branch has 100 backend tests that pin existing
behaviour on 6 modules. They test `main`'s behaviour, not the refactor's — they would apply
to `main` almost unchanged, and they are what made every finding here provable.

**4. `common/columns.ts`.** One definition of the six DTO→column normalization rules that
each module currently re-implements twice (once for create, once for update). Medium size,
mechanical, and the duplication it removes is where create/update drift comes from.

**5. The `project-sections/` extraction.** The largest structural change: `ProjectsService`
goes from 13 injected collaborators to 2, and `ProjectsModule` from 12 domain imports to 1.
It also clears the module cycle that forces `RisksService` and `SubmissionsService` to
inject `ProjectsRepository` directly. Biggest win, biggest review cost.

---

## 5. Notes on working in this codebase

Learned the hard way over seven sessions; each cost real time.

- **Repositories cannot be unit-tested meaningfully.** They wrap the Supabase fluent
  builder, so a test asserts on a mocked chain rather than on behaviour. Consequence: any
  change to a query or `select` string has no automated safety net. Closing this needs a
  live-Supabase integration suite and a CI credentials decision.
- **Green tests are not a typecheck.** Jest does not typecheck spec files; a widened enum
  literal passed 147 green tests and failed only under `npx tsc --noEmit`. Same family as
  the existing esbuild note in `CLAUDE.md`.
- **`--max-warnings 0` makes warning-level lint rules blocking**, including
  `no-unsafe-argument` and `no-floating-promises`.
- **`expect.any(String)` in a `toHaveBeenCalledWith` object literal** trips
  `no-unsafe-assignment`, while `as unknown as string` trips
  `no-unnecessary-type-assertion`. The working form is a single `as string`.
- **The first `vitest` run after `npm install` can fail outright** at ~60s with
  `Timeout waiting for worker to respond` — a cold start, most likely corporate AV scanning
  `node_modules`. Re-run before debugging.

---

## 6. Suggested order if any of this is acted on

1. Apply the 500 → 404 fix across the nine modules (section 1) — small, isolated,
   user-facing.
2. Take the frontend test runner (section 4.1) — unblocks future work, touches nothing.
3. Fix the outcome numbering collision (section 2).
4. Decide the three open questions: the `adjustWeights` transaction, logging on swallowed
   Storage failures, and whether `add`/`update` should return the same shape.

Items 1-3 are roughly a day's work in total and are independent of any refactoring
decision.
