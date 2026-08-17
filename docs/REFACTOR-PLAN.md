# Refactoring Plan — modularity, flexibility, patterns

**Branch:** `refactor/modularity-pass` (cut from `main`, 2026-08-05)
**Status:** living checklist. Work phases top to bottom. One phase = one session =
one commit. Tick items as they ship and append findings to section 6.

**Goal, in priority order:** modularity → flexibility → pattern fit.
Performance is deliberately **out of scope** here; see section 5.

---

## 1. Ground rules (every session obeys these)

1. **Behaviour-preserving only.** No feature changes, no schema changes, no API
   contract changes, no DTO field changes. If a bug is found, **report it, do not
   fix it in the same pass** — a fix disguised as cleanup is unreviewable.
2. **Safety net before shape change.** A module with no characterization test
   does not get refactored until it has one. Tests must be shown passing
   **before** the refactor and again after.
3. **Plan, then show, then apply.** Every session: propose the change and wait for
   Fares' approval before writing. No unattended edits.
4. **One skill per session.** The 14 book skills contradict each other by design
   (`docs/COMPATIBILITY.md` in the source repo). Loading two means two
   philosophies arguing inside one task.
5. **Scope is one folder.** Named in the phase table. Do not "while I'm here"
   into a neighbouring module.
6. **Graphify first.** `python -m graphify query "<question>"` to find dependents
   before proposing any boundary change. The graph is AST-derived and misses
   runtime coupling (e.g. `app.module.ts` registration) — confirm in source.
7. **Fares runs every commit.** Suggest the message; never run `git commit`.

### Verification gate (all must pass before a phase is ticked)

```
backend   npx tsc --noEmit
backend   npx eslint "src/**/*.ts" --max-warnings 0
backend   npm run build && npm test
frontend  npm run lint && npm run build && npm test
```

---

## 2. Per-session protocol

1. **Orient** — `graphify query` the module; list its dependents and dependencies.
2. **Baseline** — run the verification gate. Record current test count. If the
   module lacks characterization tests, that is the whole session (see Phase 0).
3. **Read** — the module's controller, service, repository, DTOs.
4. **Propose** — a written list of specific moves, each naming:
   - the smell or design pressure it addresses
   - the refactoring used (rename, extract, inline, move, introduce parameter
     object, encapsulate collection, decompose conditional, …)
   - what could break, and which test covers it
5. **Wait for approval.** Fares reviews the proposal, not the diff-after-the-fact.
6. **Apply** the approved subset only.
7. **Verify** — full gate, plus tests green before *and* after.
8. **Report** — what changed, what was deliberately left, suggested commit message.
9. **Log** — append outcome to section 6.

**A session that finds nothing worth changing is a success.** Record it and move on.

---

## 3. Skill mapping

| Session type | Skill | Notes |
| --- | --- | --- |
| Characterization tests, seams, dependency breaking | `book-legacy-code` | Phase 0 only |
| **Modularity + flexibility** (the primary lens) | `book-philosophy-of-software-design` | deep modules, information hiding, interface depth |
| Layering, responsibility placement, pattern choice | `book-enterprise-patterns` | maps onto controller/service/repository directly |
| Mechanics of a specific move | `book-refactoring` or `book-refactoring-guru` | use when the *how* is unclear, not as the primary lens |
| Aggregate and boundary questions | `book-ddd-distilled` | only where domain shape is genuinely in question |

---

## 4. Phases

Counts at plan time: backend 136 files / 10,556 lines / 8 spec files;
frontend 91 files / 21,438 lines / **0 tests on main**.

### Phase 0 — Safety net (prerequisite, no refactoring)

