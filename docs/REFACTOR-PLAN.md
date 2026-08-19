# Refactoring plan v2 — boundaries, modularity, flexibility

**Branch:** `refactor/modularity-pass-2` (cut from `main`, 2026-08-18)
**Supersedes:** the plan of the same name on `refactor/modularity-pass`, which was
exploratory and never merged. Its findings were handed to `main` as
`docs/REFACTOR-FINDINGS.md` and most were actioned there.
**Status:** living checklist. Tick items as they ship; append outcomes to section 8.

**Findings live in `docs/FOLLOW-UPS.md`**, not here. This file records what each session
did; that one records what is still owed — open defects, the limits of the checks we built,
and findings dismissed after investigation. Add to it the moment something is noticed.

**Goal, in priority order:**
1. **Enforced boundaries** — modularity the build checks, not modularity we re-achieve
   by hand every pass. New in v2, and first because every later session inherits it.
2. **Modularity** — deep modules, information hiding, narrow interfaces.
3. **Flexibility** — one definition per rule, so change lands in one place.
4. **Pattern fit** — the right pattern rather than mixed responsibilities.

Performance is **out of scope** (see section 7).

---

## 1. Baseline, measured 2026-08-18 on this branch

| | |
| --- | --- |
| Backend | **207 tests / 22 suites**, `tsc` clean, `eslint --max-warnings 0` clean |
| Frontend | **47 tests / 2 files**, lint clean, build clean |
| Modules | 25 |
| Modules with a characterization suite | 13 |
| Modules with none | 8 (see Phase 0) |

---

## 2. Ground rules

1. **Behaviour-preserving only.** Find a bug, report it. **Amendment (v2):** bugs may be
   fixed when Fares asks, but always in a **separate commit** from the refactor, so each
   commit's claim stays checkable. Never a fix disguised as cleanup.
2. **Safety net before shape change.** No characterization test, no refactor. Tests shown
   green **before** and again after. Where a test is the safety net for a specific move,
   mutation-check it: break the code deliberately and confirm the test fails.
3. **Plan, then show, then apply.** Fares approves the proposal, not the diff after the
   fact.
4. **One skill per session.** They contradict each other by design; two means two
   philosophies arguing inside one task. Section 5 maps them.
5. **Scope is one folder**, named in the phase table. No "while I'm here".
6. **Graphify first** to find dependents, then confirm in source: the graph is AST-derived
   and misses runtime coupling such as `app.module.ts` registration.
7. **Fares runs every commit.** Suggest the message; never run `git commit`.

**Method rule carried from v1:** before proposing to harmonise a difference between
modules, prove the difference is reachable. The global `ValidationPipe` makes several
apparent inconsistencies impossible to trigger, and "fixing" those is churn that reads
like a correction.

### Verification gate (all must pass before an item is ticked)

```
backend   npx tsc --noEmit
backend   npx eslint "src/**/*.ts" --max-warnings 0
backend   npm run build && npm test
frontend  npm run lint && npm run build && npm test
```

---

## 3. Per-session protocol

1. **Orient** — graphify the module; list dependents and dependencies; confirm in source.
2. **Baseline** — run the gate, record the test count.
3. **Read** — controller, service, repository, DTOs.
4. **Propose** — specific moves, each naming the smell, the refactoring used, what could
   break, and which test covers it.
5. **Wait for approval.**
6. **Apply** the approved subset only.
7. **Verify** — full gate, green before and after.
8. **Report** — what changed, what was left, suggested commit message.
9. **Log** — append to section 8.

**A session that finds nothing worth changing is a success.** Record it and move on.

---

## 4. Decisions already taken

- **`ProjectsRepository` stays exported** from `ProjectsModule` and becomes part of the
  declared public surface. It is deliberate, documented, and the module cycle that
  originally forced `risks` and `submissions` to reach for it is gone. Replacing it with a
  narrow service method would trade a real behaviour risk in the risks alert path
  (`getDetail` throws where `findDetail` returns null) for a philosophical win.
