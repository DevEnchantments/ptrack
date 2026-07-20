# CLAUDE.md — P-Track

Project-specific instructions for Claude Code. Read at the start of every session.
Keep this file lean; every line costs context budget.

## What this project is

P-Track is an enterprise **Project Portfolio Management (PPM)** application. This repo
is a **ground-up rebuild** of an original Oracle APEX app as an independent web
application. There is **no access to the original database** — only a demo instance —
so this is a clean rebuild, not a migration or an enhancement. The rebuild was mandated
to include Supabase in the stack.

The full feature breakdown of the original APEX app lives in `original-app-features.md`
(repo root). Treat it as a **reference for intended behaviour, not a spec** — it describes
a mature APEX app, and 1:1 parity is not the goal. Read it (or `@`-mention it) when
building any feature that maps to an original module — do **not** assume behaviour from
the name alone.

## Tech stack

- **Frontend:** React (Vite + TypeScript), Tailwind CSS, shadcn/ui built on Base UI primitives
- **Middle tier:** NestJS (TypeScript) — all business logic, JWT verification, and authorization
- **Backend:** Supabase — Postgres, Auth, Storage

## Hard architectural rules (do not violate)

1. **React NEVER talks to Supabase directly.** All data flows React → NestJS → Supabase.
   There is no Supabase client in the frontend.
2. NestJS uses the **service-role / secret key**, which bypasses RLS. Since 2026-07-18,
   **RLS is ENABLED on every table with zero policies** (`db/enable_rls_lockdown.sql`) —
   a deny-all that closes direct PostgREST access via the public anon key while leaving
   NestJS untouched. RLS **policies** remain deliberately deferred to the security phase —
   do not add policies or per-request user keys yet.
3. NestJS is organized **feature-first: one module per domain entity**, each with its own
   controller, service, repository, and DTOs.

## Repo & environment

- Repo: https://github.com/DevEnchantments/ptrack
- Backend dev server: `:3000` (`npm run dev`)
- Frontend dev server: `:5173` (`npm run dev`)
- **Environment:** corporate Windows laptop, PowerShell, no admin rights.
  - Corporate TLS interception requires `$env:NODE_OPTIONS="--use-system-ca"` set in the
    session before any Node/npm network call.
  - PATH / env changes sometimes need a full VS Code restart to take effect.
- **Label every command** as `backend` / `frontend` / `Supabase dashboard`.

## Current state — Phase 1 complete (full CRUD)

Every record type now has Create, Read, Update **and Delete**.

- **Record types:** Person, Milestone, Action Item, Link, Resource, Issue, Update,
  Status Report, Attachment
- **App shell:** collapsible dark sidebar in the demo's layout (`AppLayout`, wraps all
  protected routes; top bar owns user/sign-out). Only Projects is live; the other nine
  demo nav items are disabled stubs with a "Coming in Phase 2" tooltip — same convention
  as the email button. No submenus built (demo chevron contents unseen — field-mapping
  rule applies to nav too).
- **Detail pages:** Milestone, Action Item, Status Report, Attachment. Issues, Links,
  Updates and Resources are **dialog-only in the demo** — they need no detail page.
- **Delete:** one convention everywhere — a red `Delete` in the edit-dialog footer
  (`ConfirmDeleteButton`, two-step: click arms, second click confirms). Never shown when
  creating. Project delete keeps its own confirm flow.
- **Project-level:** 4-step Create Project wizard; Edit Project (PATCH, with Parent
  Project picker and creatable Category); Delete Project; restricted-project lock icon;
  orphaned Storage cleanup on project delete
- **History tabs:** Milestone + Action Item show field-level change history. Capture is a
  Postgres trigger (`db/record_history.sql`) writing one `record_history` row per changed
  field, with values resolved to display text **at write time** (FK → name, date →
  `07-JUL-2026`, null → `""`) so history shows what a value *was*, not what it resolves to
  today. Attribution comes from `NEW.updated_by`, which the services already set.
  Action-item **owners** are the exception: they live in the `action_item_owners` join
  table, which the trigger cannot see, so `ActionItemsService.update` diffs the owner set
  and logs one entry itself. Rendered by the shared `RecordHistory` component.
  **Deletions** are audited too (`event='deleted'`, who + what): written by
  `RecordHistoryService` from the service layer (a DELETE trigger only sees the last
  *editor*), best-effort so a failed audit insert never turns a successful delete into
  a 500. No UI reads deletion rows yet — that's the future Project History page.