- [x] **0a.** Frontend test runner on this branch (vitest + Testing Library +
      jsdom), `test` script, CI step. **Done 2026-08-13** — see session log.

      **Port it, do not redo it.** It is already proven green on
      `experiment/ui-ux-pro-max` in commit **`5ddef4f`**. Inspect with
      `git show --stat 5ddef4f`; the relevant files are:

      | File | What it carries |
      | --- | --- |
      | `frontend/package.json` | `test` + `test:watch` scripts, 5 devDependencies |
      | `frontend/vite.config.ts` | `defineConfig` from `vitest/config` + `test` block (jsdom, setupFiles, include) |
      | `frontend/src/test-setup.ts` | one line: `@testing-library/jest-dom/vitest` |
      | `frontend/src/lib/format.ts` | `formatDate` / `relativeTime` / `initials` |
      | `frontend/src/lib/format.test.ts` | 15 tests over the above |
      | `.github/workflows/ci.yml` | frontend `Test` step |

      Two known traps, both already solved in that commit:
      - `vi.stubEnv('TZ', …)` is **not** self-restoring and Node caches the
        timezone, so every timezone-sensitive test must set its own TZ rather
        than relying on `unstubAllEnvs`.
      - The first `vitest` run can take ~60s to spawn its worker and may look
        hung. It is a one-off cold start, not `NODE_OPTIONS`.

      Decision needed from Fares: land the runner alone, or also port
      `lib/format.ts` + its tests as the first real coverage. Recommend the
      latter — a runner with nothing to run rots.
      **Decided 2026-08-13: runner + `format.ts` + its 15 tests.**
- [x] **0b.** Characterization tests for the three pilot modules below, pinning
      current observable behaviour including the ugly parts. **Done 2026-08-13**
      — 44 tests at the service layer; repositories are deliberately uncovered
      (see session log for what that leaves exposed).

**Success check:** pilot modules have tests that fail if behaviour changes.

### Phase 1 — Pilot (3 modules, then stop and judge)

Chosen to be representative, not easy.

- [x] **1a.** `backend/src/modules/links/` — simple CRUD, the control case.
      **Done 2026-08-13** — 2 moves, thin yield as expected of a control case.
- [x] **1b.** `backend/src/modules/projects/` — the most complex module.
      **Done 2026-08-13** — service 274 → 214 lines, 13 collaborators → 2, new
      `project-sections/` module (approved deviation from ground rule 5).
- [x] **1c.** `backend/src/modules/action-items/` — known non-trivial logic
      (owner-set diffing, atomic replace RPC). **Done 2026-08-13** — plus the
      shared `common/columns.ts` promotion, retrofitted into links + projects.

**Gate:** after 1c, review whether the pass produced real value or mostly
cosmetic churn. **If cosmetic, stop the whole plan here.** That is a legitimate
outcome and cheaper than discovering it at module 20.

**Gate verdict (2026-08-13): value is real but front-loaded — do NOT run the
remaining 20 modules as 20 full sessions.** See section 6 for the reasoning and
the recommended alternative.

### Phase 2 — Core project entities

- [x] `program-outcomes/` (**2026-08-13** — 10 characterization tests, spec
      adoption, `nextSortOrder()`; **plus an approved bug fix in its own
      commit**) · [ ] `milestones/` · [ ] `status-reports/`

### Phase 3 — Content and attachments

- [ ] `attachments/` · [ ] `resources/` · [ ] `updates/`

### Phase 4 — Governance

- [ ] `issues/` · [ ] `risks/` · [ ] `kpis/` · [ ] `submissions/`

### Phase 5 — Platform

- [ ] `lookups/` · [ ] `users/` · [ ] `people/` · [ ] `search/` ·
      [ ] `registry/` · [ ] `templates/`

### Phase 6 — Reporting and integrations

- [ ] `dashboard/` · [ ] `reports/` · [ ] `import/` · [ ] `notifications/`

### Phase 7 — Frontend

Only after the backend pass, and only if Phase 1's gate said the approach works.
Unit is the page or component family, not the file.

- [x] `lib/` (shared helpers — the 5 duplicate `relativeTime` copies live here).
      **Done 2026-08-13** — 5 `relativeTime` + 2 `initials` + 1 `formatDate`
      clone deleted, `personName()` adopted at every `||` call site (21 files).
