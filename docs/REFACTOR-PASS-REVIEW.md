# Refactor pass — review summary

**Branch:** `refactor/modularity-pass` (cut from `main` 2026-08-05; worked 2026-08-13 and
2026-08-17)
**Diff vs main:** 52 files, +4,401 / −550
**Purpose of this document:** give a reviewer enough to decide whether this branch should
merge, and which of its findings are worth acting on. Detail and per-session reasoning live
in `docs/REFACTOR-PLAN.md`.

---

## 1. Headline

| | On `main` | On this branch |
| --- | --- | --- |
| Backend tests | 47 (8 suites) | **147** (15 suites) |
| Frontend tests | 0 — no test runner at all | **20**, runner wired into CI |
| Backend modules refactored | — | 6 of 20 |
| Bugs found | — | 3 (2 fixed here, 1 queued) |
| False alarms investigated and dismissed | — | 2, with reasons recorded |

The pass was **behaviour-preserving by rule**. Three exceptions were made deliberately,
each approved, each with a test, each listed in section 3.

---

## 2. What changed

**Test infrastructure (the largest single contribution).**
The frontend had no test runner on `main`. This branch ports vitest + Testing Library +
jsdom, adds a `test` script and a blocking CI step, and lands 20 tests. On the backend,
characterization tests went 47 → 147 — these pin existing behaviour so future refactoring
is checkable, and they are what made every finding below provable rather than suspected.

**One shared write-path helper.** `backend/src/common/columns.ts` replaces the
`if (dto.x !== undefined) patch.x = …` block that every module re-implemented once for
create and once for update — six definitions of the same six normalization rules. Modules
now declare which fields follow which rule. Adopted by 6 modules; the remaining 14 can
adopt it mechanically.

**One structural change.** `ProjectsService` had 13 injected collaborators, 11 of them
serving a single endpoint. That fan-out moved to a new `project-sections/` module. Result:
`ProjectsService` 13 → 2 collaborators, `ProjectsModule` 12 → 1 domain imports. The URL,
response shape, status codes and Swagger grouping are unchanged (verified by booting the
app). This also clears the module cycle that forced `RisksService` and `SubmissionsService`
to inject `ProjectsRepository` directly to avoid it — that workaround can now be removed.

**Frontend duplication.** 5 copies of `relativeTime`, 2 of `initials`, 1 `formatDate` clone
and 30+ inline `full_name || email || fallback` expressions across 21 files were folded into
`lib/format.ts`.

**Per-module cleanups** in `links/`, `projects/`, `action-items/`, `program-outcomes/`,
`milestones/`, `status-reports/`: extracted named functions for rules that were inline and
unnamed (`nextSortOrder`, `assertWeightsTotal`, `notifyBudgetThreshold`, `logOwnerChange`,
`normalizeOwnerIds`), and named the magic numbers behind them (`BUDGET_ALERT_THRESHOLD`,
`WEIGHT_TOTAL`, `MAX_OWNER_SLOTS`).

---

## 3. Behaviour changes — the only user-visible items in this branch

| # | Change | Why | Where |
| --- | --- | --- | --- |
| 1 | Relative timestamps under a minute now read **"just now"** everywhere | 3 of 5 copies already did; 2 counted seconds. Unified on the majority. | Attachment detail, project detail |
| 2 | Program-outcome auto-numbering fixed (bug 1) | Numbers could collide | Outcome creation |
| 3 | `PATCH` of a status report outside your project returns **404**, was **500** (bug 2) | Wrong status code | API |

Item 1 is worth mentioning before the next demo — it is cosmetic but visible.

---

## 4. Bugs found

### Fixed on this branch

**1. Program-outcome numbering could collide.** New outcomes were numbered
`count + 1`. With outcomes 1-2-3, deleting #2 leaves a count of 2, so the next insert was
handed a **colliding 3**. Now `highest-in-use + 1`. Regression test shown failing before
the fix.
*Residual:* two simultaneous creates can still collide. A real fix needs a unique
constraint or sequence — a schema change, out of scope for this branch.

