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
2. NestJS uses the **service-role / secret key** and currently bypasses RLS. RLS
   enforcement is **deliberately deferred** to a later security phase — do not add RLS
   policies or per-request user keys yet.
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
- **Detail pages:** Milestone, Action Item, Status Report, Attachment. Issues, Links,
  Updates and Resources are **dialog-only in the demo** — they need no detail page.
- **Delete:** one convention everywhere — a red `Delete` in the edit-dialog footer
  (`ConfirmDeleteButton`, two-step: click arms, second click confirms). Never shown when
  creating. Project delete keeps its own confirm flow.
- **Project-level:** 4-step Create Project wizard; Edit Project (PATCH, with Parent
  Project picker and creatable Category); Delete Project; restricted-project lock icon;
  orphaned Storage cleanup on project delete
- **API docs:** Swagger at `:3000/api/docs` (non-production only). Schemas are derived
  automatically from `class-validator` decorators by the `@nestjs/swagger` CLI plugin —
  DTOs carry `@ApiProperty` examples, and POST/PATCH routes carry runnable `@ApiBody`
  examples.
- **Schema:** `ptrack_phase1_schema.sql`, reconciled against the live Supabase DB (28 tables)

## Roadmap — deferred to Phase 2+

**Unfinished Phase 1 loose ends:** History/audit tabs (literal "coming in a later step"
placeholders on the Milestone + Action Item detail pages) · Status Report ↔ Updates
junction — the junction table does not exist, and the `status_id` "health" column on
`status_reports` is dead (written nowhere) · Reference Identifier (visible on the demo's
Issue dialog) · Project Logo upload · Key/AAGP code column · Email buttons · RLS enforcement.

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
- **Profiles FK disambiguation:** use the `profiles!user_id` FK hint when multiple FKs
  point to the same table.
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