- [ ] `components/ui/` primitives
- [ ] Detail pages · [ ] Dialogs · [ ] Reporting pages

---

## 5. Deliberately out of scope

- **Performance.** Behaviour-preserving refactoring and measurable performance
  work verify differently (proof nothing changed vs. a before/after number).
  Mixing them means neither is verified. The known perf items — bundle size /
  code splitting, N+1 query patterns, request round-trips — belong to their own
  pass with measurements attached. None of the 14 book skills help much here.
- **RLS policies.** Still deferred to the security phase (see CLAUDE.md).
- **Feature work of any kind**, including "obvious" fixes found mid-refactor.

---

## 6. Session log

Append one entry per session: date, module, skill used, what changed, what was
left, verification result.

### 2026-08-13 — Phase 0a, frontend test runner (no skill; a port, not a design pass)

**Changed.** Ported the runner from `5ddef4f` on `experiment/ui-ux-pro-max`:
`frontend/package.json` (`test` / `test:watch` + 5 devDependencies),
`frontend/vite.config.ts` (`defineConfig` from `vitest/config` + `test` block:
jsdom, setupFiles, `include: src/**/*.test.{ts,tsx}`), `frontend/src/test-setup.ts`,
`frontend/src/lib/format.ts`, `frontend/src/lib/format.test.ts` (15 tests), and a
frontend `Test` step in `.github/workflows/ci.yml`. `package-lock.json` regenerated
by `npm install` (+81 packages).

**Plan correction.** `format.ts` is **not** in `5ddef4f` — it predates that commit on
the experiment branch, so only `format.test.ts` shows in `git show --stat`. Port it
from the tree instead: `git show 5ddef4f:frontend/src/lib/format.ts`.

**Left deliberately.**
- The 3 duplicate `relativeTime()` copies (`HomePage`, `RecordHistory`,
  `AttachmentDetailPage`) and 2 `initials()` copies still stand. `format.ts` lands with
  zero dependents on purpose; deduping them is Phase 7, and folding it in here would
  make the runner port unreviewable.
- **Reported, not fixed** (ground rule 1): `frontend/tsconfig.json:8` carries a
  deprecated `baseUrl`, so a bare `npx tsc --noEmit` in `frontend/` fails with TS5101.
  The gate is unaffected — `npm run build` uses `tsc -b`, which passes. `5ddef4f`
  dropped that line as a separate `chore:`; do the same when convenient.

**Verification.** Baseline before: backend `tsc` / `eslint` / build clean, 47 tests in
8 suites; frontend lint + build clean, **no test script**. After: identical backend
result (47/8 — the port cannot touch it), frontend lint clean, build clean,
**15 tests / 1 file passing**.

**Cold-start trap confirmed, and it is worse than documented.** The first `vitest` run
after `npm install` did not just look hung — it *failed*, at exactly 60.03s, with
`[vitest-pool-runner]: Timeout waiting for worker to respond`. That is vitest's default
worker-startup timeout, most likely corporate AV scanning the freshly written
`node_modules`. The immediate re-run passed in 14.8s with no changes. **Re-run once
before debugging anything.** Not `NODE_OPTIONS` (the failing run had
`--use-system-ca` set, the passing one did not; the flag is only needed for the
`npm install`). Clean CI runners have not shown it.

### 2026-08-13 — Phase 0b, characterization tests for the three pilot modules

**Skill: none.** §3 maps this session to `book-legacy-code`, which is not installed in
this environment. Proceeded without it rather than substituting a different philosophy;
the work was mechanical and followed the house pattern already in
`action-items.service.spec.ts`.

**Changed.** 44 new tests, backend 47 → **91** (8 → 10 suites):

