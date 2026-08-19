# Follow-ups register

Things found while working that are **not** being fixed right now, plus limits of the
checks we have built. The session logs in `REFACTOR-PLAN.md` say what happened; this says
what is still owed.

**How to use it:** add an entry the moment something is noticed, even mid-task. Move it to
section 3 when closed, with what closed it. Never delete an entry — a dismissed finding is
worth as much as a fixed one, because it stops the next person re-investigating.

Status key: **OPEN** (needs a decision or a commit) · **ACCEPTED** (known, deliberately
living with it) · **CLOSED** (see section 3).

---

## 1. Defects and gaps

| # | Status | What | Why it matters |
| --- | --- | --- | --- |
| F2 | **BLOCKED — needs a migration** | The `attachments` table has **no `updated_by` or `updated_at` column at all** (its columns end at `uploaded_by, created_at`) | Originally logged as "the service forgets to stamp `updated_by`". Checking before fixing showed there is nothing to stamp: the table records who uploaded a file and never who edited it afterwards. So this is a schema gap, not a service oversight, and it needs a migration plus a decision about whether attachment edits are worth auditing at all. |
| F3 | OPEN | `submissions.reject` stamps `returned_by` / `returned_at` | A rejection writes the *returned* columns, so "who rejected this, and when" is not recoverable from the audit columns. Likely because the schema has no `rejected_*` columns; needs a schema decision, not a code tweak. |
| F4 | OPEN | `add` and `update` return different shapes in `links`, `action-items`, `milestones` | The same resource comes back with or without its joins depending on the verb, so clients handle both. Additive to fix (widen `add`), so cheap, but it is an API-contract decision. Parked since v1. |
| F5 | OPEN | Program-outcome numbering can still collide on **concurrent** creates | `max + 1` fixed the deletion-gap collision, but two simultaneous creates still race. A real fix needs a unique constraint or sequence, i.e. a schema change. |
| F6 | OPEN | `frontend/tsconfig.json` has a deprecated `baseUrl` | A bare `npx tsc --noEmit` in `frontend/` fails with TS5101. The build is unaffected because it uses `tsc -b`, which is why it has survived this long. |
| F7 | ACCEPTED | RLS policies are still deferred | Out of scope for every refactor pass; belongs to the security phase. Recorded so it is never mistaken for an oversight. |
| F9 | ~~OPEN~~ **CLOSED, see C9** | **KPI child resources report success for ids that matched nothing.** `removeReading`, `updatePlan` and `removePlan` run a filtered query, get `void` back, and return `{ deleted: true }` / `{ ok: true }` regardless | A caller deleting a plan that does not exist, or one belonging to a different KPI, is told it worked. No data leak — the repository filters on `kpi_id`, so nothing foreign is touched — but the response is wrong, and a UI built on it will happily show a delete that never happened. Same class as the old `people.remove` no-op (C5), which was treated as a bug worth fixing. KPIs sit outside the B4 contract, so nothing catches this automatically. |
| F8 | OPEN | **10 of 25 modules have no repository**, running Supabase queries directly inside services: `dashboard`, `import`, `lookups`, `project-sections`, `registry`, `reports`, `search`, `templates`, `users`, and `access-admin` until 2026-08-19 | CLAUDE.md rule 3 describes 60% of the backend, not all of it. This is also **why those modules are untested**: with no seam, the only testable thing is a mocked Supabase chain, which asserts on the fake rather than the code. The missing tests are the symptom; the missing seam is the cause. Extracting a repository is therefore part of Phase 0, not a separate refactor. |

---

## 2. Limits of the checks we have built

Written down because a green run is only as trustworthy as what it actually covers.