- **The stop-and-judge gate is kept**, but as a re-scoping checkpoint after Phase B plus
  the first two modules, not a stop button.
- **Liskov applies as contract conformance, not inheritance.** See B4.

---

## 5. Skill mapping

**Correction to the v1 logs:** they repeatedly recorded "skill: none, not installed". That
was wrong. All 14 book skills were installed at `~/.claude/skills` the whole time, carrying
`disable-model-invocation: true`, which made them user-invocable only. That line was
removed on 2026-08-18, so they load normally now.

| Session type | Skill |
| --- | --- |
| Boundaries, the dependency rule (Phase B) | `book-clean-architecture` |
| Characterization tests, seams (Phase 0) | `book-legacy-code` |
| Module and interface design (the primary lens) | `book-philosophy-of-software-design` |
| Layering, responsibility placement | `book-enterprise-patterns` |
| Mechanics of a specific move | `book-refactoring` / `book-refactoring-guru` |
| Aggregate and boundary questions in the domain | `book-ddd-distilled` |

---

## 6. Phases

### Phase B — Enforced boundaries (first, so everything after inherits it)

- [x] **B1.** **Done 2026-08-19.** Public surface per module: `index.ts` exporting only what outsiders may use
      (normally the service, its public types, and for `projects` the repository per
      section 4). Consumers import `../risks`, never `../risks/risks.service`.
**Ordering correction (2026-08-19):** B2 and B3 must land in the **same** commit. The rule
would otherwise go red on the one known violation left by B1, putting the gate in a failing
state between two commits.

- [x] **B2.** **Done 2026-08-19.** Enforcement: an eslint `no-restricted-imports` pattern rule scoped to
      `src/modules/**`, forbidding `../*/*.service`, `../*/*.repository`, `../*/dto/*`.
      No new dependency. Same-module (`./x.service`) and shared infrastructure
      (`../../common`, `../../database`) are unaffected.
- [x] **B3.** **Done 2026-08-19**, same commit as B2. Fix what the rule surfaces. Known today:
      - `projects.repository` imports `ATTACHMENTS_BUCKET` from `attachments.repository`
        (a constant in the wrong place; move it to shared code)
      - `risks.service` → `projects.repository` (blessed by section 4; route via `index.ts`)
      - `submissions.service` → `projects.repository`, `milestones.repository` (same)
- [x] **B4.** **Done 2026-08-19. Contract conformance suite (Liskov).** One shared spec run against every
      project-scoped module, asserting what they all implicitly claim: `update` with a
      foreign id 404s and never 500s; `remove` with a foreign id 404s and writes no audit
      row; every write stamps `updated_by`; `add` stamps `created_by` and `updated_by`.
      Each module supplies a short adapter; the assertions live once.

      *Why it earns its place:* the 500-instead-of-404 defect appeared in nine modules and
      was found by hand. `people.remove` no-opping on foreign ids was found by hand too.
      This makes that class automatic, including for the module somebody adds next month.

      *Deliberate limit:* a `ProjectScopedRepository` interface may accompany it as
      documentation, but **TypeScript checks shape, not behaviour** — a repository that
      throws instead of returning null still satisfies `Promise<T | null>`. The suite is
      the enforcement; the type is a comment the compiler can read.

      *Not in scope:* `lookups`, `search`, `registry`, `dashboard`, `reports`. They are
      read-only or aggregate. Liskov says implementations of a contract must be
      substitutable, not that everything must implement one.

**Gate:** after B plus the first two modules, review what it bought and re-scope.

### Phase 0 — Safety net for the untested modules

No characterization suite today, so under ground rule 2 they cannot be refactored yet:

Reordered at the gate (2026-08-19) by value, not alphabetically:

- [x] `submissions` (**2026-08-19** — 29 tests over the FR-14 workflow) ·
      [ ] `access-admin` · [ ] `kpis` — write paths and real rules;
      `access-admin` is security-adjacent