| File | Tests | Pins |
| --- | --- | --- |
| `links/links.service.spec.ts` (new) | 9 | write-shaping (trim, blank → null, `tags: []` → null, `is_gold: false` survives), 404-without-audit on delete, audit payload |
| `action-items/action-items.service.spec.ts` (extended) | +18 | owner de-dupe and the silent four-slot cap, `owner_ids: []` vs absent, insert payload, delete **call order**, 404 guards on history/comments, comment trim |
| `projects/projects.service.spec.ts` (new) | 17 | 11-key `sections` mapping, member filter/pending-vs-active mapping, the compensating delete, paginated vs unpaginated stats paths, zero-stat fallback, F2 pass-through, patch construction, budget-threshold branch (crossing / already-crossed / below / owner==manager), Storage-failure tolerance on delete |

**Design decision, and the hole it leaves.** Tests sit at the **service** layer with
hand-built mocks. Repositories are untested on purpose: they are thin wrappers over the
Supabase fluent builder, so a unit test would assert on a mocked chain rather than on
behaviour. **Consequence: a refactor that rewrites a repository query or `select` string
has no safety net** — for those, verification is `tsc` plus manual checking. Closing this
needs a live-Supabase integration suite (slow, credential-dependent CI); considered and
declined for Phase 0.

**Left deliberately.**
- Controllers are untested. They are declarative routing plus `ParseUUIDPipe`; the
  behaviour worth pinning lives in the services.
- **Reported, not fixed** (ground rule 1): `projects.service.ts` `sections()` has a stale
  doc comment reading "All eight section lists" — it returns **eleven**. Natural fix
  during 1b.
- Checked and dismissed as a non-bug: `new Set([owner_id, project_manager_id])` can pass
  `null` into `notify`, but `notifications.service.ts` guards `if (!entry.userId) return`
  (and skips self-notification). The test pins the pass-through as-is.

**Verification.** Before: backend 47 tests / 8 suites, `tsc` · `eslint` · `build` clean.
After: **91 tests / 10 suites**, `tsc` · `eslint --max-warnings 0` · `build` clean;
frontend lint clean and its 15 tests still green (no frontend file was touched).
Two lint fixes were needed on the way (`no-unnecessary-type-assertion`, then a
`prettier/prettier` reflow) — note that `--max-warnings 0` makes even the
warning-level rules (`no-unsafe-argument`, `no-floating-promises`) gate-blocking.

**Phase 1 can now start.** The pilot modules have tests that fail if behaviour changes,
within the repository caveat above.

### 2026-08-13 — Phase 1a, `modules/links/` (the control case)

**Skill: none.** §3 maps this to `book-philosophy-of-software-design`, not installed in
this environment. Applied its lens from first principles (deep modules, information
hiding, one definition per rule) rather than substituting another skill.

**Orient.** One cross-module dependent: `ProjectsService` injects `LinksService` and
calls `list()` in `sections()`. Confirmed in source — the graph misses the runtime
coupling that makes it work (`links.module.ts` `exports: [LinksService]`). That seam is
covered by the `sections` test from 0b.

**Changed (2 moves).**
1. *Extract Function* — `columnsFrom(dto)` in `links.service.ts`. `add` and `update` each
   independently restated the DTO→column rules (trim url, `label?.trim() || null`,
   `tags?.length ? tags : null`). Two copies that had to be kept in sync, where drift is
   silent: trimming added to one path only means the same field stores differently
   depending on whether you created or edited. Now one definition, spread over
   `CREATE_DEFAULTS` for insert and onto `updated_by` for patch. `update` went from 8
   lines of `if` to one expression.
2. *Extract Constant* — `LIST_SELECT` in `links.repository.ts`, replacing the joined
   select string inlined in both `update` and `findByProject`. Verified byte-identical to
   both call sites via the diff before running anything.

**Safety net proven, not assumed.** Beyond green-before/green-after, the net was
mutation-checked: flipping `is_gold !== undefined` to truthiness turned the suite red on
exactly the intended test (`links.service.spec.ts:127`), then was reverted and re-verified.
Worth repeating in 1b/1c — a characterization suite that cannot fail is not a safety net.

