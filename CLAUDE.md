# CLAUDE.md — P-Track

Project-specific instructions for Claude Code. Read at the start of every session.
Keep this file lean; every line costs context budget.

## What this project is

P-Track is an enterprise **Project Portfolio Management (PPM)** application. This repo
is a **ground-up rebuild** of an original Oracle APEX app as an independent web
application. There is **no access to the original database** — only a demo instance —
so this is a clean rebuild, not a migration or an enhancement. The rebuild was mandated
to include Supabase in the stack.

The full feature breakdown of the original APEX app lives in
`docs/original-app-features.md`. Treat it as the source-of-truth reference for what each
module should eventually do. Read it (or `@`-mention it) when building any feature that
maps to an original module — do **not** assume behaviour from the name alone.

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

## Current state — Phase 1 complete

Full CRUD replication of the project record and all 9 attached record types:

- **Record types:** Person, Milestone, Action Item, Link, Resource, Issue, Update,
  Status Report, Attachment (create/list, plus edit where the demo has it)
- **Detail pages:** Milestone, Action Item, Status Report, Attachment
- **Project-level:** 4-step Create Project wizard; Edit Project (PATCH, with Parent
  Project picker and creatable Category); Delete Project with confirm flow
- **Schema:** `ptrack_phase1_schema.sql`, reconciled against the live Supabase DB (28 tables)

## Roadmap — deferred to Phase 2+

Project Logo upload · Key/AAGP code column · Email buttons · Restricted-project lock icon ·
Attachment row delete control · consistent delete policy across all record types ·
orphaned Storage file cleanup on project delete · History/audit tabs (currently
placeholders) · Status Report ↔ Updates junction + health status · Reference Identifier ·
RLS enforcement.

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
- **Profiles FK disambiguation:** use the `profiles!user_id` FK hint when multiple FKs
  point to the same table.
- **File/export sanity check:** every component's export name should match its filename.
