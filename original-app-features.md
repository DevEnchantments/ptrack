# P-Track — Original Oracle APEX App: Feature Reference

> Reference only. This documents the **original** Oracle APEX application that this repo
> is rebuilding. Use it to understand intended module behaviour when building a matching
> feature. It is not a spec for the rebuild's architecture (see `CLAUDE.md` for that).

## 1. Application overview

P-Track is a full-featured, enterprise-grade **Project Portfolio Management (PPM)**
application built natively in Oracle APEX. It lets organizations create, track, and
report on projects, their milestones, action items, issues, status reports, resources,
and stakeholders — with role-based access control, email notification automation, and
extensive customization (flexible/configurable fields, templates, and admin-tunable
workflows).

It is structured as a mature, "productized" APEX app (in the seeded "Productivity Apps"
group), including its own help system, data-load/import wizard, audit/history tracking,
access control list (ACL) security model, and an internal extensibility framework
(flexible columns, project templates).

## 2. Core functional modules

### 2.1 Project management (core)
- **Project record (`EBA_PROJ_STATUS`)** — the central entity: name, description, owner,
  dates, status code, project size, deal type, region/country, sponsor, logo/photo, and
  custom flexible attributes.
- **Project Creation Wizard** — multi-step guided wizard (4 steps), optionally seeded from
  a **Project Template**.
- **Project Details page** — single-project workspace showing summary, milestones, action
  items, status updates, attachments, links, issues, resources, and people in one place.
- **Project Timeline / Gantt views** — visual timeline and Gantt chart of milestones
  across a project or portfolio.
- **Project Merge** — utility to merge duplicate/related projects into one.
- **Project Templates** — reusable templates that pre-populate milestones and action items
  for new projects; includes a **Copy Project Template** function and **Template
  Milestones / Template Action Items** staging.
- **Project Validations** — configurable validation-rules engine that checks project data
  completeness/quality (`Validate Project`, `Project Validations Report`, `Additional
  Required Items`).
- **Project History / Recent Project History** — full audit trail of field-level changes
  via history triggers (7-day and 90-day rolling history views).
- **Tree View & Tag-based browsing** — hierarchical navigation of projects plus free-form
  tagging for cross-cutting classification/search.

### 2.2 Milestones
- Create/manage project milestones with due dates, completion status, and ownership
  (`EBA_PROJ_STATUS_MS`).
- **Milestones Calendar (monthly)**, **Milestones Gantt Chart**, **Milestones Timeline by
  Owner**, and **Bar Chart by Category** views.
- **Past Due Milestones** report and **Confirm New Due Dates** workflow for date-slip handling.
- **Mass Update (My Open Milestones)** with preview-before-commit.
- **Push Milestones and Action Items** — bulk date-shifting utility (reschedule a whole plan).
- Milestone-level deletion with confirmation and dependent-record handling.

### 2.3 Action items (tasks)
- Action item tracking (`EBA_PROJ_STATUS_AIS`) with **types**
  (`EBA_PROJ_STATUS_AIS_TYPES`) and **comments** (`EBA_PROJ_STATUS_AI_CMNTS`).
- Dashboards: **Action Items Dashboard**, **Interactive Report**, **Analysis Report**,
  **by Category/Owner Timeline**.
- **Reassign Action Items** — bulk owner-transfer utility.
- **Mass Update My Open Action Items** with a preview/confirmation page before commit.
- **Email Action Item** — ad hoc email notification for a specific action item.

### 2.4 Issues
- Issue logging per project (`EBA_PROJ_STATUS_ISSUES`, view-driven), with **Issue
  Categories** and **Issue Levels** (severity) as configurable lookup tables.
- **Manage Project Issues** screen and **Issues Report**.
- Tag support extended to issues for cross-project classification.

### 2.5 Status reports & status updates
- **Status Updates** — lightweight free-text/structured update log per project
  (`EBA_PROJ_STATUS_UPDATES`), with **Update Types** and **Update Classes** as
  configurable categories, and a "Headlines" concept (short summary updates with history).
- **Status Reports** — more formal periodic reports (`EBA_PROJ_STATUS_REPORTS`) linking
  back to project updates (`EBA_PROJ_STATUS_RPT_PROJ_UPD`), with Add/Edit/Email pages and
  a Status Reports Timeline.
- **Status Codes** — configurable project health/status codes (Red/Amber/Green-style)
  administered via a **Status Code Administration** module with full detail pages.