**Rejected, with reasons (the more useful half of this session).**
- Collapsing `LinksService.list`, a pure delegation. PoSD would call the service shallow,
  but CLAUDE.md rule 3 mandates controller/service/repository per module and that
  pass-through is the seam `ProjectsService` injects. Consistency across 20 modules beats
  3 saved lines.
- Moving the repository's `label ?? url` fallback into the service. It is information
  hiding done right: `remove()` returns "what to call this row", and the audit-log caller
  should not need to know a link's label can be blank.
- Hoisting `columnsFrom` into `common/`. **Deferred on purpose** — one example is not
  enough to design a shared abstraction, and projects carries ~30 of these blocks with
  quirks links does not have (`start_date: '' → null` beside `at_risk: null → false`).
  Revisit after 1c with three examples to design against. Also keeps ground rule 5 honest.
- Moving the controller's inline `@ApiBody` examples out (~25 of its 79 lines).
  Documentation-adjacent churn that would set a precedent across 20 modules and put the
  runnable example further from the route it documents.

**Reported, not fixed** (ground rule 1): `add` returns `Link` (no profile join) while
`update` returns `LinkListItem` (with `created_by_profile`) — the same resource in two
shapes depending on the verb. Fixing it changes a response body, so it belongs to an
API-shape decision, not a behaviour-preserving pass.

**Verification.** 91 tests / 10 suites green before and after; `tsc` · `eslint
--max-warnings 0` · `build` clean. Test count deliberately unchanged — this phase adds no
behaviour.

**Gate input.** ~213 lines of module yielded one extract-function and one
extract-constant. Thin, as expected of the control case. Carry to the post-1c gate: if
projects and action-items yield proportionally as little, stop the plan.

### 2026-08-13 — Phase 1b, `modules/projects/` (the complex case)

**Skill: none** (`book-philosophy-of-software-design` not installed; lens applied from
first principles). **Ground rule 5 deviation approved by Fares:** M1b created a second
folder, `modules/project-sections/`.

**Orient — the finding that drove the session.** `ProjectsService` had 4 external
consumers and **two refused to use it**: `RisksService` and `SubmissionsService` inject
`ProjectsRepository` directly, with comments saying the full service "would create a
module cycle". The cycle existed because `ProjectsModule` imported 12 domain modules,
11 of them solely to feed `sections()` — one method, one route. Design pressure with a
receipt, not a matter of taste.

**Changed (3 moves).**
1. *Extract Class + new module* — `modules/project-sections/` (service, controller,
   module, spec). `GET /projects/:id/sections` keeps its URL, response and status codes;
   only the class serving it moved. `ProjectsModule` now imports **1** domain module
   instead of 12; `ProjectsService` went from **13 collaborators to 2**. The stale
   "eight section lists" comment (logged in 0b) was corrected to eleven in the move.
2. *Extract Function* — `columnsFrom(dto)` in `projects.service.ts`, replacing ~60 lines
   of `if (dto.x !== undefined)` with five named category lists (`TRIMMED_OR_NULL`,
   `NULLABLE`, `DATE_OR_NULL`, `ARRAY_OR_NULL`, `AS_IS`) plus the two fields with rules
   of their own (`name`, `at_risk`). Adding a field is now one list entry.
3. *Extract Method* — `notifyBudgetThreshold()` + module-level
   `BUDGET_ALERT_THRESHOLD = 0.8` and `utilizationRatio()`. `update()` now reads as
   build patch → write → re-read → notify.

**Safety net: tests first, then extract.** Move 2 was a mechanical re-categorization of
35 fields sitting behind 3 tests, where a `??` / `||` mix-up silently turns a legitimate
`0` into `null`. So **7 category-representative tests were added first and shown green
against the unrefactored code** (including `manual_progress: 0` and `approved_budget: 0`),
and only then was the extraction applied. Mutation-checked afterwards: flipping `??` to
`||` failed exactly those 2 tests, then was reverted and re-verified.

