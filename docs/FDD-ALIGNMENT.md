# FDD Alignment — P-Track ⇄ Project Tracker FDD

**Status:** living document — update after every working session and every supervisor answer.
**Decision (2026-07-21):** the Project Tracker FDD (`Project_Tracker_Detailed_FDD 1.pdf`, by Srinivas Kikkuru)
is now the **governing spec** for P-Track. We extend the existing app — we do NOT rebuild from
scratch. `original-app-features.md` is demoted to historical reference.
**Override rule (Fares, 2026-07-21):** wherever the FDD conflicts with what P-Track has,
**the FDD wins** — existing fields/values/layouts are changed to match it. Open point:
what to do with P-Track fields the FDD is *silent* about (size, access control, goal,
customer, primary URL, tags/gold) — keep, hide, or drop? → supervisor question #11.
**Method:** data objects first (Appendix A), then math/logic, workflow-driven build order,
FR checklist for coverage, use cases as acceptance tests. Every formula gets supervisor
sign-off recorded in `docs/FORMULAS.md` before implementation.

---

## 1. Data-object mapping (FDD Appendix A → P-Track schema)

Verdicts: **HAVE** (exists, usable) · **EXTEND** (exists, needs columns/changes) ·
**BUILD** (new table/module) · **ASK** (needs supervisor decision first)

### 1.1 Project → `projects` (EXTEND)
**Shipped 2026-07-29 (Stage 1, step 1):** all EXTEND rows below marked ✅ are live end-to-end:
`backend/db/fdd_project_fields.sql` (run in the Supabase SQL editor; adds `tiers` +
`strategic_objectives` lookups with RLS + seeds, and 11 `projects` columns), repository +
DTOs + update patch, `lookups` ALLOWED map (`tiers`, `strategic-objectives`), Edit Project
dialog, Create Project wizard (StepDetails + confirmation), and project detail page rows.
`internal_stakeholder` ships as plain text for now (the external-stakeholder chips question
is still open); everything stays optional until the mandatory-field list is confirmed.
| FDD attribute | P-Track today | Verdict |
|---|---|---|
| Project ID | `id` | HAVE |
| Name | `name` | HAVE |
| Reference ID | — | ✅ EXTEND (`reference_id`) — see numbering note under question 2b |
| Internal ID / Project Number | — | ✅ EXTEND (`project_number`) — FDD Fig 11 shows both |
| Plan Year | — | ✅ EXTEND (`plan_year` int; dropdown range still open) |
| Description | `description` | HAVE |
| Strategic alignment/objective | — | ✅ EXTEND (lookup `strategic_objectives` + FK) |
| Strategic Program | — | ✅ ASSUMED+SHIPPED 2026-08-03: `strategic_programs` lookup cascading under objectives (`db/fdd_stakeholders_sector_programs.sql`) + cascading select in Edit Project (values SQL-managed for now). Reference ID stays free text pending the numbering theory (2b) |
| Tier | — | ✅ EXTEND (lookup `tiers` + FK) — seeded Tier 1/2/3 |
| Type | `deal_type_id` exists | ASK — is deal_type the FDD "Type" or new lookup? |
| Sector | `category_id`? `region_id`? | ✅ ASSUMED+SHIPPED 2026-08-03: own creatable `sectors` lookup (unseeded, '- New Sector -' in-app); category untouched |
| Status | `status_id` | HAVE. ASSUMED 2026-08-03: standard FDD five (Not Started/In Progress/On Hold/Completed/Cancelled) ADDED to the lookup alongside demo values (`db/fdd_register_columns.sql`); exact LOVs remain question 2 |
| Start / End Date | `start_date`, `target_end_date` | HAVE |
| Actual end | `actual_end_date` | HAVE |
| Approved Budget (AED) | — | ✅ EXTEND (`approved_budget numeric`) |
| Utilized Budget (AED) | — | ✅ EXTEND (`utilized_budget numeric`, manual for now) — ASK: manual entry or derived? |
| Finance Code | — | ✅ EXTEND (`finance_code`) |
| Owner / Project Owner | `owner_id` | HAVE |
| Sponsor | `sponsor` (text) | HAVE |
| Project Manager / Manager 2 / PMO Partner | via `project_members` roles | ✅ ASSUMED+SHIPPED 2026-08-03: dedicated FK columns (`db/fdd_person_fields.sql`) + pickers in Edit Project; Project Owner reuses `owner_id` (now also FK-guaranteed + exposed). These are the Fig 10 workflow actors for Wave 4. Limitation: real users only — typed non-user names are not stored on these fields |
| Internal / External Stakeholders | — | internal ✅ (`internal_stakeholder` text); external ✅ ASSUMED+SHIPPED 2026-08-03: free-text chips stored `external_stakeholders text[]` (like tags); becomes a join table only if directory-backed |
| Target Group | — | ✅ EXTEND (`target_group` text) |
| Priority flag | — | ✅ EXTEND (`is_priority boolean`) — star toggle in forms |
| Manual progress (Fig 1) | — | ✅ ASSUMED+SHIPPED 2026-08-03: `manual_progress numeric` (user-entered 0-100 per FDD 2.4) — edit dialog + detail row |
| At Risk flag (Fig 1) | — | ✅ ASSUMED+SHIPPED 2026-08-03: `at_risk boolean` manual toggle; becomes formula-suggested in Wave 2 |