- **Auth:** the guard verifies Supabase JWTs **locally** (jose, JWKS cached in memory) —
  no per-request call to Supabase Auth. Confirmed live on this project (asymmetric keys).
  Legacy-HS256 tokens fall back to `auth.getUser()` with a one-time warning; setting
  `SUPABASE_JWT_SECRET` in `.env` restores local verification in that case.
- **Perf conventions:** lookups are cached ~60s on both sides (backend `LookupsService`
  map + frontend `lookupsApi` promise cache, invalidated by the create routes). List
  pagination is **opt-in** via `?limit=&offset=` (shared `PaginationQueryDto`; omit =
  return all rows) — wired on `GET /projects` and `GET .../updates` so far.
- **Quality baseline:** GitHub Actions CI (`.github/workflows/ci.yml`) — typecheck, lint,
  build, test on both halves. Lint is **0 errors and blocking on both halves** (frontend
  paid down 16 → 0 on 2026-07-20). 12 unit tests cover the
  action-item owner-diff and the auth guard verify/fallback chain. Frontend fetch failures
  surface as toasts (`lib/toast.ts` + `Toaster` in App) — no more silent empty sections.
- **API docs:** Swagger at `:3000/api/docs` (non-production only). Schemas are derived
  automatically from `class-validator` decorators by the `@nestjs/swagger` CLI plugin —
  DTOs carry `@ApiProperty` examples, and POST/PATCH routes carry runnable `@ApiBody`
  examples.
- **Schema:** `ptrack_phase1_schema.sql`, reconciled against the live Supabase DB (28 tables),
  plus `db/record_history.sql` and `db/record_history_deleted.sql` (both run separately in
  the Supabase SQL editor; the latter widens the event check to allow `'deleted'`), and
  `db/replace_action_item_owners.sql` (atomic owner-set replace used by action-item saves).

## Roadmap — deferred to Phase 2+

**Unfinished Phase 1 loose ends:** RLS enforcement (deliberately deferred to the security
phase).

**Closed (2026-07-20):** frontend lint paid down 16 → 0 (populate effects became
render-phase prev-key blocks; `buttonVariants` unexported; `emptyMember` moved to
`lib/project-form.ts`) and the CI frontend lint step is now blocking like the backend's.

**Closed (2026-07-15):** Email button on the Status Report detail header — ships as a
disabled stub in the demo's position, tooltip pointing at the Phase 2 notification
subsystem. Real sending (queue, templates, email log) arrives with that subsystem.

**Deferred (2026-07-15):** Project Logo upload — neither of us could locate the demo's
upload/display surfaces, and the field-mapping rule forbids inferring UI from the schema
doc. Revisit only if the demo UI turns up.

