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
| Strategic Program | — | ASK — program hierarchy vs our `parent_project_id`? |
| Tier | — | ✅ EXTEND (lookup `tiers` + FK) — seeded Tier 1/2/3 |
| Type | `deal_type_id` exists | ASK — is deal_type the FDD "Type" or new lookup? |
| Sector | `category_id`? `region_id`? | ASK — sector may map to category, or be its own lookup |
| Status | `status_id` | HAVE (values differ — FDD: In Progress etc. → ASK mapping) |
| Start / End Date | `start_date`, `target_end_date` | HAVE |
| Actual end | `actual_end_date` | HAVE |
| Approved Budget (AED) | — | ✅ EXTEND (`approved_budget numeric`) |
| Utilized Budget (AED) | — | ✅ EXTEND (`utilized_budget numeric`, manual for now) — ASK: manual entry or derived? |
| Finance Code | — | ✅ EXTEND (`finance_code`) |
| Owner / Project Owner | `owner_id` | HAVE |
| Sponsor | `sponsor` (text) | HAVE |
| Project Manager / Manager 2 / PMO Partner | via `project_members` roles | ASK — dedicated FKs vs member roles |
| Internal / External Stakeholders | — | internal ✅ (`internal_stakeholder` text); external = multi-select chips (Fig 11) → join table, ASK pending |
| Target Group | — | ✅ EXTEND (`target_group` text) |
| Priority flag | — | ✅ EXTEND (`is_priority boolean`) — star toggle in forms |

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
| Attachment reference | attachments are project-scoped | ASK/EXTEND — task-level attachments need `attachments.parent_type/parent_id` generalization |
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

### 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3)

### 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST)
KPI definition (Fig 27): name, type/tier, description, priority flag, pillar, entity,
owner, strategic objective, unit, polarity, decimal precision, data source, calculation
method (text), reporting frequency, rationale, baseline/target. Readings (Fig 28):
value + attachments + performance analysis. Action plans (Fig 29). Data-quality
index (timeliness/completeness/reliability, Figs 30–31) — **formulas = ASK (OI-02)**.

---

## 2. Functionality inventory (FDD FR-01…15 → status)

| FR | Summary | P-Track status |
|---|---|---|
| FR-01 | Project register grid: filters, pagination, sort, status indicators | PARTIAL — filter rail + status pills exist; no manual/calculated progress columns, no grid view. 2026-07-30: home cards show a **milestone-completion** bar (done/total, labeled "Milestones") + open-issue counts via `GET /projects` aggregates — deliberately NOT the FDD's calculated progress, which awaits OI-02 formula sign-off (docs/FORMULAS.md rule); swap the bar to official progress when it lands |
| FR-02 | Navigation: lists / views / reports / dashboards | PARTIAL — shell + stub items exist |
| FR-03 | Project detail tabs (Overview, Achievement, Risk & Issue, Comment, Dashboard, Documentation, KPI, Change History) | PARTIAL — sections exist; tab layout + missing tabs to map |
| FR-04 | Actual/planned progress, milestones done/total, budget cards | MISSING (math phase core) |
| FR-05 | Milestone status donut (Completed / Not Started / On Target) | MISSING (chart system ready) |
| FR-06 | Task lists: upcoming/completed, drawer, attachments, work notes | PARTIAL — action items + comments exist; drawer/grouping missing |
| FR-07 | Risk & issue register with score/severity/audit | PARTIAL — issues yes, risks no |
| FR-08 | Identify New Risk modal | MISSING |
| FR-09 | Adjust Weights modal (milestone dates + weights grid) | MISSING (columns exist) |
| FR-10 | Portfolio dashboards: initiatives, budget, cycle status, monthly breakdown | MISSING (sample dashboard is placeholder) |
| FR-11 | KPI dashboards / scorecards | MISSING |
| FR-12 | Report generation + Excel export | MISSING |
| FR-13 | Download confirmation modal | MISSING |
| FR-14 | Workflow states: submit/review/return/approve/close | MISSING |
| FR-15 | Role-based restriction of create/update/approve/admin | PARTIAL — access_level data exists; enforcement deferred (security phase) |

## 3. Use cases UC-01…18 — acceptance checklist
UC-01 list view · UC-02 filters · UC-03 Excel export+confirm · UC-04 detail tabs ·
UC-05 edit master details · UC-06 overview KPI cards · UC-07 task drawer update ·
UC-08 adjust weights · UC-09 Gantt/roadmap · UC-10 risk & issue register ·
UC-11 new risk modal · UC-12 submit progress report · UC-13 return submission ·
UC-14 portfolio dashboard · UC-15 fiscal-year report · UC-16 KPI scorecards ·
UC-17 PMO hierarchy tree · UC-18 project details report.
(Track pass/fail per UC as features land — each finished stage must name which UCs it satisfies.)

## 4. Key validations / business rules (FDD 3.3.2)
- Mandatory project fields (name, reference ID, plan year, owner, sponsor, sector, end date, approved budget) — confirm exact list (OI-05)
- Progress numeric, 0–100
- **Milestone weights must total 100% before submission**
- Utilized ≤ approved budget; highlight on threshold breach (threshold = ASK)
- Risk: probability, impact, owner, response, action, status mandatory
- Submission blocked if mandatory data incomplete
- Download confirmation before exports
- Audit: created/updated by+date everywhere (we have this + `record_history`)

## 5. Reports & notifications (defer until math lands)
Reports: Project Progress, Initiative Progress, Monthly Performance, Program Roadmap
(Gantt), Change vs Plan, Project Details, Cycle Submission Status, KPI/scorecards.
Notifications (FDD 3.9): progress reminder, returned, approved, risk overdue, budget
threshold, milestone overdue — channel undecided (OI-07); ties to the long-planned
notification subsystem.

## 6. Open questions for the supervisor (blockers marked ⛔)
1. ⛔ (OI-02) Formulas: calculated progress roll-up, planned progress over time, risk score, KPI achievement %, data-quality index.
2. ⛔ Sector vs our category; Tier values; Type vs deal_type; status value mappings (project + milestone buckets).
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

## 8. Conventions carried forward
Field-mapping evidence rule now points at **FDD figures** (ask for hi-res PNG when field-level
detail is unreadable) · one feature at a time, plan → approve → build → verify → user commits ·
formulas recorded in `docs/FORMULAS.md` with supervisor confirmation date · unit tests on all math.