### 1.2 Milestone → `milestones` (mostly HAVE — big head start)
| FDD attribute | P-Track today | Verdict |
|---|---|---|
| Milestone ID / project ID | `id`, `project_id` | HAVE |
| Outcome group | — | ✅ BUILD SHIPPED 2026-07-30: `program_outcomes` table (RLS, numbered, date ranges) + `milestones.outcome_id` — `backend/db/fdd_program_outcomes.sql` (run in Supabase SQL editor), full CRUD module at `/projects/:id/outcomes` (in the sections aggregate), milestone dialog Outcome select with creatable "- New Outcome -", grouped milestone list on the project page. Follow-ups: outcome edit/reorder UI (rename/dates only via API for now) · `outcome_id` not yet in the record-history trigger |
| Name, start, end | `name`, `start_date`, `due_date` (+ `original_due_date`) | HAVE |
| Weight | `weightage` | HAVE (validation: weights total 100% — build rule) |
| Progress | `percent_complete` | HAVE |
| Status | `status` (open/closed_completed/not_applicable) | ASK — FDD chart buckets: Completed / Not Started / On Target |
| Owner | `owner_id` | HAVE |

### 1.3 Task / Work Activity → `action_items` (EXTEND)
| FDD attribute | P-Track today | Verdict |
|---|---|---|
| Task ID / project / milestone | `id`, `project_id`, `milestone_id` | HAVE |
| Description | `title` + `description` | HAVE |
| Due date | `due_date` | HAVE |
| Progress % | — | EXTEND (`percent_complete`)? — ASK (drawer shows progress bar) |
| Completion flag | `status` | HAVE (mapping) |
| Attachment reference | attachments are project-scoped | ✅ SHIPPED 2026-08-13 — `attachments.parent_type/parent_id` generalization (see 1.7) |
| Work notes | `action_item_comments` | HAVE (comments ≈ work notes; drawer tab) |
| Owners/team | `action_item_owners` | HAVE |
| Activity count / weight / budget shown in drawer | — | ASK |

### 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe)
Fields (Fig 6 modal): statement (≤200 chars), identified_by, date_identified, source,
category (lookup), risk_owner, probability level (lookup), impact level (lookup),
**score (probability × impact — formula ASK)**, response (lookup), response_plan,
priority, action (≤200), status (open/…), type (RISK/ISSUE toggle in register),
last_updated audit, severity dot. New lookups: risk categories, sources, probability
levels, impact levels, responses.
✅ BUILD SHIPPED 2026-07-30: `backend/db/fdd_risks.sql` (risks table + 5 RLS'd
lookup tables; probability/impact/response/source get PLACEHOLDER standard seeds
pending the Fig 6 LOV values — question 4/OI-05; categories unseeded), full CRUD
module at `/projects/:id/risks` (in the sections aggregate), AddRiskDialog (all
Fig 6 fields with char counters on statement/action, RISK/ISSUE toggle), Risks
section on the project page (open/closed filter, type badge, prob/impact/
response/owner meta). Deliberately absent until sign-off: score + severity dot
(OI-02 formula). Risks not in the record-history trigger yet.

### 1.5 Issue → `issues` (EXTEND)
FDD issue register columns: issue, recommendation, date created, reported_by, type,
status, date_closed, action. We have title/description/status/level/category/owner/
resolution/reference. ✅ EXTEND SHIPPED 2026-07-30: `recommendation`,
`reported_by` (free text), `date_closed` — `backend/db/fdd_issue_fields.sql` (run
in Supabase SQL editor) + DTOs/service + AddIssueDialog fields.
ASK still open: does FDD "severity" map to our `level_id`?