**Unit tests cannot see DI wiring or routing**, which is the real risk of move 1 (the
known gotcha: an unregistered module 404s). Verified by booting the app against the real
`AppModule`: the DI graph resolved and `GET /projects/:id/sections` answered **401**
(global auth guard) rather than 404, as did `:id` and `:id/history` — no route shadowing.
Frontend needs no change: `frontend/src/lib/api.ts:179` already calls that exact URL.

**Swagger surface preserved.** Swagger groups by controller class, so the moved route
would have appeared under a new "ProjectSections" heading in `/api/docs`. Added
`@ApiTags('Projects')` to the new controller to keep it where it has always been. It is
the only `@ApiTags` in the codebase — deliberate, and worth generalizing if more
controllers are ever split.

**Reported, not fixed** (ground rule 1): `remove()` swallows Storage-cleanup failures in
a bare `catch {}` with no logging, so orphaned Storage objects leave no trace. Adding a
logger adds a dependency and emits output that was not there before; its own pass.

**Left deliberately.** `findAll`'s two-branch stats path (the branches differ for a
documented concurrency reason), `create()`'s compensating delete (explicit, commented,
tested — hiding it in a helper would bury the one thing a reader needs to see), and
`ProjectsRepository.listStats` (dense, subtle, and uncovered by tests per the 0b caveat).

**Verification.** 91 → **98 tests / 11 suites** (+7 new, sections test relocated to its
own suite); `tsc` · `eslint --max-warnings 0` · `build` clean; boot smoke test as above.

**Gate input.** Unlike 1a, this one paid: a class with 13 collaborators became one with 2,
and a documented cross-module workaround now has a path to removal. The pattern from 1a
recurred exactly as predicted, which is the third data point for the shared-helper
decision after 1c.

### 2026-08-13 — Phase 1c, `modules/action-items/` + the shared-helper promotion

**Skill: none** (as 1a/1b). **Ground rule 5 deviation approved by Fares:** the promotion
edits `common/`, `links/` and `projects/` alongside `action-items/`.

**Changed.**
1. *Promotion* — `common/columns.ts`: `columnsFrom(dto, spec)` over a declarative
   `ColumnSpec` of six named rules (`trimmed`, `trimmedOrNull`, `nullable`, `dateOrNull`,
   `arrayOrNull`, `asIs`). Deferred at 1a on one example, taken at three. Links, projects
   and action-items now declare a spec instead of implementing the rules; projects keeps
   a 3-line local wrapper for `at_risk ?? false`, the one rule that does not generalize.
   **8 unit tests** pin the helper directly, not just through its callers.
2. *Extract Function* — `normalizeOwnerIds()` + `MAX_OWNER_SLOTS = 4`, replacing the
   `[...new Set(...)].slice(0, 4)` written in both `add` and `update`.
3. *Extract Method* — `logOwnerChange()`, so `update()` reads linearly: read before →
   replace owners → write columns → log if the set changed.
4. *Extract Constant* — `LIST_SELECT` in the repository, mirroring 1a. Verified verbatim
   against the diff before running anything (repository code is test-uncovered).

