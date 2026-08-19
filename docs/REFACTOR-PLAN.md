# Refactoring plan v2 — boundaries, modularity, flexibility

**Branch:** `refactor/modularity-pass-2` (cut from `main`, 2026-08-18)
**Supersedes:** the plan of the same name on `refactor/modularity-pass`, which was
exploratory and never merged. Its findings were handed to `main` as
`docs/REFACTOR-FINDINGS.md` and most were actioned there.
**Status:** living checklist. Tick items as they ship; append outcomes to section 8.

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

- [ ] **B2.** Enforcement: an eslint `no-restricted-imports` pattern rule scoped to
      `src/modules/**`, forbidding `../*/*.service`, `../*/*.repository`, `../*/dto/*`.
      No new dependency. Same-module (`./x.service`) and shared infrastructure
      (`../../common`, `../../database`) are unaffected.
- [ ] **B3.** Fix what the rule surfaces. Known today:
      - `projects.repository` imports `ATTACHMENTS_BUCKET` from `attachments.repository`
        (a constant in the wrong place; move it to shared code)
      - `risks.service` → `projects.repository` (blessed by section 4; route via `index.ts`)
      - `submissions.service` → `projects.repository`, `milestones.repository` (same)
- [ ] **B4.** **Contract conformance suite (Liskov).** One shared spec run against every
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

- [ ] `access-admin` · [ ] `dashboard` · [ ] `kpis` · [ ] `lookups` · [ ] `registry` ·
      [ ] `reports` · [ ] `search` · [ ] `submissions`

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
