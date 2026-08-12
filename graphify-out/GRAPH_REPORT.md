# Graph Report - ptrack  (2026-08-12)

## Corpus Check
- 275 files · ~121,210 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2187 nodes · 4839 edges · 118 communities (102 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c4d27de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- CreateProjectDto
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- AddMilestoneDialog.tsx
- CreateActionItemDto
- nest-cli.json
- Community 34
- Community 35
- ProjectsRepository
- Community 37
- status-reports.repository.ts
- Community 39
- Community 40
- Community 41
- CreateProjectDto
- Community 43
- Community 44
- Community 45
- nest-cli.json
- Community 47
- status-reports.repository.ts
- RecordHistoryService
- Community 50
- ProjectsController
- action-items.repository.ts
- @types/node
- .update
- @nestjs/swagger
- @types/node
- ActionItemDetailPage.tsx
- PeopleRepository
- CreateMilestoneDto
- auth-context.tsx
- PaginationQueryDto
- .add
- react-dom
- CreateLinkDto
- RecordHistoryService
- WorkflowPanel.tsx
- 2. Core functional modules
- moduleFileExtensions
- @nestjs/config
- .add
- DatabaseService
- AddStatusReportDialog.tsx
- .add
- dev.ps1
- WorkflowPanel.tsx
- README.md
- ApiProperty
- 2. Findings per surface
- 🚀 Quick start
- milestones.repository.ts
- transform
- @nestjs/swagger
- undici
- @supabase/supabase-js
- AppModule
- status-reports.repository.ts
- Get
- DatabaseModule
- PeoplePage.tsx
- users.module.ts
- seed-generic-lookups.mjs
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- tailwind-merge
- ProjectsGrid.tsx
- 2. Findings per surface
- AddActionItemDialog
- nest-cli.json
- AppModule
- 🚀 Quick start
- ActionItemsPage.tsx
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- lucide-react
- react-router-dom
- tw-animate-css
- CreateIssueDto
- RecordHistoryService
- ApiProperty
- AttachmentDetailPage.tsx
- TimelinePage.tsx
- attachments.repository.ts

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 135 edges
2. `AuthUser` - 78 edges
3. `CurrentUser` - 76 edges
4. `DatabaseService` - 57 edges
5. `@nestjs/swagger` - 55 edges
6. `Button()` - 41 edges
7. `usePageTitle()` - 39 edges
8. `cn()` - 36 edges
9. `toast` - 33 edges
10. `Input()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ProjectMemberInput`  [EXTRACTED]
  frontend/src/components/PersonAutocomplete.tsx → frontend/src/pages/CreateProjectWizard.tsx
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (118 total, 16 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (19): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiBody, Body (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (9): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Conventions carried forward, FDD Alignment — P-Track ⇄ Project Tracker FDD (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): devDependencies, eslint-config-prettier, @eslint/eslintrc, @eslint/js, globals, jest, @nestjs/cli, @nestjs/schematics (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (22): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (16): AuthUser, CurrentUser, Delete, Delete, ApiBody, Body, Post, Delete (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (16): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (20): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (21): dashboardApi, DashboardData, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CategoryDonut(), ChartPoint, ChartSegment (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (22): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+14 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (12): RegistryController, Controller, Get, RegistryModule, Module, DirectoryMembership, DirectoryPerson, GlobalActionItem (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (29): ACTIONS, attachmentUploader(), collapsePrefsKey(), EXT_STYLES, fileExt(), formatReportDate(), formatSize(), initials() (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (6): KpisController, Controller, Delete, Get, Param, Patch

### Community 17 - "CreateProjectDto"
Cohesion: 0.20
Nodes (9): StatusReportsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (13): Props, ActionItem, auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName() (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (23): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+15 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (21): @base-ui/react, class-variance-authority, dhtmlx-gantt, @fontsource-variable/inter, dependencies, @base-ui/react, class-variance-authority, dhtmlx-gantt (+13 more)

### Community 25 - "Community 25"
Cohesion: 0.07
Nodes (27): dependencies, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+19 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (24): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (3): toHttpException(), SubmissionsRepository, Injectable

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.26
Nodes (12): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+4 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.19
Nodes (13): Props, Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Issue (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+23 more)

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): compilerOptions, baseUrl, paths, files, ./src/*, @/*, references

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (7): dependencies, @nestjs/config, react-router-dom, @supabase/supabase-js, @nestjs/config, react-router-dom, @supabase/supabase-js

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 42 - "CreateProjectDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.08
Nodes (22): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.20
Nodes (11): Props, TagChips(), GlobalActionItem, GlobalMilestone, ActionItemsPage(), isOverdue(), ownerNames(), STATUS_LABELS (+3 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.13
Nodes (17): Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray, IsDateString, IsIn (+9 more)

### Community 47 - "Community 47"
Cohesion: 0.12
Nodes (21): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), AddIssueDialog() (+13 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.05
Nodes (57): Props, Props, Props, Props, Props, AppLayout(), NAV_ITEMS, CommandPalette() (+49 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.12
Nodes (11): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsRepository (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.06
Nodes (42): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+34 more)

### Community 54 - "ProjectsController"
Cohesion: 0.31
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.10
Nodes (34): CategorySelect(), Props, EditProjectDialog(), FY_YEARS, personFromProfile(), SelectContent(), SelectItem(), SelectTrigger() (+26 more)

### Community 56 - "@types/node"
Cohesion: 0.06
Nodes (43): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+35 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.08
Nodes (22): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+14 more)

### Community 59 - "@types/node"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.15
Nodes (18): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, CreateAccountDialog(), Props, PersonAutocomplete() (+10 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.09
Nodes (18): NotificationsController, Controller, AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable, classifyDue() (+10 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.33
Nodes (6): AdjustWeightsDto, ApiProperty, IsArray, Type, ValidateNested, UpdateMilestoneDto

### Community 65 - ".add"
Cohesion: 0.12
Nodes (12): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+4 more)

### Community 66 - "react-dom"
Cohesion: 0.07
Nodes (23): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+15 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (12): colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor() (+4 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.14
Nodes (21): App(), Chip(), registryApi, AuthProvider(), usePageTitle(), CodeTablesPage(), labelFor(), CategoriesPage() (+13 more)

### Community 73 - ".add"
Cohesion: 0.10
Nodes (7): RecordHistoryService, Injectable, ActionItemsRepository, Injectable, ActionItemsService, ownersLabel(), Injectable

### Community 74 - "DatabaseService"
Cohesion: 0.09
Nodes (20): AuthedRequest, logger, DatabaseService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, Issue (+12 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.17
Nodes (24): FREQUENCIES, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, FieldError() (+16 more)

### Community 76 - ".add"
Cohesion: 0.33
Nodes (6): calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore(), MILESTONE_LABELS, ProjectProgressReportPage()

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.14
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+8 more)

### Community 79 - "README.md"
Cohesion: 0.21
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "2. Findings per surface"
Cohesion: 0.24
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 82 - "🚀 Quick start"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 83 - "milestones.repository.ts"
Cohesion: 0.29
Nodes (6): KpisModule, Module, Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 84 - "transform"
Cohesion: 0.24
Nodes (11): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Props (+3 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 86 - "undici"
Cohesion: 0.27
Nodes (9): formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab(), Props, addDays(), ProjectGantt(), Props (+1 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.29
Nodes (7): UploadedFileLike, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 89 - "status-reports.repository.ts"
Cohesion: 0.18
Nodes (13): Props, dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, StatusReport, StatusReportDetail (+5 more)

### Community 90 - "Get"
Cohesion: 0.17
Nodes (9): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository (+1 more)

### Community 91 - "DatabaseModule"
Cohesion: 0.22
Nodes (12): COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES, toneFor() (+4 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.16
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 93 - "users.module.ts"
Cohesion: 0.38
Nodes (6): personName(), Props, STATUS_CHIP, WorkflowPanel(), Submission, submissionsApi

### Community 94 - "seed-generic-lookups.mjs"
Cohesion: 0.16
Nodes (12): db, ensure(), env, PROGRAMS, root, rows(), STANDARD, formatValue() (+4 more)

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.25
Nodes (5): 🏗 Architecture, 📚 More docs, 🧪 Quality, 🗺 Roadmap, ✨ What's inside

### Community 99 - "ProjectsGrid.tsx"
Cohesion: 0.22
Nodes (12): FromTemplateDialog(), buildCsv(), downloadCsv(), escapeCell(), parseCsv(), HomePage(), initials(), prefersReducedMotion() (+4 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 114 - "ApiProperty"
Cohesion: 0.12
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

### Community 115 - "AttachmentDetailPage.tsx"
Cohesion: 0.23
Nodes (8): Props, Skeleton(), attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

## Knowledge Gaps
- **451 isolated node(s):** `Props`, `ProjectDashboardTab`, `ACTIONS`, `STATUS_LABELS`, `ISSUE_STATUS_LABELS` (+446 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 28` to `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `Community 16`, `Community 26`, `Community 27`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `Community 50`, `@nestjs/swagger`, `PeopleRepository`, `auth-context.tsx`, `.add`, `react-dom`, `.add`, `DatabaseService`, `2. Findings per surface`, `milestones.repository.ts`, `Get`, `PeoplePage.tsx`, `ApiProperty`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 8` to `Community 1`, `Community 7`, `Community 9`, `Community 10`, `Community 16`, `CreateProjectDto`, `Community 26`, `AddMilestoneDialog.tsx`, `status-reports.repository.ts`, `Community 44`, `nest-cli.json`, `RecordHistoryService`, `Community 50`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `auth-context.tsx`, `PaginationQueryDto`, `.add`, `react-dom`, `WorkflowPanel.tsx`, `WorkflowPanel.tsx`, `AppModule`, `ApiProperty`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 8` to `Community 1`, `Community 7`, `Community 9`, `Community 10`, `Community 16`, `CreateProjectDto`, `Community 26`, `AddMilestoneDialog.tsx`, `status-reports.repository.ts`, `Community 44`, `nest-cli.json`, `RecordHistoryService`, `Community 50`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `auth-context.tsx`, `PaginationQueryDto`, `.add`, `react-dom`, `WorkflowPanel.tsx`, `WorkflowPanel.tsx`, `AppModule`, `ApiProperty`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `Props`, `ProjectDashboardTab`, `ACTIONS` to the rest of the system?**
  _451 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0944741532976827 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._