- Deferred pending a judgement call, not a commitment: `dashboard`, `reports`, `registry`,
  `search`, `lookups` are read-only or aggregate, where a characterization test mostly
  asserts query shaping

### Phase 1 — Modules that already have a safety net

Straight to refactoring; their suites landed on `main` in August:

- [ ] `action-items` · [ ] `attachments` · [ ] `issues` · [ ] `links` · [ ] `milestones` ·
      [ ] `people` · [ ] `program-outcomes` · [ ] `project-sections` · [ ] `projects` ·
      [ ] `resources` · [ ] `risks` · [ ] `status-reports` · [ ] `updates`

### Phase 2 — Frontend

Unit is the page or component family, not the file. `lib/` was done in v1 and is on `main`.

- [ ] `components/ui/` primitives · [ ] Dialogs · [ ] Detail pages · [ ] Reporting pages

---

## 7. Deliberately out of scope

- **Performance.** Behaviour-preserving refactoring and performance work verify
  differently (proof nothing changed versus a before/after number). Mixing them means
  neither is verified. Known items — bundle size, N+1 queries, round-trips — belong to
  their own pass with measurements attached.
- **RLS policies.** Still deferred to the security phase.
- **Feature work of any kind**, including "obvious" fixes found mid-refactor (see the
  amendment in rule 1 for how fixes are handled).
- **Open from v1, still parked:** harmonising `add`/`update` response shapes. Additive and
  cheap, but an API-contract decision rather than a refactor.

---

## 8. Session log

Append one entry per session: date, module, skill used, what changed, what was left,
verification result.

### 2026-08-19 — B1, public surface per module

**Skill:** `book-clean-architecture`.

**Orient.** Two disagreeing surfaces existed. The NestJS one was already declared (15 of 25
modules export something from `@Module({ exports })`); the TypeScript one was wide open, with
~30 cross-module deep imports. Those fell into four kinds: `.service` (~20, legitimate),
`.module` (~20, composition wiring), `.repository` (4, the reach-ins), and `dto/*` (3).

**The DTO insight.** `import` and `templates` build a `CreateProjectDto` / `CreateMilestoneDto`
to call `create(dto)`. If a service's public signature takes a DTO, the DTO **is** public
surface whether declared or not. Clean Architecture says plain request models cross
boundaries; these are those models. So they got declared rather than forbidden.

**Changed.**
- 13 `index.ts` barrels, one per module that actually has a cross-module consumer.
- 29 import lines rewritten to the barrels (all but one, see below).
- `KpisModule` stopped exporting `KpisService`: nothing injects it, so it was surface for
  free. Verified no consumer before removing.

**Design decisions.**
- **The module file stays out of the barrel.** Consumers still import
  `../risks/risks.module` explicitly. `*.module.ts` is framework wiring, a detail rather
  than policy, and keeping it out means a type-only import cannot drag the DI graph behind
  it. The B2 rule will therefore allow `../*/*.module` while forbidding the rest.
- **Barrels only where there is a consumer (13 of 25).** Clean Architecture says use the
  lightest enforceable boundary; 25 barrels for 13 consumers is ceremony. The other 12 are
  still protected by the rule: a future consumer hits it and must add the barrel, which is
  exactly the moment a surface should widen on purpose.

**Left deliberately.** `projects.repository` still deep-imports `ATTACHMENTS_BUCKET` from
`attachments.repository`. It is B3's job: a storage bucket name is shared infrastructure,
not the attachments module's policy, so it moves to common code rather than being blessed
into the barrel.

**Verification.** 207 tests / 22 suites green before and after; `tsc` · `eslint
--max-warnings 0` · `build` clean. Plus the check that mattered here: **barrels are a
classic source of circular imports in NestJS**, and no unit test covers DI wiring, so the
real `AppModule` graph was booted via `NestFactory.createApplicationContext`. Every provider
resolved. No cycles exist today (no two modules import each other), and if one ever appears
the barrel makes it louder rather than quieter.

**Behaviour preserved:** nothing but import specifiers changed. DI resolves by class
identity and the classes were untouched.