**Safety net.** 98 → **106 tests / 12 suites**. Mutation-checked where it now matters
most: flipping the shared helper's `?? null` to `|| null` failed **3 tests across 2
suites** (the helper's own zero test and both projects zero-preservation tests), then was
reverted and re-verified. One helper now sits under three modules, so its own suite is
the thing standing between a one-character slip and silent data corruption in all three.

**Line counts, honestly.** The three services went 466 → 422 lines, but `common/columns.ts`
(57) and the 1b `project-sections/` service (79) mean the codebase grew overall. Lines were
never the win: the win is that each normalization rule now has **one** definition instead
of six, and that the next 17 modules inherit it rather than re-implementing it.

**Rejected.** Collapsing the `await this.get(...)` 404 guard used by four methods into an
`assertInProject()` — already clear, and `remove()` genuinely uses the returned row for
its audit label. Unifying `insertOwners` (direct insert) with `replaceOwners` (RPC) —
that changes which DB call fires, which is behaviour, not shape.

**Reported, not fixed:** `add()` returns the bare inserted row while `update()` returns the
fully-joined one — the same mismatch reported for links in 1a. **Two of three pilot
modules**, so it is a codebase-wide API-shape pattern, not a one-off.

**Verification.** 106 tests / 12 suites; `tsc` · `eslint --max-warnings 0` · `build` clean.

---

## 7. Phase 1 gate — verdict (2026-08-13)

**Did the pilot produce real value or cosmetic churn? Real, but front-loaded and unevenly
distributed.**

| Session | Yield |
| --- | --- |
| 1a `links/` | Thin. Two small extracts on a 213-line module. |
| 1b `projects/` | **Substantial.** 13 collaborators → 2; `ProjectsModule` 12 domain imports → 1; a documented cross-module cycle workaround now has a path to removal. |
| 1c `action-items/` | Moderate, plus the shared helper that removes a rule-duplication class from the whole backend. |

Safety net across 0b-1c: **47 → 106 tests**, three of them mutation-checked rather than
merely green.

**The catch.** 1b's payoff came from a structural problem specific to `projects/`. The
remaining 20 backend modules look like `links/`, not like `projects/` — expect
`columnsFrom` adoption plus a `LIST_SELECT` extract each, roughly two mechanical moves per
module. Running those as 20 full propose → approve → characterize → verify sessions costs
far more than the shape it buys, and Phase 0b showed that writing the characterization
tests is the expensive part, not the refactor.

**Recommendation: do not continue module-by-module.** In descending order of value:
1. **Frontend `lib/` (Phase 7 first item).** 21,438 lines, 15 tests, and 5 duplicate
   `relativeTime()` copies — worse duplication than anything found in the backend, and
   `format.ts` already landed in 0a with zero dependents waiting to absorb them.
2. **One batched backend adoption pass**, not 20 sessions: adopt `columnsFrom` across the
   remaining CRUD modules in a single reviewable commit, adding the per-module
   characterization test *for the write path only* as each is touched.
3. **Stop the per-module plan** for everything else. Revisit only where a module shows a
   `projects/`-shaped problem (a service with many collaborators, or a documented
   workaround pointing at it).

---

## 8. Post-gate sessions

### 2026-08-13 — Phase 7 first item, frontend `lib/`

**The copies were not identical, which changed the session.** The plan assumed 5
duplicate `relativeTime()` functions. There were 5, but in **two behaviours**: under a
minute, `AttachmentDetailPage` and `ProjectDetailPage` said "42 seconds ago" while
`HomePage`, `MilestoneDetailPage` and `RecordHistory` said "just now". Folding them
together was therefore a visible-text decision, not a refactor.

**⚠ APPROVED BEHAVIOUR CHANGE (Fares, 2026-08-13): "just now" everywhere.** Under a
minute now reads "just now" on **the attachment detail page and the project detail page**,
which previously counted seconds. Worth knowing before the next supervisor demo. Two of
the 15 tests ported in 0a were rewritten to match.

**Changed (21 files, +137 / -190).**
- `lib/format.ts`: `relativeTime` unified on "just now"; new `personName(person, fallback)`
  with overloads so a `null` fallback returns `string | null` and a string fallback
  returns `string`.
- Deleted **5** `relativeTime` copies, **2** `initials(name)` copies and one `formatDate`
  clone (`formatReportDate`), all now imported from `lib/format`.
- `personName()` adopted at **every** `||` call site — 30+ occurrences across 21 files,
  including the inline expressions in dialogs, grids and the Gantt. The named wrappers
  that only re-expressed the rule (`profileName` ×3, `authorName`, `uploaderName`) were
  deleted outright; the ones that extract a field from an entity (`memberName`,
  `ownerName`, `reportAuthor`, `linkAuthor`, …) kept their names and now delegate.

**Left deliberately, and why it is not an oversight.** The `??` variants
(`project-grid.ts`, `HomePage`'s CSV export, `ProjectDetailPage`'s people rows) were
**not** converted. `??` and `||` differ on empty string: for a profile whose `full_name`
is `''`, `||` falls through to the email while `??` renders blank. Converting them would
be a silent behaviour change on data that is unlikely but possible. Same reasoning for the
`user_metadata?.full_name` sites, which read the Supabase auth user, not a profile row.

**Also left:** the two `longDate()` implementations render genuinely different strings
(`"Monday, 7 July, 2026"` on attachments vs `"Monday, July 7, 2026"` on status reports) —
a UI-consistency question for `docs/UI-AUDIT.md`, not a refactor. And `RecordHistory`'s
`initials(actor)` stays separate from `lib/format`'s: it splits on dots and underscores so
an email local-part reads "FA", which the shared one does not do. It now takes its source
string from `personName(actor, '?')` and carries a comment saying why it is not the shared
helper.

**Safety net.** These pages have no component tests, so the net was: **20 unit tests on the
shared helpers** (15 → 20, five of them new `personName` cases including the blank-name
case that pins `||` vs `??`), plus `tsc -b` across the sweep — every wrapper had a distinct
argument type, so a wrong substitution fails the typecheck rather than review. Full gate
green: lint · build · 20 tests. Backend untouched at 106.

**Note for the next frontend session:** the cold-start vitest flake recurred exactly as
documented in 0a (60.07s, "no tests", one error; the immediate re-run passed in 28s).

### 2026-08-13 — Phase 2a, `modules/program-outcomes/` (+ a bug fix)

**Full protocol** (Fares' call, 2026-08-13: propose-and-approve on every remaining module
rather than batching the mechanical ones).

**Changed — commit 1, behaviour-preserving.** 10 characterization tests written first and
shown green against the unrefactored service (106 → 116). Then `COLUMN_SPEC` adoption
(`trimmed: name`, `nullable: sort_order/start_date/end_date`) and `nextSortOrder()`
extracted out of `add`.

Note the spec proves its worth here: this module's dates are `nullable` (`?? null`), while
`projects/` uses `dateOrNull` (`|| null`). Same helper, different declared rule — an empty
string is stored here and clears the column there, exactly as before.

**Changed — commit 2, an APPROVED BEHAVIOUR CHANGE (Fares asked for the fix).** Outcome
auto-numbering was `count + 1`, so with outcomes 1-2-3, deleting #2 left a count of 2 and
handed the next insert a **colliding 3**. Now highest-in-use + 1, ignoring unnumbered rows.
Written test-first: the regression test was shown **failing** against the old code before
the fix landed, then green (116 → 118).

**Still broken, deliberately:** two simultaneous creates can still collide. A real fix needs
a unique constraint or a sequence — a schema change, which is out of scope for this branch.
Documented in the method.

**Kept ground rule 1 intact** by splitting the two: the refactor commit proves nothing
changed, the fix commit changes exactly one thing with a test that fails without it.

**Observed, not changed:** this table maintains `updated_at` in application code because it
has no `moddatetime` trigger, unlike every other table. Deliberate and commented, but it
will bite whoever adds the trigger later — the hand-set value would then race the trigger.

**Lint gotcha worth carrying:** `expect.any(String)` inside a `toHaveBeenCalledWith` object
literal trips `no-unsafe-assignment`, and `as unknown as string` trips
`no-unnecessary-type-assertion`. The working form is a single `as string`. Same shape as
the supabase-js typed-select gotcha in CLAUDE.md.

**Verification.** 118 tests / 13 suites; `tsc` · `eslint --max-warnings 0` · `build` clean.
