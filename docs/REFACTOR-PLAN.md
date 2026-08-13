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

- [ ] **0a.** Frontend test runner on this branch (vitest + Testing Library +
      jsdom), `test` script, CI step. *(Already proven on
      `experiment/ui-ux-pro-max`; port it rather than redo it.)*
- [ ] **0b.** Characterization tests for the three pilot modules below, pinning
      current observable behaviour including the ugly parts.

**Success check:** pilot modules have tests that fail if behaviour changes.

### Phase 1 — Pilot (3 modules, then stop and judge)

Chosen to be representative, not easy.

- [ ] **1a.** `backend/src/modules/links/` — simple CRUD, the control case
- [ ] **1b.** `backend/src/modules/projects/` — the most complex module
- [ ] **1c.** `backend/src/modules/action-items/` — known non-trivial logic
      (owner-set diffing, atomic replace RPC)

**Gate:** after 1c, review whether the pass produced real value or mostly
cosmetic churn. **If cosmetic, stop the whole plan here.** That is a legitimate
outcome and cheaper than discovering it at module 20.

### Phase 2 — Core project entities

- [ ] `program-outcomes/` · [ ] `milestones/` · [ ] `status-reports/`

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

- [ ] `lib/` (shared helpers — the 5 duplicate `relativeTime` copies live here)
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

_(empty)_