| # | Status | Limit |
| --- | --- | --- |
| L1 | ACCEPTED | **Repositories have no behavioural tests.** They wrap the Supabase fluent builder, so a unit test asserts on a mocked chain rather than on behaviour. Any change to a query or `select` string has no automated safety net. Closing it needs a live-Supabase integration suite plus a CI credentials decision. |
| L2 | ACCEPTED | **The B4 conformance suite mocks repositories.** It proves the *service* turns "not found" into a 404. It cannot prove the repository reports "not found" rather than throwing. That half is covered, imperfectly, by L3. |
| L3 | OPEN | **The static guard asserts on source text.** Rename a repository's `update` and it silently stops looking, reporting green forever. It targets the exact shape that caused nine bugs, so it earns its place today, but it should be replaced by a real check (or deleted) rather than trusted indefinitely. |
| L4 | ACCEPTED | **Barrels can create circular imports** in NestJS. None exist today (no two modules import each other), and the DI boot check would catch one, but the risk grows as modules cross-reference. |
| L5 | ACCEPTED | **`submissions` is outside the B4 contract**, deliberately. It has no `remove`, and its repository `update(id, patch)` is not project-scoped — scoping happens earlier via `findOne(projectId, id)`. Its verbs are validate/approve/return/reject, a different contract. Bending the helper to fit one module would be the shallow abstraction we are trying to remove. |

---

## 3. Closed

| # | Closed | What, and what closed it |
| --- | --- | --- |
| C1 | 2026-08-19 | **A foreign id could produce a 500 on `PATCH` in nine modules.** `.single()` turned "no rows" into PGRST116, which fell through `toHttpException`'s default branch. Fixed across all nine on `main`, then the two pre-check modules (`action-items`, `milestones`) were standardised onto `maybeSingle` on this branch to close the remaining race. Guarded by the B4 contract suite and the static guard. |
| C2 | 2026-08-19 | **`ATTACHMENTS_BUCKET` lived inside the attachments module** while `projects` also wrote to that bucket. Moved to `common/storage.ts` (B3). |
| C3 | 2026-08-19 | **`KpisModule` exported a service nobody injected.** Export removed (B1). |
| C4 | 2026-08-17 | **Program-outcome numbering reused a number after a deletion.** `count + 1` → highest-in-use + 1. Residual concurrency case is F5. |
| C5 | 2026-08-17 | **`people.remove` silently no-opped on foreign ids** instead of 404ing. Fixed on `main`. Its missing audit row is the separate, still-open F1. |
| C9 | 2026-08-19 | **KPI child resources reported success for ids that matched nothing** (was F9). `removeReading`, `updatePlan` and `removePlan` now `select('id').maybeSingle()` so the repository reports whether a row matched, and the service raises 404. The three tests that pinned the old behaviour were flipped rather than deleted, so the diff shows exactly what changed. |
| C8 | 2026-08-19 | **`people.remove` left no audit trail** (was F1). The repository now returns a display label (linked account name, else the pending name or email) and the service writes a `project_members` deletion row. The B4 contract adapter dropped its documented skip, so `people` now asserts the full contract like every sibling. |
| C7 | 2026-08-19 | **`frontend/tsconfig.json` carried a deprecated `baseUrl`** (was F6). Removed; `paths` resolves relative to the config file without it. A bare `npx tsc --noEmit` in `frontend/` now passes, so the typecheck is usable outside `tsc -b`. |
| C6 | 2026-08-19 | **The book skills were believed uninstalled.** They were installed all along with `disable-model-invocation: true`; that line was removed. Five v1 session logs recorded the wrong reason and are corrected in `REFACTOR-PLAN.md` section 5. |

---

## 4. Dismissed after investigation

Kept so nobody spends an afternoon rediscovering them.

| # | What looked wrong | Why it is not |
| --- | --- | --- |
| D1 | Three modules handle empty-string dates differently (`\|\| null`, `?? null`, passthrough) | Unreachable. The global `ValidationPipe` plus `@IsDateString()` rejects `''` with a 400 before any service runs, and `null` is handled identically by all three. Changing them would be churn on dead branches that reads like a fix. |
| D2 | Milestone `depends_on` is asymmetric: create ignores `[]`, update treats it as "clear" | Deliberate. A row inserted microseconds earlier has no dependencies to clear, so create skips a DELETE that would delete nothing. Same end state, one fewer round-trip. |
| D3 | `KpisService.update` reads `dto.decimal_places ?? 0`, implying null is expected | Dead branch. The DTO types the field `number \| undefined` and the enclosing guard is `!== undefined`, so `null` cannot arrive. Harmless, and not worth a commit — but do not write a test for it, because the test would assert on an unreachable input. Found by TypeScript refusing the fixture, which is the tidiest way to learn this. |

**The lesson both teach:** before proposing to harmonise a difference between modules, prove
the difference is reachable. The validation layer makes several apparent inconsistencies
impossible to trigger.