**Closed after demo review (2026-07-15):** Status Report ↔ Updates junction + report
health. All three demo surfaces (list, edit page, detail page) show no update-linking UI
and no health picker — those existed only in the original's data-model docs. Our fields
match the demo exactly. Not built; the dead `status_reports.status_id` column stays until
a Phase 2 feature (likely dashboards' health heatmap) claims it.
**Also closed (2026-07-15):** Key/AAGP project code — auto-generated by the original app,
not user-entered; deliberately skipped as out of scope. If it ever matters, it is a
display-only generated code (seen as "Project Key AAGP" in the Status Report sidebar).

**Shipped from the loose-ends list (2026-07-15):** Reference Identifier on issues ·
`original_due_date` on milestones (frozen at creation; demo-matching History label).

**Perf debt closed (2026-07-20):** project page now loads all 8 section lists via one
`GET /projects/:id/sections` aggregate (server-side `Promise.all`; per-section endpoints
remain for post-save refreshes) · action-item save cut from 6 sequential round-trips to
3 (before-get → atomic `replace_action_item_owners` RPC → update with joined select;
history insert only when the owner set changed).

**Not yet started (whole modules from the original):** dashboards & reporting (no charting
library is installed — Gantt, timeline, calendar, heatmap all have no foundation) · email
& notification subsystem · Flex Columns (the no-code custom-field engine — decide on this
early, it is the only one that would retro-shape the schema) · Code Table Administration
(11 lookup tables exist with no admin UI) · Search + saved searches · bulk data-load wizard ·
Project Templates / Merge / Validations / Tags / Tree view · preview-before-commit mass
updates.

## How I like to work — follow precisely

- **One feature at a time.** Never bundle multiple features or jump ahead without confirmation.
- **Present a plan for approval before writing code.** Use Plan mode; wait for approval.
- **Numbered steps, each with an explicit success check.**
- **Whole-file, self-consistent edits** — no ambiguous partial changes. The diff-review
  panel is the review surface, so keep each file coherent when you write it.
- **Confirm field mapping from the demo screenshots before building a new record type.**
  Never infer fields from the schema alone.
- **Suggest a commit message at each natural commit point** (no need to ask first):
  `feat:` / `chore:` style, joining scope items with `+` and `&`.
- I communicate casually but produce **semi-formal deliverables for supervisors**. When I
  correct scope creep or a framing error, incorporate the correction without pushback.

## Known gotchas — carry these forward

- **Base UI Select** needs an `items` prop, or the trigger renders raw UUIDs instead of labels.
- **Lookup-backed dropdowns** must be added to the `ALLOWED` map in `lookups.service.ts`
  or they return 404.
- **New NestJS modules** must be registered in `app.module.ts` in BOTH the import line AND
  the `imports:` array, or POST routes return 404.
- **Supabase Storage errors** are `StorageError`, not `PostgrestError` — throw
  `InternalServerErrorException` directly, not via `toHttpException`.
- **esbuild validates syntax but not types** — always also run `npx tsc --noEmit` on
  backend files touching new APIs.
- **Swagger `PartialType`** must be imported from `@nestjs/swagger`, NOT
  `@nestjs/mapped-types`. The Swagger plugin cannot see through the mapped-types version,
  so every `Update*Dto` silently documents as an empty `{}` — docs that look fine but
  describe nothing.
- **Swagger cannot infer multipart bodies** from `FileInterceptor` — file-upload routes
  need a hand-written `@ApiConsumes` + `@ApiBody` schema.
- **FK example values in Swagger are placeholders**, not real rows. Lookup-backed IDs must
  be fetched from `GET /lookups/:name` before a request will succeed.
- **jose v6 is ESM-only.** The app runs because Node 24 can `require()` ESM, but Jest
  cannot — its config needs the `transformIgnorePatterns: ["node_modules/(?!jose)"]` +
  `allowJs` exception (already in `backend/package.json`). Applies to any future ESM-only dep.
- **Files exporting a React component must export ONLY components**
  (`react-refresh/only-export-components`). Shared helpers/objects go in `lib/` — this is
  why `toast` lives in `lib/toast.ts` while `Toaster` lives in `components/ui/toaster.tsx`.
- **supabase-js + typescript-eslint contradict each other on typed selects:**
  `no-unsafe-return` calls `.select('id').maybeSingle()` results `any`, while casting
  them trips `no-unnecessary-type-assertion`. Type the result via the generic instead:
  `.maybeSingle<{ id: string }>()`.
- **History for many-to-many fields cannot be a DB trigger.** A trigger on the parent row
  never sees the join table, and services replace join rows wholesale on every save
  (delete-all + re-insert), so a trigger on the join table would log a "change" on every
  save even when the set is identical. Diff the rendered set in the service instead.
- **Profiles FK disambiguation:** use the `profiles!user_id` FK hint when multiple FKs
  point to the same table.
- **Every NEW table must `enable row level security` at creation** (or re-run
  `db/enable_rls_lockdown.sql`). A table without RLS is publicly readable/writable through
  PostgREST with the anon key, and Supabase's Security Advisor will email about it.
- **File/export sanity check:** every component's export name should match its filename.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- **Always invoke it as `python -m graphify ...`.** The bare `graphify` launcher on PATH is
  broken on this machine (`Permission denied`).
- For codebase questions, first run `python -m graphify query "<question>"` when graphify-out/graph.json exists. Use `path "<A>" "<B>"` for relationships and `explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `python -m graphify update .` (add `--force` after refactors that
  delete code, or it refuses to write a smaller graph). A git post-commit hook also rebuilds
  automatically, but it skips commits that touch only `graphify-out/`.
- The graph is AST-derived: it misses runtime coupling (e.g. `app.module.ts` registration).
  Treat its answers as leads to confirm in source, and treat community *numbers* as
  disposable — they are renumbered on every rebuild.