### 1.6 Workflow Submission → BUILD `cycles` + `submissions`
States seen (Figs 10, 15, 24): REVIEW → VALIDATE → APPROVE, plus DRAFT / RETURNED /
LOCKED / CLOSED / REJECTED. Monthly cycles with start/end dates per stage (Fig 32).
Attributes: submission ID, project/cycle ID, submitter, reviewer, approver, status,
comments, submitted/decision dates. Routing rules = ASK (OI-03).
✅ ASSUMED+SHIPPED 2026-08-03: `backend/db/fdd_workflow.sql` (cycles = calendar
months auto-created on first submission; submissions unique per project+cycle,
both RLS'd). States: draft/returned → review → validated → approved, with
returned/rejected branches. Actor rules per Fig 10: PMO Partner validates,
Project Owner approves — enforced only when the person field is set. Submission
gate = 3.3.2 mandatory fields + weights total 100 (when milestones exist), with
the failure list in the 400 message. Endpoints under
`/projects/:id/submissions` (list in the sections aggregate); WorkflowPanel in
the project rail (chip, actor/date trail, comment box, contextual actions, past
cycles). Rejected is terminal for its cycle.
✅ Cycle CLOSE shipped 2026-08-13 (ASSUMED: close locks ALL transitions —
submit, resubmit, validate, approve, return, reject — exact closure rules stay
OI-03): `POST /cycles/current/close` / `reopen` + `GET /cycles/current`
(cycles.status already existed, no migration). Close is idempotent and
get-or-creates the month's cycle; Reopen is an enhancement escape hatch.
Surfaces: Cycle Submission Status report header (two-step Close Current Cycle /
Reopen + "Cycle closed" badge) and WorkflowPanel (lock note, actions hidden;
backend guards reject regardless). Notifications on transitions shipped Wave 6.

### 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3)
✅ SHIPPED 2026-08-13 (`backend/db/attachment_parents.sql` — run in the Supabase
SQL editor; attachment routes 500 on the new columns until then): nullable
`parent_type`/`parent_id` on attachments (check: both-or-neither, kinds
`action_item`|`milestone`; milestone allowed by the constraint but has no UI
yet). Polymorphic, so no FK — the service verifies the parent exists in the
same project on upload, and deleting an action item removes its scoped
attachments (rows + Storage objects, audit-logged, best-effort per file).
Surfaces: Attachments tab on the action-item page (upload/download/two-step
delete); the project Attachments section still lists everything, task-scoped
rows badged "Task". List API takes `?parent_type=&parent_id=`.

### 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST)

**✅ ASSUMED+SHIPPED 2026-08-05** (`backend/db/fdd_kpis.sql`): entity-level KPI registry at `/kpis` (reached from the Reporting hub) — Fig 27 definition dialog (name, description, pillar, entity, tier, strategic objective, unit, polarity, decimal places, data source, calculation method as free text, frequency, rationale, baseline, target, priority flag, owner), Fig 28 readings (date, value, performance analysis) and Fig 29 action plans (description, owner, due date, open/done) inline per KPI. Latest-vs-target and a polarity-aware trend arrow are display only; achievement % and the data-quality index stay unimplemented pending formula sign-off. ASSUMED: KPIs are entity-level (not per project), so the project KPI tab stays a stub until the linkage question is answered.
KPI definition (Fig 27): name, type/tier, description, priority flag, pillar, entity,
owner, strategic objective, unit, polarity, decimal precision, data source, calculation
method (text), reporting frequency, rationale, baseline/target. Readings (Fig 28):
value + attachments + performance analysis. Action plans (Fig 29). Data-quality
index (timeliness/completeness/reliability, Figs 30–31) — **formulas = ASK (OI-02)**.

---

## 2. Functionality inventory (FDD FR-01…15 → status)

| FR | Summary | P-Track status |
|---|---|---|
| FR-01 | Project register grid: filters, pagination, sort, status indicators | PARTIAL — filter rail + status pills exist; grid view + manual/calculated columns ✅ SHIPPED 2026-08-03 (sortable Fig 1 grid as a card/grid toggle, persisted; CSV export via FR-13 confirm — UC-03, CSV not XLSX to stay dependency-free). home cards show the official F1 calculated-progress bar (DECIDED 2026-08-18) with milestone done/total + open-issue counts as secondary meta |
| FR-02 | Navigation: lists / views / reports / dashboards | ✅ MOSTLY SHIPPED — live nav: Projects, My Dashboard, Categories, Milestones, Action Items, People, Timeline, Reporting, AI Assistant (stage a, read-only agent chat, shipped `d0ece33`), Administration + Users & Roles (admin-gated). No stubs remain |
| FR-03 | Project detail tabs (Overview, Achievement, Risk & Issue, Comment, Dashboard, Documentation, KPI, Change History) | ✅ SHIPPED 2026-08-03 (mapping ASSUMED: Overview=cards+fields+people · Achievement=milestones+action items · Risk & Issue=risks+issues · Comments=updates · Documentation=links+resources+reports+attachments · Change History=NEW project-wide audit feed incl. deletions via `GET /projects/:id/history`; Dashboard tab LIVE 2026-08-12 — Fig 8/9 per-project charts; KPI is the last stub, pending linkage). Sticky SectionNav is tab-aware |
| FR-04 | Actual/planned progress, milestones done/total, budget cards | ✅ SHIPPED 2026-08-03: overview cards on the project page (progress vs plan with delta + F4 suggestion, milestone donut, budget utilization with over-budget flag, open items) |
| FR-05 | Milestone status donut (Completed / Not Started / On Target) | ✅ SHIPPED 2026-08-03 (buckets ASSUMED: Completed / On Target / Overdue from status+due date; FDD bucket names remain the milestone-status ASK). CVD-validated chart trio, legend with counts |
| FR-06 | Task lists with upcoming/completed grouping, detail drawer, attachments/work notes | ✅ 2026-08-13: Fig-2 Tasks card on the project Overview (Upcoming/Completed toggle with counts, overdue reddened, milestone context, click-through + jump to Achievement). Detail lives on pages not drawers (deliberate); task-level attachments ✅ 2026-08-13 (Attachments tab on the action-item page, see 1.7) |

| FR-07 | Risk & issue register with score/severity/audit | ✅ SHIPPED 2026-08-03 (`db/fdd_risks.sql`): unified RISK/ISSUE register on the project page, F3 score + severity dot (PROVISIONAL), full audit via record_history; record-level risk-owner update rights added with FR-15 |
| FR-08 | Identify New Risk modal | ✅ SHIPPED 2026-08-03: Screen-06 dialog (statement, date identified, source, category, owner, probability/impact with live score, response, response plan, priority, action, status, type) |
| FR-09 | Adjust Weights modal (milestone dates + weights grid) | ✅ SHIPPED 2026-08-03 (weights grid enforcing total=100; dates edited per-milestone — ASSUMED split); atomic via `db/adjust_milestone_weights.sql` since 2026-08-17; manage-level access since FR-15 |
| FR-10 | Dashboards: initiative counts/status, budget utilization, cycle submission status, monthly breakdowns | ✅ Fig-15 SHAPE SHIPPED 2026-08-13: executive row on My Dashboard (initiative buckets per F5 PROVISIONAL, portfolio budget bar, cycle-submission widget with click-through, monthly done/due strip) above the existing live charts |

| FR-11 | KPI dashboards / scorecards | ✅ SHIPPED: registry + readings + action plans (2026-08-05) + scorecards 2026-08-18 — F6 achievement % (polarity-aware, toned badge) and F7 data-quality index per KPI row, per the delegated formula decisions. Remaining: optional project linkage (stage c) |
| FR-12 | Report generation + Excel export | ✅ PARTIAL 2026-08-13: named printable reports under /reporting — Initiative Progress (planned vs calculated per F1/F2, delta + F5 bucket, worst first) and Monthly Performance (milestones due/done/completed + submissions/approvals per month, year switcher) — join the existing per-project Progress report and Cycle Submission Status. Export stays CSV (FR-13 confirm modal); native .xlsx not built (ASSUMED CSV sufficient) |
| FR-13 | Download confirmation modal | ✅ SHIPPED 2026-08-03: confirm dialog (record count) before the CSV export |
| FR-14 | Workflow states: submit/review/return/approve/close | ✅ ASSUMED+SHIPPED 2026-08-03; cycle CLOSE (+reopen) 2026-08-13 locks all transitions (see 1.6) — routing/exact closure rules remain OI-03 questions |
| FR-15 | Role-based restriction of create/update/approve/admin | ✅ PARTIAL 2026-08-17: full matrix from section 8 ENFORCED (global AppRoleGuard + ProjectAccessGuard, fail-closed on project routes; restricted projects filtered from every list/aggregate; frontend hides ungranted affordances). Requires `db/app_role.sql`. Remaining: the 3 delegated-authority questions (OI-01) |

## 3. Use cases UC-01…18 — acceptance checklist
UC-01 list view · UC-02 filters · UC-03 Excel export+confirm · UC-04 detail tabs ·
UC-05 edit master details · UC-06 overview KPI cards · UC-07 task drawer update ·
UC-08 adjust weights · UC-09 Gantt/roadmap · UC-10 risk & issue register ·
UC-11 new risk modal · UC-12 submit progress report · UC-13 return submission ·
UC-14 portfolio dashboard · UC-15 fiscal-year report · UC-16 KPI scorecards ·
UC-17 PMO hierarchy tree · UC-18 project details report.
(Track pass/fail per UC as features land — each finished stage must name which UCs it satisfies.)

## 4. Key validations / business rules (FDD 3.3.2)
- Mandatory project fields (name, reference ID, plan year, owner, sponsor, sector, end date, approved budget) — ✅ ASSUMED+SHIPPED 2026-08-03: enforced in the UI (wizard steps 1/3 + edit dialog; not retroactive on stored rows; wizard's required first member stands in for owner at create, `owner_id` enforced from first edit). Sponsor + target end date finally exposed in forms. Exact list remains OI-05
- Progress numeric, 0–100
- **Milestone weights must total 100% before submission** — ✅ SHIPPED 2026-08-03: `PATCH /projects/:id/milestones/weights` rejects totals ≠ 100 (or all-null to clear); Adjust Weights dialog (UC-08) with live total; amber warning above the milestones list. Hard submission block lands with Wave 4's workflow
- Utilized ≤ approved budget; highlight on threshold breach (threshold = ASK)
- Risk: probability, impact, owner, response, action, status mandatory
- Submission blocked if mandatory data incomplete — ✅ SHIPPED 2026-08-03 (server-side gate on submit: 3.3.2 fields + weights=100)
- Download confirmation before exports
- Audit: created/updated by+date everywhere (we have this + `record_history`)

## 5. Reports & notifications (defer until math lands)
Reports: Project Progress ✅ SHIPPED 2026-08-03 (printable page per project via
its Report button: register fields, three progress figures, milestone/risk/issue
tables, cycle status; print-ready via Tailwind print: variants), Cycle Submission
Status ✅ SHIPPED 2026-08-03 (`GET /reports/cycle-status` + printable portfolio
table; the sidebar Reporting stub is now a live reports hub). Still pending:
Initiative Progress, Monthly Performance, Program Roadmap (Gantt), Change vs
Plan, Project Details, KPI/scorecards.
Notifications (FDD 3.9) — ✅ PARTIALLY SHIPPED 2026-08-03 (ASSUMED in-app first,
OI-07): `notifications` table (`db/fdd_notifications.sql`, RLS + index), header
bell with unread badge / mark-read / mark-all. Event-driven producers live:
submitted → PMO Partner, validated → Owner, approved/returned/rejected → 
submitter, budget threshold crossing 80% (threshold ASSUMED) → Owner + PM; all
best-effort and self-notification-suppressed. Time-based triggers SHIPPED
2026-08-07 via `@nestjs/schedule` (in-process, no infra): a daily 07:00 sweep +
idempotent catch-up on boot creates due-soon (today/tomorrow) and overdue
reminders for open action items and milestones — recipients are the record's
owners, falling back to PM then project owner; the dedup key
(`reminder:<kind>:<record>:<id>:<due>`) embeds the due date so replans re-arm
reminders and repeats are no-ops (`notifications/reminders.service.ts`, logic
unit-tested). ✅ 2026-08-13, the two remaining 3.9 triggers: (1) pre-cycle
"progress update pending" — in the last 5 days of the month (window ASSUMED)
the daily sweep nudges the PM (fallback: owner) of every project whose
current-cycle submission is missing/draft/returned, once per project per cycle
(`reminder:submission_pending:project:<id>:<period_start>`), skipped when the
cycle is closed; (2) high-severity open risk — saving a risk/issue in the F3
red band (probability x impact >= 6, PROVISIONAL) alerts PM + project owner
once per risk (`risk_high:<id>` dedup, self-notification suppressed,
best-effort). Still deferred: email (needs SMTP).

**Code Table Administration — ✅ SHIPPED 2026-08-08** (from the original-app
roadmap, supervisor-independent): `/admin/code-tables` (sidebar Administration
item, stub retired) manages all 20 lookup tables — create, rename, up/down
reorder (renumbers and heals null/duplicate sort values), activate/deactivate.
No hard delete (FK-referenced values; deactivation removes them from pickers
while existing records keep rendering). Per-table extras editable where they
drive app behavior: status `color`, issue-level `rank`, role
`default_access_level`. API: `GET /lookups` (admin listing incl. inactive) +
`POST/PATCH /lookups/:name/values[...]`, cache-invalidating. ASSUMED: open to
any signed-in user until the security phase adds role gating (FR-15).

**Global search + saved searches — ✅ SHIPPED 2026-08-11** (original-app
roadmap, supervisor-independent): the Ctrl+K palette is now server-backed —
`GET /search?q=` runs parallel case-insensitive substring matches across
projects (name/description/number/reference), milestones, action items,
issues, risks, and KPIs (8 hits per kind), each result deep-linking to its
page. Saved searches are per-user (`saved_searches` table,
`backend/db/search_saved.sql`, RLS enabled): shown in the empty palette,
re-run on click, saved via a "Save this search" row. Deliberately NOT
full-text over update/comment bodies (one-line extension later if wanted).

**Cross-project registry pages — ✅ SHIPPED 2026-08-11** (sidebar stubs
retired, supervisor-independent): read-only `registry` module (dashboard-style
aggregation precedent) serving `GET /milestones`, `GET /action-items`,
`GET /people`. Pages: `/milestones` (grouped by project; status/overdue/text
filters; weight + outcome shown), `/action-items` (same + "Assigned to me"
toggle), `/people` (directory grouping real + pending members with expandable
memberships/roles), `/categories` (count cards drilling into the register via
`?category=`, which HomePage now reads — register filters became shareable
links). Filters are client-side at current scale; server params + pagination
when volume demands.

**Tags — ✅ SHIPPED 2026-08-11** (write side existed since Phase 1; this wave
added the read side): shared `TagChips` component renders tags on register
cards, project-page milestone/action-item rows, the updates feed, overview +
milestone/action-item detail fields (chips instead of joined text), and the
global Milestones/Action Items registers (tags also match their text
filters). Register gains a Tag filter (distinct tags of loaded projects) +
chip-click filtering, wired to `?tag=` like `?category=`. Deliberately not
rendered: links rows (gold flag carries their emphasis) and the Fig-1 grid
table (register-column parity).

**Portfolio Timeline — ✅ SHIPPED 2026-08-11 on frappe-gantt** (1.2.2, MIT —
the app's only charting library, per Fares's direction; dashboard charts stay
hand-rolled). SVAR React Gantt was tried first and REJECTED the same day: its
wrapper reads React-18-only internals (`ReactCurrentDispatcher`, removed in
React 19) and crashes at runtime. frappe-gantt is framework-agnostic SVG — no
React coupling, no peer-version risk. Projects are bars (status-token colors
via CSS overrides, calculated-progress fill, progress handle read-only);
milestones one-day "◆" rows under their project (done green / overdue red),
toggleable. **Drag/resize writes dates** through the normal PATCH endpoints
(history trigger records it); click opens the record. Week/Month zoom +
Active/Done/All + name filter; dark-mode readability overrides included.
Gotcha logged: the package's exports map hides its css — imported by direct
node_modules path.

**Per-project Dashboard tab — ✅ SHIPPED 2026-08-12** (Fig 8/9; FR-03's
seventh tab, leaving only KPI stubbed): planned-vs-actual line chart
(hand-rolled SVG; PROVISIONAL reconstruction — no progress history is stored,
so actual = cumulative milestone weight completed by month-end, planned =
cumulative weight due, time-elapsed fallback when weights/dates are missing),
Budget Status donut (utilized vs unutilized of approved, gold token), and a
the Fig-9 FULL Gantt on **dhtmlx-gantt Community 10.0.1** (MIT since v10,
June 2026 — verified on npm; framework-agnostic imperative widget, so no
React-version coupling): outcome parent rows with nested milestones, ID
column (1.1 numbering), progress-filled status-colored bars, read-only with
click-through (rescheduling stays on the portfolio Timeline). Today marker is
PRO — drawn by hand via posFromDate + scroll sync. Singleton hygiene:
clearAll() on unmount, never destructor(). The tab is lazy-loaded so
DHTMLX's ~227 kB gzip chunk loads only when opened. Library roster:
frappe-gantt stays on the Timeline; SVAR's NEW @svar-ui/react-gantt 2.7.1
(MIT, react>=18) re-vetted as viable fallback — the old wx-react-gantt
rejection no longer applies.

**Gantt hierarchy pass — ✅ SHIPPED 2026-08-12**: the project Gantt now shows
the full Project → Outcome → Milestone → Action Item tree (action items as
third-level rows under their milestone, click-through to their pages);
milestones WITHOUT a start date render as classic point-in-time DIAMONDS.
Outcome creation got its own form ("Add Outcome" beside Adjust Weights;
OutcomeDialog is now dual create/edit). **Milestone dependencies —
ENHANCEMENT beyond the FDD** (Appendix A has no predecessor concept; added on
Fares's direction): `backend/db/milestone_dependencies.sql` (join table, RLS
— milestone endpoints 500 until run), "Depends on" multi-select in the
milestone dialog (wholesale set replace), finish-to-start arrows drawn on the
Gantt. Informational only — no auto-scheduling (DHTMLX PRO + no business
mandate). Zero backend —
fed by data the page already loads. Data = existing `projectsApi.list` + `GET /milestones`
— zero backend work.

**Bulk data load — ✅ SHIPPED 2026-08-11** (original-app roadmap; also the
ready tool for OI-06, "migrate his spreadsheet"): `/import` wizard (Import
button on the register) — Upload (file or paste, hand-rolled CSV parser in
`lib/csv.ts`, 500-row cap) → Map columns (auto-matched, adjustable, ignored
columns allowed) → Preview (per-row OK/warning/error; errors skip the row,
unmatched lookup values warn and import empty, duplicate names warn) →
Results (created/failed per row). Create-only by design; mass-update stays a
separate future feature. Server is the authority: `POST /import/projects|
milestones` re-resolves lookup names case-insensitively, coerces dates
(yyyy-mm-dd or dd/mm/yyyy) and numbers, and inserts through the normal
services so audit/history behave like manual creation (logic unit-tested; 36
backend tests total).

**Project Tree view — ✅ SHIPPED 2026-08-11** (original-app roadmap, read side
of the Phase-1 `parent_project_id` FK): the register's view toggle gains a
Tree mode — roots with indented, collapsible children (arbitrary depth,
cycle-guarded), sub-project counts, progress % + status pill per node, click
through to the project. Register filters apply; a child whose parent is
filtered out surfaces at root. Zero backend work; demo pair seeded (Outreach
Vans under Screening Expansion).

**Project Templates — ✅ SHIPPED 2026-08-11** (last supervisor-independent
module; the buildable board is now CLEAR): `backend/db/project_templates.sql`
(single jsonb-payload table, RLS) — endpoints 500 until run. "Save as
Template" on the project header snapshots field defaults + outcomes +
milestones (weights, major flags; dates stored as day-offsets from project
start). "From Template" beside Create Project lists templates (counts,
hover-delete), takes name + start/target dates, and instantiates through the
normal services (audit/history like manual creation) with the schedule
shifted to the new start. Not copied by design: people, action items,
progress, budgets. Offset math unit-tested (41 backend tests). Remaining
original-app leftovers: Merge + Validations, consciously unplanned.

**Account provisioning for pending people — ✅ SHIPPED 2026-08-11**
(`backend/db/pending_member_email.sql` — people endpoints 500 until run):
pending members now REQUIRE a validated email (`pending_email`, the linking
key; a "PoC email" generator produces unique fake @poc.ptrack.local addresses
for proof-of-concept people). "Create account" (project People rows + People
directory) provisions a real login via the Supabase Admin API (pre-confirmed,
temp password shown once, profile upserted) and auto-claims every pending
membership with that email — collisions with an existing membership delete
the pending row (unique constraint; planClaim unit-tested, 44 backend tests).
Sign-in also fires a claim, so self-registered users link automatically.
Step 2 drafts an invitation from project context (editable, mailto: opens the
admin's own mailbox + copy button) — in-app sending stays gated on SMTP, and
AI generate/refine slots into the same compose box once an LLM key is
configured (the AI Assistant's first real feature). NOTE: wizard-created
pending members still lack emails (add later via Edit Person, which now
requires one); and until the security phase, any provisioned account has full
access — distribute credentials accordingly.

## 6. Open questions for the supervisor (blockers marked ⛔)

**DELEGATION 2026-08-18 — this section is now historical.** The supervisor
reviewed the progress summary and delegated decisions 1-6 (formulas incl. the
KPI math, delegated authority, KPI linkage, field behaviors, data, and the
remaining LOV/numbering questions) to the team: "we should decide." Decisions
taken same day:
- **Formulas:** F1-F5 confirmed as documented; F6 (KPI achievement %) and F7
  (data-quality index) defined — see FORMULAS.md, all now DECIDED. The 80%
  budget threshold is confirmed.
- **Delegated authority (was OI-01/OI-03):** the shipped behavior is policy —
  PMO Partner validates, Project Owner approves, the `pmo` role may return,
  cycle close locks all transitions, read-only viewers see open projects only,
  executives get aggregates but no restricted drill-down. Future changes are
  Permissions-grid edits.
- **KPI linkage (was the Fig 8 KPI-tab question):** KPIs stay entity-level and
  gain an OPTIONAL `project_id`; linked KPIs appear in that project's KPI tab,
  unlinked ones remain portfolio-level.
- **Field behaviors:** every free-text field (sponsor, customer, target group,
  stakeholders, identified/reported by, risk priority/action) stays free text
  permanently.
- **Data:** seeded demo data until a real spreadsheet arrives; import wizard
  stands ready.
- **LOVs & numbering:** current seeds stand (statuses = FDD five + demo
  values; probability/impact Low/Medium/High 1-3), all admin-editable in Code
  Tables; reference ID stays free text (no auto-numbering); milestone buckets
  keep Completed/On Target/Overdue; utilized budget stays manual; the
  P-Track-only fields (size, access control, goal, tags, primary URL) are
  KEPT.
- **Email:** supervisor said "use SMTP if you can" — email subsystem to be
  built env-driven; sending activates when credentials exist. **AI features:**
  to be discussed with the supervisor later.

**Meeting outcomes 2026-08-11** (first supervisor sync since the assumed-FDD
build): LOV questions ANSWERED — "use generic values, and make every dropdown
an ID'd, admin-modifiable list" (= exactly the shipped Code Table
Administration page). Actions taken same day: generic value sets seeded
(`backend/scripts/seed-generic-lookups.mjs`) for Sectors (+Community Health,
Communicable Diseases), Type (= `deal_types`, 5 generic values, dropdown now
surfaced on wizard/edit/overview + `deal-types` in the lookups registry),
Statuses (standard five stay active; Hot/Elevated/On Track/Complete/Dormant/
Unknown DEACTIVATED, not deleted), Tiers (1/2/3 confirmed), Objectives (4
generic) + Programs (2 per objective, cascade confirmed as built). Plan Year =
fiscal year: dropdown FY24-FY30 (stores full year; legacy 2-digit values
normalized on edit). External Stakeholders confirmed plain text chips —
no lookup. Field-behavior questions (utilized budget, person fields, IDs,
mandatory list, manual progress, at-risk): keep as plain editable fields
as shipped; supervisor will send a finalized document — the 3.3.2 submission
gate stays as shipped meanwhile. Flex Columns confirmed OUT (original-app
only, not in FDD).
1. (OI-02) Formulas — PROVISIONAL standard set adopted 2026-08-03 on Fares's authority and implemented (docs/FORMULAS.md F1-F4: calculated progress, planned progress, risk score+severity, at-risk suggestion). Sign-off still requested; KPI achievement % and data-quality index deliberately NOT implemented (policy numbers, not standards).
2. ~~Sector vs our category; Tier values; Type vs deal_type; status value mappings~~ **ANSWERED 2026-08-11: generic admin-managed values (see meeting outcomes above); Type = deal_types.** Milestone status buckets unchanged (open/closed/NA).
   2b. **Discovery (2026-07-29):** Reference IDs in the FDD look like `1.1.1` — dotted numbering that plausibly encodes the strategy hierarchy (objective.program.project). If confirmed, Reference ID is derivable from the Strategic Program cascade, not free text.
3. ⛔ (OI-03) Workflow routing: who reviews/validates/approves; return rules; cycle calendar (monthly? Fig 32 shows 12 cycles/yr).
   **Discovery (2026-07-29):** the Fig 10 approval-chain names are the Fig 11 person fields (Project Manager → REVIEW, PMO Partner → VALIDATE, Project Owner → APPROVE). Answering the person-fields question therefore also defines the workflow actors; the two must be designed together.
4. (OI-05) Exact mandatory fields + LOV values for project/milestone/risk/issue forms.
5. Utilized budget: manual entry or finance-derived?
6. Task-level progress % and task-level attachments — in scope?
7. Manual vs calculated progress: both shown in list (Fig 1) — is manual user-entered at project level?
8. (OI-01) Role matrix — which of the 7 FDD roles map to our access levels; when does enforcement land?
9. (OI-06) Data migration from his spreadsheet (Fig 12) — needed?
10. Scope check: PMO/organization hierarchy dashboards (Figs 19–24) — this cycle or later?

## 7. Execution roadmap
- **Stage 1 — Data collection alignment (NOW):** schema migrations + form/dialog updates so every Appendix-A field can be captured. Order: 1) `projects` extensions + lookups → Edit Project/Wizard forms; 2) `program_outcomes` + milestone wiring; 3) `action_items` extensions; 4) `risks` module (full new record type); 5) `issues` extensions; 6) attachment parent-scoping (after ASK). Each step: SQL (RLS on!) → DTOs/service → dialog fields (FDD Fig 11/6 as field-mapping evidence) → Swagger → tests → suggest commit.
- **Stage 2 — Math:** calculated progress engine + weights validation + Adjust Weights UI (FR-09, UC-08); planned vs actual; budget cards (FR-04/05, UC-06).
- **Stage 3 — Workflow:** cycles + submissions state machine + drawer (FR-14, UC-12/13).
- **Stage 4 — Dashboards/reports made real** (FR-10/12/13; charting-library decision point).
- **Stage 5 — KPIs/scorecards** (FR-11, UC-16/17) — last; most formula-dependent.