- **Heatmap Report** — visual matrix (status-by-project or status-by-period) for
  portfolio health-at-a-glance.

### 2.6 Resources & people
- **Project People / Project Viewers** — assignment of users to projects with **Project
  Roles** and **Involvement Levels** (configurable).
- **Project Resources** — non-user resource tracking with **Resource Types** lookup, plus
  a "Projects by Resource" report.
- **User Involvement Report** — cross-project view of who is involved where and how.
- **Manage Project People**, **Project Followers Report** (subscribers/watchers).

### 2.7 Attachments, links & tags
- File attachment management per project (`EBA_PROJ_STATUS_FILES`) with size-limit
  triggers (e.g., logo file-size limit) and an **Attachments Dashboard**, plus a bulk
  **Remove Attachments** utility.
- **Project Links** — external/internal URL references per project (`EBA_PROJ_STATUS_LINKS`).
- **Tags** — free-form tagging engine usable across projects/issues, with a **Tag
  Details** drill-down.

### 2.8 Search
- Global, cross-entity **Search** with persisted **Saved Searches**
  (`EBA_PROJ_STATUS_SEARCHES`) and dedicated **Search Results** and **Search Requests
  Report** pages.

## 3. Dashboards & reporting

- **Home Dashboard** — personalized landing page summarizing the user's projects/items.
- **Projects / Project Updates / Action Items / Attachments Dashboards** — role-relevant rollups.
- **My Dashboard Filters** — user-defined, saved dashboard filter sets.
- **Interactive Reports** (APEX IR) on each core entity: Projects, Milestones, Action Items.
- **Bar Charts** — Projects by Status, Projects by Category, Milestones by Category.
- **Activity / Usage Reporting**: Application Activity, Activity by Page, Page Views, Top
  Users, Activity Calendar, Project Usage Metrics, Project Creation Date Calendar.
- **Project Resources Report**, **Project Attachments Report**, **Headlines Report**,
  **Projects History Report**.
- A consolidated **Reports / Reporting** menu aggregating the above into a structured catalog.

## 4. Notifications & email automation

A dedicated email subsystem (`EMAIL_PACKAGE`, `EBA_PROJ_STATUS_EMAIL_LOG`) drives:
- **Ad hoc emails:** Email Project, Email Project Statuses, Email Action Item, Email Status
  Report, Email Project Details, Email Past Due (deliverables).
- **Scheduled email jobs** (configurable via **Configure Email Send Job**): Email Project
  Statuses, Email Past Due Deliverables, Email Upcoming Deliverables, Email Project Details.
- **Application Email Preferences** and per-user **Email Preferences** (opt-in/opt-out and
  frequency control at both application and individual level).
- **Project Email Log** — full audit of emails sent per project.
- In-app **Notifications** module (bell-style alerts) distinct from email.

## 5. Security & access control

- **Access Control List (ACL)** module: Access Control Configuration, Access Control List,
  Page Privileges, Privilege Mismatch diagnostic — page- and feature-level authorization
  beyond simple APEX authorization schemes.
- **Project-level visibility:** Project Viewers vs. Project People distinguishes "can see"
  from "is assigned to."
- **User Details / People** admin screens, **Add Multiple Users** (bulk provisioning) with
  a **Preview Updated Users** confirmation step, and **Mass Update Users**.
- **Username Format** configuration.
- **Login**, **Change My Password**, **Set Time Zone**, **My Profile / User Profile Page**.
- Full **history/audit triggers** on key tables feeding the History and Recent Project
  History reports.
- **Application Error Log** for runtime exception tracking.

## 6. Extensibility framework ("Flex Columns")

A metadata-driven custom-field framework (`EBA_PROJ_FLEX_FW` package, `FLEX_REGISTRY`,
`FLEX_STATIC_LOVS`, `FLEX_PAGE_MAP` tables):
- **Flex Columns / Flex Column** admin pages to define new custom attributes without schema
  changes to core tables.
- A guided **Assign Flexible Column** wizard (Data Source → Flex Column → Form Element →
  Select List Options → Confirmation) — a no-code field-builder.
- Page-level mapping so a flex column can be selectively surfaced on specific pages/forms.

## 7. Administration & configuration

- **Application Settings / Administration / Administrative Configuration** — central admin hub.
- **Code Table Administration** — generic UI for managing all lookup/reference tables
  (Status Codes, Project Sizes, Deal Types, Issue Categories, Issue Levels, Involvement
  Levels, Resource Types, Action Item Types, Status Update Types, Regions, Countries,
  Quarters, Work Days, etc.).