### 2026-08-19 — B2 + B3, the rule and the last reach-in

**Skill:** `book-clean-architecture`. Landed as one commit, per the ordering correction
above: the rule would have gone red on B1's leftover otherwise.

**B3 first.** `ATTACHMENTS_BUCKET` moved from `attachments.repository` to
`common/storage.ts`. The reasoning is the point: **two** modules write to that bucket.
`attachments` owns the lifecycle of an individual file, and `projects` clears the whole
prefix when a project is deleted. A name both depend on is shared infrastructure, not
either module's policy, so neither should import the other to learn it. Blessing it into
the attachments barrel would have encoded a dependency that does not really exist.

**B2, the rule.** `no-restricted-imports` scoped to `src/modules/**/*.ts`, forbidding
`../*/*.service`, `../*/*.repository`, `../*/*.controller`, `../*/dto/*` and their
`**/modules/...` equivalents, with a message that tells the reader what to do instead.
Still allowed on purpose: `../x` (the surface), `../x/x.module` (composition wiring),
`./x.service` (same module), `../../common/*` (shared infrastructure).

**The rule was mutation-checked, not just run.** A green rule proves nothing; a temporary
probe file imported one of each kind and lint reported **exactly 3 errors on exactly the 3
forbidden lines**, staying silent on the barrel, the module file, the shared constant and
the same-module import. The probe was then deleted. Treat a boundary rule like a test: if
it has never been seen to fail, it is decoration.

**Verification.** 207 tests / 22 suites green; `tsc` · `eslint --max-warnings 0` · `build`
clean; DI graph boots with every provider resolved.

**What this buys.** Modularity is now a property the build checks. The remaining phases
inherit it: any module session that widens a surface has to do so in an `index.ts`, in the
open, instead of by adding one more deep import nobody notices in review.

### 2026-08-19 — B4, contract conformance. **Phase B complete.**

**Skill:** `book-clean-architecture`.

**Changed.** `common/testing/project-scoped-contract.ts` asserts the contract every
project-scoped module implicitly claims: `update` and `remove` with a foreign id raise 404,
a rejected `remove` writes no audit row, a successful one writes exactly one. Wired into 11
module specs, ~12 lines each. **207 → 262 tests.**

**Opt-outs carry a reason, by design.** `audit` takes either the mock or
`{ skip: 'why' }`, and the reason lands in the test name, so `people` reads as
`writes an audit row on remove — EXCEPTION: people.remove writes no audit row…` in the
output. An exception you can see is a finding; a silently omitted assertion is a hole.

**The static guard, and how it improved by failing.** First version asserted the mechanism:
no `.single()` in a project-scoped repository `update`. It immediately failed on
`action-items` and `milestones` — correctly on the letter, wrongly on the substance. Their
repositories do use `.single()`, but their services pre-check with `get()`, so the 500 is
unreachable except in a race. The real invariant is "a foreign id cannot 500", and **two**
designs satisfy it. Rewritten to assert that instead: fail only when a repository uses
`.single()` *and* its service does not pre-check. Both designs now pass, and a module with
neither fails.

**Both new checks were mutation-checked.** Reintroducing `.single()` into
`links.repository` failed the guard on exactly that module. Deleting the null check from
`links.service.update` failed 2 contract clauses. Then both were reverted and re-verified.

**Known limits, stated so a green run is not over-trusted.**
- The conformance suite mocks repositories, so it proves the *service* turns "not found"
  into a 404. It cannot prove the repository reports "not found" rather than throwing.
  That half is what the static guard covers, imperfectly.
- The guard asserts on source text. Rename the methods and it silently stops looking.
- The pre-check design still races: if the row is deleted between the check and the write,
  the `.single()` underneath still 500s. Narrow enough to accept, real enough to write down.

**Findings, reported not fixed.** `people.remove` writes no audit row, so who removed a
project member leaves no trace. `attachments.update` takes no `userId` and therefore cannot
stamp `updated_by`. Both are behaviour changes and need their own commit.

