# P-Track progress summary

Prepared by Fares Al Areefi · 17 August 2026
For review against the Project Tracker Functional Design Document (FDD)

## 1. Where the project stands

P-Track is the ground-up rebuild of the Oracle APEX project tracker as an independent
web application (React frontend, NestJS middle tier, Supabase database), governed by
the FDD since 21 July 2026. As of this summary, every functional requirement in the
FDD that can be built without further input is built. What remains falls into two
groups: items waiting on decisions listed in section 4, and items waiting on
infrastructure listed in section 5.

The codebase carries 158 backend and 35 frontend automated tests, and every commit
passes type checking, linting, and the full test suite in CI before it lands.

## 2. What is built, by area

**Project registry and records.** Projects with the full FDD field set (reference ID,
plan year, budgets, tiers, sectors, strategic objectives and programs, deal types,
stakeholders, tags), a four-step creation wizard, project templates, and CSV bulk
import with a preview step. Every record type in the FDD exists with full create,
read, update, and delete: milestones, program outcomes, tasks (action items), links,
resources, issues, risks, updates, status reports, people, and attachments, including
task-level attachments per Appendix A.

**Planning and progress.** Outcomes group milestones, milestones carry weights and
dependencies, and tasks sit under milestones, matching the hierarchy confirmed in our
review sessions. The project dashboard tab shows planned-versus-actual progress, a
budget donut, and a full Gantt chart (outcome, milestone, and task levels with
dependency arrows and milestone diamonds). Weight adjustment is enforced to total
exactly 100 and is applied atomically in the database.

**Reporting cycle workflow (FR-14).** Monthly cycles with the submit, validate,
approve, return, and reject states from Fig 10. The PMO Partner validates and the
Project Owner approves where those people are set. Cycles can be closed and reopened;
a closed cycle locks every transition.

**Dashboards and reports (FR-10, FR-12).** The executive dashboard row from Fig 15
(initiative buckets, portfolio budget, cycle submission status, monthly breakdown)
plus the earlier live charts. Printable reports: Cycle Submission Status, Initiative
Progress, Monthly Performance, and a per-project progress report. Exports are CSV
with the FR-13 confirmation modal; native Excel format was judged unnecessary and can
be revisited.

**KPIs (FR-11).** A KPI registry with readings and action plans exists. Scorecard
calculations (achievement percentage, data quality index) are stubbed pending the
formula decisions in section 4.

**Notifications (3.9).** In-app notifications with a bell and unread badge. Live
triggers: workflow transitions, budget threshold crossings, due-soon and overdue
reminders, a pre-cycle nudge for projects that have not submitted, and an alert when
a high-severity risk is saved. Email delivery waits on section 5.

**Administration.** Code Tables (all lookup lists editable in place), account
provisioning for pending people, and a Users & Roles page described below.

**Security (FR-15).** Role-based access control enforced in the middle tier. The
FDD's seven roles from section 3.2 map onto four global roles (admin, PMO, executive,
user) plus per-project relationships that already existed in the data: membership
access levels, project owner and manager assignments, and per-record risk ownership.
Restricted projects are invisible to users with no relationship to them, in lists,
search, dashboards, and reports as well as on direct access. Which role holds which
capability is editable live on the Users & Roles page, with every change audited.
The permission grid means that when the open questions in section 4 are answered,
most answers become configuration rather than development.

## 3. Assumptions that need your confirmation

These are implemented and working, but each one was our judgment call rather than an
FDD requirement, and each is reversible.

| Assumption | Where it shows |
| --- | --- |
| Progress formulas F1 to F5 (weighted milestone completion, straight-line plan, risk scoring, at-risk flags, initiative buckets) | All progress figures, risk severity dots, the initiative donut. Recorded in FORMULAS.md |
| Project creation is limited to PMO and admin roles, per the FDD process table | Create Project button |
| Closing a cycle locks all transitions | Cycle Submission Status page |
| Reminder policy: remind when due, once when overdue, nudge in the last five days of a cycle | Notification bell |
| Budget alert threshold at 80 percent utilization | Notifications |
| CSV export satisfies the Excel export requirement | All list exports |

## 4. Decisions only you can make

1. **Formula sign-off.** Confirm or correct F1 to F5, and define the KPI achievement
   percentage and data quality index so scorecards can be finished.
2. **Delegated authority.** Who besides the PMO Partner and Project Owner may review,
   return, or approve submissions? What exactly may a read-only viewer see? Do
   executive viewers see restricted projects? Each answer is now a checkbox in the
   permission grid rather than a rebuild.
3. **KPI linkage.** Are KPIs portfolio-level (as built) or attached to individual
   projects? The project KPI tab is waiting on this.
4. **Field behavior document.** Several fields are plain text pending your finalized
   specification.
5. **Real data.** The import wizard is ready for your project spreadsheet whenever it
   is available.

## 5. Blocked on infrastructure

- **Email (SMTP or an email service).** Unlocks notification emails and sending
  account invitations from inside the application. The invitation compose screen
  already exists; only delivery is missing.
- **LLM API access.** Unlocks the AI-drafted invitation text and is the entry point
  for the planned AI Assistant.

## 6. Out of scope, on purpose

Project Merge, bulk validations, and preview-before-commit mass updates from the
original APEX application were excluded with your agreement and remain so unless
priorities change.