**2. `PATCH /status-reports/:id` returned 500 instead of 404.** With no ownership
pre-check, the repository's `.single()` turned "no rows" into PostgREST error `PGRST116`,
which falls through `toHttpException`'s default branch to
`InternalServerErrorException`. A well-formed UUID belonging to another project was enough
to trigger it. Fixed with `.maybeSingle()` + a null check, at no extra round-trip.

### Found, not fixed

**3. `links/` has the identical 500-instead-of-404 defect.** Same shape, same `.single()`.
It needs the same one-line repository change plus one test, and its safety net already
exists. **This is the one item we would fix before merging.**

**4. `adjustWeights` has no transaction.** It enforces that milestone weights total exactly
100, then applies them as N independent updates via `Promise.all`. A partial failure leaves
the project violating the invariant the method just enforced. Needs a Postgres function like
the existing `replace_action_item_owners`.

**5. Storage cleanup failures are silently swallowed.** `ProjectsService.remove()` catches
Storage errors with a bare `catch {}` and no logging, so orphaned files leave no trace.

**6. `add` and `update` return different response shapes** in `links/`, `action-items/` and
`milestones/` — the same resource comes back with or without its joins depending on the
verb. `status-reports/` does not have this. An API-contract decision, not a refactor.

**7. `frontend/tsconfig.json` has a deprecated `baseUrl`** — a bare `npx tsc --noEmit` in
`frontend/` fails; the build itself is unaffected.

---

## 5. Investigated and dismissed — recorded so they are not re-raised

**Three modules appeared to handle empty-string dates differently** (`|| null`, `?? null`,
passthrough), which looked like a latent 500. It is unreachable: a global `ValidationPipe`
plus `@IsDateString()` rejects `''` with a 400 before any service runs, and `null` is
handled identically by all three. No fix applied — harmonising them would be churn on dead
branches that reads like a correction.

**Milestone `depends_on` looked inconsistent** between create (ignores `[]`) and update
(treats `[]` as "clear"). It is deliberate: a row inserted microseconds earlier cannot have
dependencies, so create skips a DELETE that would clear nothing. Comment added.

Both are worth noting as method: *before proposing to harmonise a difference, prove the
difference is reachable.*

---

## 6. What we suggest for `main`

1. **Fix the `links/` 500 first** (item 3). Five minutes, same pattern as the fix already
   made in `status-reports/`.
2. **Merge.** The branch is behaviour-preserving apart from the three documented items, and
   the test count went 47 → 167 across both halves.
3. **Decide four open questions** — none are blockers, all need a human:
   - Should `add` and `update` return the same shape? (item 6)
   - Is the `adjustWeights` invariant worth a Postgres function? (item 4)
   - Do we want logging on swallowed Storage failures? (item 5)
   - Do we ever want repository-level test coverage? (see risk 1 below)
4. **Do not continue module-by-module.** After the 3-module pilot the value was judged real
   but front-loaded: the big win came from one structurally unusual module. The remaining 14
   backend modules are simple CRUD and would cost ~10-14 full sessions for roughly two
   mechanical moves each. If they are done at all, batch them.

---

## 7. What a reviewer should scrutinize

1. **Repositories have no tests.** They wrap the Supabase query builder, so unit tests
   would assert on a mocked fluent chain rather than behaviour. Consequence: the
   `LIST_SELECT` / `DETAIL_SELECT` extractions were verified by reading the diff, not by a
   test. Closing this needs a live-Supabase integration suite and a CI credentials
   decision.
2. **Create payloads are less obvious.** Splitting create columns between `CREATE_DEFAULTS`
   and `COLUMN_SPEC` means adding a field to one and not the other silently omits a column.
   The exact-payload tests are the only thing that catches it.
3. **The `project-sections/` extraction changed which controller serves an endpoint.** URL,
   response and Swagger tag were preserved deliberately; verified by boot, not by test —
   no test covers routing.
4. **CI has never run on this branch.** The workflow triggers on `main` pushes and pull
   requests only, so the PR itself will be the first full CI run.

---

## 8. Cost so far, and what remains

Six of twenty backend modules and one of five frontend items are done, across seven working
sessions. Remaining: 14 backend modules, 4 frontend items, estimated 10-14 sessions under
the same approval-gated protocol — which is exactly the cost that the recommendation in
section 6.4 exists to question.