**Verification.** 262 tests / 23 suites (1 documented skip); `tsc` · `eslint
--max-warnings 0` · `build` clean; DI graph boots.

**Phase B is complete.** Boundaries are enforced by lint, the shared contract is enforced by
tests, and both enforcement mechanisms have been observed failing. Next per the plan is the
gate: review what Phase B bought before starting Phase 0's eight untested modules.

### 2026-08-19 — Gate review, then one APPROVED BEHAVIOUR CHANGE

**Gate verdict: Phase B paid, unevenly.** It made the 500 class machine-caught (proven by
mutation, not assumed), surfaced two findings that only appear when conformance is forced,
and blocked coupling that had already bitten. Against that: three sessions of infrastructure
with zero user-visible improvement, barrels whose value is entirely prospective, and a
static guard that asserts on source text and will rot if methods are renamed.

**Approved by Fares: standardise the invariant.** `action-items` and `milestones` used the
pre-check design, which still raced — pass `get()`, row gets deleted, the `.single()`
underneath 500s. Both repositories moved to `maybeSingle()` with a null check in the
service. The pre-checks stay: they 404 earlier and cheaper, and their existing tests assert
`update` is never called for a foreign id.

Written test-first: one race test per module, **shown failing** (milestones resolved
normally, action-items threw a TypeError dereferencing null), then green after the fix.
264 tests.

**The payoff was simplification.** With one design left, the static guard dropped its
service-parsing branch and became a flat rule: no `.single()` in a project-scoped `update`.
Stricter and much less brittle than inferring which design each module chose.

### 2026-08-19 — Phase 0, `submissions` (safety net only, no refactor)

**Skill:** `book-legacy-code` territory, though the session was mechanical enough not to
need it loaded: pin behaviour, change nothing.

**29 tests** over the most rule-dense service in the backend, which had none. What they
pin, beyond the obvious paths:

- **The gate's `value == null || value === ''` check**, which means a **zero approved
  budget passes** while a blank sponsor fails. Easy to "tidy" into `!value` and silently
  start blocking legitimate zero-budget projects.
- **No milestones means no weight failure at all** (`active.length > 0`), so an unplanned
  project is not blocked for having nothing to weigh.
- **`not_applicable` milestones are excluded** from the weight total.
- **The actor gate is skipped when the project's person field is null**, so anyone may
  validate a project with no PMO Partner. Deliberate per the module docblock, and exactly
  the kind of rule that looks like a security hole to someone reading it cold.
- **The gate runs before the closed-cycle check**, so a project failing both hears about
  its fields. Ordering quirk, pinned as-is.
- **`reject` writes the `returned_*` columns** (FOLLOW-UPS F3).

**Deliberately not wired into the B4 conformance suite.** No `remove`, and the repository
`update(id, patch)` is not project-scoped — scoping happens earlier via `findOne`. Its
verbs are validate/approve/return/reject, a different contract. Bending the helper to fit
one module would be the shallow abstraction this whole pass exists to remove
(FOLLOW-UPS L5).

**One test failure was mine, not the code's:** a regex expected a space before `status:`
where the message has `(status:`. Worth noting only because it is the failure mode of
message-matching assertions in general.

**Verification.** 264 → **293 tests / 24 suites** (1 documented skip); `tsc` · `eslint
--max-warnings 0` · `build` clean.

**No refactor proposed yet.** Ground rule 2 says the net comes first. With behaviour now
pinned, the `transition` helper's `opts` object and the notification switch are the
candidates worth a proposal.

**Plan change agreed at the gate.** Phase 0's eight modules are not comparable.
`submissions`, `access-admin` and `kpis` have write paths and real rules, and `access-admin`
is security-adjacent, so pinning it is worth more than most. `dashboard`, `reports`,
`registry`, `search` and `lookups` are read-only or aggregate, where characterization tests
mostly assert query shaping — the shallow, mock-heavy kind we have already judged not worth
its keep. Phase 0 is therefore the first three, and whether the other five are pinned at all
is a separate judgement rather than a commitment.
