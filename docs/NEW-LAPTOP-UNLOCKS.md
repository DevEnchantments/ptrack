# New-laptop unlocks (post-migration backlog)

Written 2026-08-20, after moving from the corporate laptop to the personal one.
The codebase carries almost no corporate scar tissue; the constraints mostly shaped
what we *skipped*. This file records what is now possible so we can act on each item
when ready. Update the status lines as items land.

## A. Capabilities unlocked (ranked by project impact)

### A1. Email subsystem, stage d — no longer blocked on supervisor SMTP
**Status: not started.**
No admin rights meant no local mail catcher, so the notification-email pipeline
(queue, templates, email log) was deferred until real SMTP credentials existed.
Now: install Mailpit (or run it via Docker), build and demo the whole pipeline
against a local inbox, and swap in real SMTP later as a pure `.env` change.
Supervisor already approved the direction ("use SMTP if u can"), so this converts
a waiting-on-credentials item into a shippable feature.

### A2. Docker Desktop → local Supabase stack
**Status: not started.**
`supabase start` gives a disposable local Postgres + Auth. Two wins:
- Offline development that cannot touch the shared cloud demo data.
- Real integration tests for the repository layer. The 207 backend unit tests
  deliberately mock repositories (noted in the specs themselves); a local stack
  closes that gap with tests against a real Postgres.

### A3. Browser e2e with Playwright
**Status: not started.**
Browser installs were dicey under corporate policy. A thin e2e suite
(login → project page → create record → assistant chat) would catch what unit
tests structurally cannot: routing, guards-to-UI wiring, SSE streaming.

### A4. Free tool choice
**Status: ongoing.**
Node version managers, global CLIs, local services — installable without the
corporate "needs a VS Code restart and a prayer" dance. No specific action;
just stop designing around the old restriction.

## B. Workaround teardown (small, opportunistic)

- **Seeder retry wrappers** (`withRetry`/`fetchAll` in `seed-adports-demo.mjs`):
  existed for the flaky corporate network. Harmless resilience; keep, but they are
  no longer load-bearing.
- **Test flakes** ("vitest reports no tests", "nest watch dies on taskkill"): were
  attributed to corporate AV cold-starts and machine policy. Assume gone on this
  machine until observed again; stop pre-emptively rerunning.
- **Bare `graphify` launcher + Microsoft-Store Python trap**: corporate artifacts,
  already resolved here (`python` resolves; graphify 0.9.47 via PyPI `graphifyy`).
- **TLS interception**: still present on this machine, but AV-driven (see
  CLAUDE.md environment section for the current state). Re-test `--use-system-ca`
  and curl behavior after any antivirus change, and trim CLAUDE.md when a
  workaround stops being needed.

## C. Explicitly unchanged

Architecture was never a laptop accommodation: cloud Supabase, the NestJS middle
tier owning all business logic and authorization, and the guard chain all stay.
Workflow rules also stand: Fares runs every commit; SQL migrations run by hand in
the Supabase SQL editor; plan-first before building.

## Recommended order

1. **A1 (Mailpit + email stage d)** — deferred feature with standing supervisor
   approval; turns a blocked item into a shipped one.
2. **A2 (local Supabase)** — next time we touch the data layer or want
   repository-level tests.
3. **A3 (Playwright e2e)** — after A1/A2, or before the next supervisor demo as a
   regression net.