### Recorded requirements from Fares (2026-08-11) — AI-assisted invitations

Captured as REQUIREMENTS (not just deferrals) so they survive into the next
build phases. Origin: Fares's design for account provisioning, stated before
the feature was built; the shipped drafter dialog was structured so both land
in it without rework.

1. **AI-generated invitation emails with project context.** When creating an
   account for a person (with a real email), the app should offer an
   AI-generated invitation drawing on project context (project name, role,
   who added them, dates). The author can: write their own message from
   scratch, accept the AI suggestion as-is, edit it manually, or **instruct
   the AI to revise it** ("make it more formal", "shorten it"). UNBLOCKS
   WHEN: an LLM API key is configured server-side (key stays in backend
   .env; becomes the AI Assistant's first real feature). Until then the
   dialog shows the deterministic template draft.
2. **In-app sending of those invitations.** Today the drafter hands off via
   mailto:/copy (sent from the admin's own mailbox). The requirement is real
   sending from P-Track itself — one Send button on the same compose box —
   which joins the notification-email subsystem. UNBLOCKS WHEN: SMTP (or an
   email API) is available.

## 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit")

FR-15 (Must Have) mandates role-based restriction. FDD 3.2 defines seven roles; this model
maps them onto data we already store plus ONE new column. FDD scope explicitly excludes
authentication config/SSO — this is authorization only. RLS policies stay deferred by
decision: deny-all already blocks the only path they would guard (direct PostgREST), and
NestJS enforcement is the real gate.

**Global roles — new `profiles.app_role`** (`admin` | `pmo` | `executive` | `user`, default
`user`; migration `db/app_role.sql`): admin = FDD System Administrator · pmo = PMO
Administrator · executive = Management/Executive Viewer · user = everyone else. FDD roles
3/4/5 need no column: Project Owner = `projects.owner_id` / membership `access_level`
(live data uses all three tiers: read_only < read_write < read_write_admin) · Risk/Issue
Owner = `risks.owner_id` on that record · Reviewer/Approver = existing
`pmo_partner_id`/`owner_id` actor rules. Effective permission = max(global role, project
relationship, record ownership). Project routes fail closed.

| Surface | Required |
| --- | --- |
| Code Tables admin (lookup mutations), CSV Import, account provisioning/claim | `admin` |
| Create project | `pmo`/`admin` (FDD 3.1 step 1: "Project Owner / PMO" — ASSUMED PMO-gated; loosen if Fares vetoes) |
| Cycle close/reopen | `pmo`/`admin` (FDD 3.1 step 8 assigns closure to PMO) |
| View open project + its sections | any authenticated |
| View restricted project | member, `pmo`, `admin` (+`executive` read-only — OPEN, see Q3) |
| Write inside project (milestones, action items, links, resources, issues, updates, status reports, attachments, outcomes, submit) | membership `read_write`+, or project owner/PM, or `pmo`/`admin` |
| Manage project (PATCH master, delete, people, adjust weights) | membership `read_write_admin`, project owner, `pmo`, `admin` (weights per FDD 3.1 step 2) |
| PATCH a risk/issue | project-write rule **or** that risk's `owner_id` (FDD role 4, record-level) |
| Submission validate/approve | existing Fig-10 actor rules; `pmo` may additionally return ("return/approve where authorized") |
| Dashboards, search, registries, timeline, reports (GET) | any authenticated; results filtered to visible projects for `user` role |
| KPI registry mutations | `pmo`/`admin` (governance data); readings/plans viewable by all |
| Notifications | own rows only (already) |

**Narrowed OI-01 questions for the supervisor:** (1) who besides PMO Partner / Project
Owner holds Reviewer/Approver "delegated authority"? (2) what exactly is Read-only
Viewer's "assigned access"? (3) do Executive Viewers see restricted projects
(assumed: aggregates yes, drill-down no)?

SHIPPED 2026-08-17, all five stages: `db/app_role.sql` (Fares runs; until then every
account is plain `user` and admin/PMO surfaces 403 — fail-safe, nothing else breaks) ·
`common/access/` module (pure `access.logic.ts` + cached AppRole/ProjectAccess services +
two global guards, 10 unit tests) · full route sweep per the matrix above (risk PATCH
admits viewers so the service can allow the risk's own owner — FDD role 4) · read-side
filtering of restricted non-member projects across projects list, search, registries,
dashboard aggregates, both named reports and cycle-status (updates/history activity
counts stay global: their rows carry no project linkage and name nothing) ·
`GET /users/me` + frontend gating (Administration nav + Import admin-only, Create
Project/From Template pmo+, Edit Project/Adjust Weights manage-level, Add Outcome
write-level, via `lib/use-me.ts` + `lib/access.ts` mirror). Frontend hiding is UX only;
guards enforce. Finer per-section button hiding = polish backlog.

**UI-managed authorization — SHIPPED 2026-08-17** (FDD role 1: "configure ... roles",
per Fares: the security phase must include this as UI). The capability CATALOG is code
(8 keys in `access.logic.ts`, each mapped to guarded routes via `@RequireCapability`);
WHICH ROLE HOLDS WHICH capability is data (`role_capabilities`,
`db/role_capabilities.sql`, seeded = the previous hard-coded matrix so day-one behavior
is identical; unreadable table falls back to the code seed). Hard-coded on purpose:
admin bypasses all capability checks (the system can never be configured into an
unfixable state) and the per-project view/write/manage ladder stays code (structural,
not role policy). Administration → **Users & Roles** page: Users tab (global-role
dropdown per account; demoting the last admin is refused) + Permissions tab (role ×
capability grid, admin column locked). Every change audited to `access_audit`
(record_history can't hold these — its project_id is NOT NULL). When OI-01's
"delegated authority" answers arrive, they become new catalog keys + grid rows, not a
redesign.

## 9. Conventions carried forward
Field-mapping evidence rule now points at **FDD figures** (ask for hi-res PNG when field-level
detail is unreadable) · one feature at a time, plan → approve → build → verify → user commits ·
formulas recorded in `docs/FORMULAS.md` with supervisor confirmation date · unit tests on all math.
