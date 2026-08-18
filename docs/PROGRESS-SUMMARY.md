# P-Track progress summary

Prepared by Fares Al Areefi · 18 August 2026
For review against the Project Tracker Functional Design Document (FDD)

## 1. Where the project stands

P-Track is the ground-up rebuild of the Oracle APEX project tracker as an independent
web application (React frontend, NestJS middle tier, Supabase database), governed by
the FDD since 21 July 2026. Following your delegation of the open decisions on
18 August, every functional requirement in the FDD is now built, and every previously
open question has a recorded answer. The two remaining items each wait on one thing:
email sending waits on an SMTP credential, and the AI features wait on our upcoming
discussion.

The codebase carries 158 backend and 47 frontend automated tests, and every commit
passes type checking, linting, and the full test suite in CI before it lands.

## 2. What is built, by area

**Project registry and records.** Projects with the full FDD field set (reference ID,
plan year, budgets, tiers, sectors, strategic objectives and programs, deal types,
stakeholders, tags), a four-step creation wizard, project templates, and CSV bulk
import with a preview step. Every record type in the FDD exists with full create,
read, update, and delete: milestones, program outcomes, tasks (action items), links,
resources, issues, risks, updates, status reports, people, and attachments, including
task-level attachments per Appendix A. The register and the three global record
registries all export CSV behind the FR-13 confirmation.

**Planning and progress.** Outcomes group milestones, milestones carry weights and
dependencies, and tasks sit under milestones. The project dashboard tab shows
planned-versus-actual progress, a budget donut, and a full Gantt chart (outcome,
milestone, and task levels with dependency arrows and milestone diamonds). Weight
adjustment is enforced to total exactly 100 and applied atomically. Progress figures
across the application use the confirmed formulas (section 4).

**Reporting cycle workflow (FR-14).** Monthly cycles with the submit, validate,
approve, return, and reject states from Fig 10. The PMO Partner validates and the
Project Owner approves where those people are set. Cycles can be closed and reopened;
a closed cycle locks every transition.

**Dashboards and reports (FR-10, FR-12).** The executive dashboard row from Fig 15
(initiative buckets, portfolio budget, cycle submission status, monthly breakdown), a
personal "My work" strip, and the earlier live charts. Printable reports: Cycle
Submission Status, Initiative Progress, Monthly Performance, and a per-project
progress report.

**KPIs (FR-11), now complete.** The registry with readings and action plans carries
live scorecards: a polarity-aware achievement percentage against target and a
data-quality index (timeliness, completeness, reliability) on every KPI. KPIs can
optionally be linked to a project, and linked KPIs appear on that project's KPI tab,
which was the application's last stub and is now live.

**Notifications (3.9).** In-app notifications with a bell, unread badge, and
per-type deep links. Live triggers: workflow transitions, budget threshold crossings
(80%), due-soon and overdue reminders, a pre-cycle nudge for projects that have not
submitted, and an alert when a high-severity risk is saved. Email delivery waits on
section 6.

**Administration and account experience.** Code Tables (every lookup list editable in
place), account provisioning for pending people, a Users & Roles page (global role
assignment plus a live role-by-capability permission grid, fully audited), a personal
profile page (display name, permissions, memberships, open work, password change),
a redesigned sign-in page with a self-service password-reset flow, and a Ctrl+K
command palette whose actions respect each user's permissions.

**Security (FR-15).** Role-based access control enforced in the middle tier and
verified end to end with a live two-account test. Restricted projects are invisible
to unrelated users everywhere, including search, dashboards, and reports, and answer
as not-found rather than forbidden so their existence does not leak. The interface
grays out anything the signed-in user is not permitted to do, with the reason shown
on hover.

## 3. The fifteen functional requirements, one by one

| FR | Requirement | Status |
| --- | --- | --- |
| FR-01 | Project register grid with filters, sorting, status | Shipped; the progress column shows the confirmed F1 calculation |
| FR-02 | Application navigation | Shipped, except the AI Assistant entry (section 6) |
| FR-03 | Project detail tabs | Shipped, all eight tabs live including KPI |
| FR-04 | Overview cards (progress, milestones, budget) | Shipped |
| FR-05 | Milestone status donut | Shipped |
| FR-06 | Task lists with grouping and attachments | Shipped, including task-level attachments |
| FR-07 | Risk and issue register with scoring | Shipped, F3 scoring confirmed |
| FR-08 | Identify New Risk form | Shipped with the full field set |
| FR-09 | Adjust Weights | Shipped; total must equal 100, saved atomically |
| FR-10 | Executive dashboards | Shipped, F5 buckets confirmed |
| FR-11 | KPI scorecards | Shipped in full: registry, readings, plans, achievement % (F6), data-quality index (F7), project linkage |
| FR-12 | Report generation and Excel export | Four printable reports shipped; export is CSV by decision |
| FR-13 | Download confirmation | Shipped |
| FR-14 | Submission workflow with cycle close | Shipped |
| FR-15 | Role-based access restriction | Shipped and enforced; delegated-authority details resolved by decision |

## 4. Decisions taken under your delegation (18 August)

You delegated the open decisions to the team; here is what each became. All are
recorded in the project's decision registers and each remains reversible at a single
implementation site.

1. **Formulas.** F1 to F5 (progress, planned progress, risk scoring, at-risk flags,
   initiative buckets) confirmed as documented. Two new definitions: F6, KPI
   achievement % (polarity-aware ratio to target, capped at 200%), and F7, the
   data-quality index (mean of timeliness, completeness, and reliability). The 80%
   budget alert threshold is confirmed.
2. **Delegated authority.** The shipped workflow is policy: PMO Partner validates,
   Project Owner approves, the PMO role may return, read-only viewers see open
   projects only, executives see aggregates but not restricted detail. Future
   changes are permission-grid edits, not development.
3. **KPI linkage.** KPIs remain entity-level with an optional link to a project;
   linked KPIs appear on that project's KPI tab.
4. **Field behaviors.** All free-text fields (sponsor, customer, target group,
   stakeholders, and similar) remain free text permanently.
5. **Data.** Seeded demonstration data remains in place until a real spreadsheet is
   available; the import wizard is ready for it.
6. **Value lists and numbering.** The current list values stand and are editable in
   Code Tables; reference IDs stay free text; milestone chart buckets keep their
   names; utilized budget stays manual entry; the P-Track-only fields are kept.

## 5. The two remaining items

- **Email (SMTP).** Per your direction to use SMTP where possible: the sending layer
  is designed to activate on a credential (host, user, password) with no further
  development. Any standard SMTP account works, including free tiers of common email
  services or a corporate relay. Until then, all notifications remain in-app.
- **AI features.** The AI Assistant navigation entry and the AI-drafted invitation
  text await our discussion, per your note.

## 6. Out of scope, on purpose

Project Merge, bulk validations, and preview-before-commit mass updates from the
original APEX application were excluded with your agreement and remain so unless
priorities change.