- **Regions / Countries / Project Countries** — geographic reference data and association.
- **Quarters / Regenerate Quarters / Fiscal Quarter population** (`populate_fiscal_quarters`)
  — fiscal calendar management for period-based reporting.
- **Work Days** configuration — supports business-day calculations for due-date/SLA logic.
- **Application Appearance** — theming/branding configuration.
- **Build Options** — APEX build-option toggles for conditional feature rollout.
- **Manage Sample Data / Run Sample Data Load** — built-in demo data seeding.
- **Application Activity Log / Ingest Log** — operational/system logging.
- **Feedback** module — end-user feedback capture and **Manage Feedback** admin queue.
- **Help system** — `EBA_PROJ_HELP` package, Help Contents table, in-app Help page and Page
  Help Dialog, plus a Getting Started onboarding page.

## 8. Data load / import

A structured **bulk data-load wizard** (appears for at least two source types, e.g.,
Projects and Milestones/Action Items):
1. **Data Load Source** — select/upload source file.
2. **Data / Table Mapping** — map source columns to target table columns.
3. **Data Validation** — pre-load validation/error checking.
4. **Data Load Results** — load execution summary/results.

## 9. Data model summary (core tables)

| Table | Purpose |
|---|---|
| `EBA_PROJ_STATUS` | Core project record |
| `EBA_PROJ_STATUS_MS` | Milestones |
| `EBA_PROJ_STATUS_AIS` / `_AIS_TYPES` | Action items and their types |
| `EBA_PROJ_STATUS_AI_CMNTS` | Action item comments |
| `EBA_PROJ_STATUS_UPDATES` / `_UPD_CLASSES` / `_UPDATE_TYPES` | Status updates and classification |
| `EBA_PROJ_STATUS_REPORTS` / `_RPT_PROJ_UPD` | Formal status reports and their linked updates |
| `EBA_PROJ_STATUS_FILES` | Attachments |
| `EBA_PROJ_STATUS_LINKS` | Project links |
| `EBA_PROJ_STATUS_USERS` | User/people directory and project associations |
| `EBA_PROJ_STATUS_ACCESS_LEVELS` | ACL / authorization levels |
| `EBA_PROJ_STATUS_EMAIL_LOG` | Email send audit trail |
| `EBA_PROJ_STATUS_SEARCHES` | Saved searches |
| `EBA_PROJ_PREFERENCES` | Application/user preference store |

Supporting subsystems also include: Tags, Issues, Project Resources, Project
Roles/Involvement Levels, Regions/Countries, Fiscal Quarters, Help Contents, Feedback,
Error Log, History/Audit tables, Flex Registry/Static LOVs/Page Map, Template Milestones
staging.

## 10. PL/SQL package layer

| Package | Responsibility |
|---|---|
| `EBA_PROJ_FW` | Core application framework/utility logic |
| `EBA_PROJ_FLEX_FW` | Flexible-column (custom field) engine |
| `EBA_PROJ_TEMPLATE_FW` | Project template provisioning logic |
| `EBA_PROJ_DATES` | Date/fiscal calendar calculations |
| `EBA_PROJ_HELP` | In-app help content delivery |
| `EMAIL_PACKAGE` | Email composition, queuing, and scheduled send jobs |
| `PROJ_STAT_UI` | UI helper logic (show-detail procedures, etc.) |
| API ingest package | Data ingestion/integration API |

## 11. Notable architectural patterns

- **One config-table-per-feature** (`EBA_PROJ_PREFERENCES`, flex registry, email job config).
- **Preview-before-commit** UX used consistently for all mass-update operations (Mass
  Update Users, Mass Update My Open Action Items/Milestones, Push Milestones) — stage
  changes, show a confirmation/preview page, then commit.
- **History trigger + rolling-window views** (7-day/90-day) for lightweight, performant
  audit trails without a full Flashback/FDA dependency.
- **Metadata-driven custom fields** (Flex framework) as a no-code extensibility layer.
- **Scheduled email jobs decoupled from ad hoc email** — clean separation of concerns.

## 12. Summary

P-Track is best understood as a **configurable Project Portfolio Management platform**, not
just a status-tracking screen: project lifecycle (create → template →
milestones/action items → status updates/reports → close), portfolio-level dashboards and
analytics, multi-channel notification (email + in-app), fine-grained ACL security, a true
no-code custom-field framework, and an ETL-style data import path — all built on a
disciplined, audit-friendly Oracle APEX/PL/SQL architecture.
