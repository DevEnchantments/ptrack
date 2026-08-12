# Graph Report - ptrack  (2026-08-12)

## Corpus Check
- 273 files · ~118,993 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2173 nodes · 4896 edges · 105 communities (93 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5580eb1`
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
- tailwind-merge
- ProjectsGrid.tsx
- nest-cli.json
- AppModule
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- lucide-react
- react-router-dom
- tw-animate-css
- ApiProperty

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 135 edges
2. `AuthUser` - 78 edges
3. `CurrentUser` - 76 edges
4. `DatabaseService` - 57 edges
5. `@nestjs/swagger` - 55 edges
6. `Button()` - 42 edges
7. `usePageTitle()` - 39 edges
8. `cn()` - 36 edges
9. `toast` - 33 edges
10. `Input()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx

## Import Cycles
- None detected.

## Communities (105 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (11): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiBody, Body (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (28): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (40): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+32 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (4): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (18): AuthUser, CurrentUser, ApiBody, Body, Patch, Post, Delete, Delete (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (23): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+15 more)

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
Cohesion: 0.04
Nodes (71): AddAttachmentDialog(), AddIssueDialog(), emptyPerson(), Props, AddLinkDialog(), AddResourceDialog(), AddRiskDialog(), emptyPerson() (+63 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 17 - "CreateProjectDto"
Cohesion: 0.13
Nodes (7): NotificationsController, Controller, AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (10): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (23): eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-refresh, globals, @types/node, @types/react (+15 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (21): @base-ui/react, class-variance-authority, clsx, @fontsource-variable/inter, dependencies, @base-ui/react, class-variance-authority, clsx (+13 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, class-validator, @nestjs/config, @nestjs/core, @nestjs/schedule, @nestjs/swagger, reflect-metadata (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (22): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.16
Nodes (6): toHttpException(), Cycle, Submission, SubmissionListItem, SubmissionsRepository, Injectable

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (11): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository (+3 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.23
Nodes (8): ProgramOutcomesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (19): AdjustWeightsDto, ApiProperty, IsArray, Type, ValidateNested, CreateMilestoneDto, ApiProperty, ApiPropertyOptional (+11 more)

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
Cohesion: 0.07
Nodes (29): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+21 more)

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
Cohesion: 0.12
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.24
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.48
Nodes (7): apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload(), authHeader(), handle()

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.04
Nodes (49): App(), Props, Props, Props, Props, Props, Props, NAV_ITEMS (+41 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.09
Nodes (19): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+11 more)

### Community 50 - "Community 50"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 54 - "ProjectsController"
Cohesion: 0.19
Nodes (10): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.08
Nodes (48): CategorySelect(), Props, EditProjectDialog(), FY_YEARS, personFromProfile(), Props, Props, Card() (+40 more)

### Community 56 - "@types/node"
Cohesion: 0.10
Nodes (30): ActionItemsModule, Module, AttachmentsModule, Module, ImportModule, Module, IssuesModule, Module (+22 more)

### Community 57 - ".update"
Cohesion: 0.18
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.08
Nodes (22): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+14 more)

### Community 59 - "@types/node"
Cohesion: 0.27
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.22
Nodes (9): importApi, ImportSummary, FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck, validDate() (+1 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.19
Nodes (11): classifyDue(), ReminderKind, reminderType(), resolveRecipients(), DueActionItem, DueMilestone, localIso(), ProjectRef (+3 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 65 - ".add"
Cohesion: 0.19
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 66 - "react-dom"
Cohesion: 0.07
Nodes (25): RecordHistoryService, Injectable, CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn (+17 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.07
Nodes (39): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), Props, STATUSES, today() (+31 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.40
Nodes (4): ApiBody, Body, Patch, Post

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.08
Nodes (37): AppLayout(), ProtectedRoute(), Props, TagChips(), Chip(), attachmentsApi, CycleStatusReport, DirectoryPerson (+29 more)

### Community 73 - ".add"
Cohesion: 0.07
Nodes (22): ActionItemsRepository, Injectable, ActionItemsService, Owners, ownersLabel(), Injectable, CreateActionItemDto, ApiProperty (+14 more)

### Community 74 - "DatabaseService"
Cohesion: 0.07
Nodes (26): AuthedRequest, logger, DatabaseService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, Issue (+18 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.17
Nodes (33): FREQUENCIES, ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton() (+25 more)

### Community 76 - ".add"
Cohesion: 0.36
Nodes (5): ActionItemsController, Controller, Delete, Get, Param

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.14
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+8 more)

### Community 79 - "README.md"
Cohesion: 0.60
Nodes (5): addDays(), iso(), statusClass(), TimelinePage(), VIEW_MODES

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "2. Findings per surface"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 85 - "@nestjs/swagger"
Cohesion: 0.14
Nodes (14): db, ensure(), env, PROGRAMS, root, rows(), STANDARD, initials() (+6 more)

### Community 86 - "undici"
Cohesion: 0.31
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.50
Nodes (3): AppModule, Module, bootstrap()

### Community 89 - "status-reports.repository.ts"
Cohesion: 0.83
Nodes (3): StatusReport, StatusReportDetail, StatusReportListItem

### Community 90 - "Get"
Cohesion: 0.20
Nodes (6): Get, Query, PendingMembershipRow, planClaim(), Injectable, UsersService

### Community 91 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Module, Global

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.15
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 99 - "ProjectsGrid.tsx"
Cohesion: 0.13
Nodes (24): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+16 more)

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "AppModule"
Cohesion: 0.20
Nodes (11): AddKpiDialog(), emptyPerson(), Props, Kpi, KpiReading, kpisApi, formatValue(), KpiDetail() (+3 more)

### Community 106 - "AddMilestoneDialog.tsx"
Cohesion: 0.24
Nodes (11): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), Props (+3 more)

### Community 114 - "ApiProperty"
Cohesion: 0.12
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

## Knowledge Gaps
- **446 isolated node(s):** `VIEW_MODES`, `✨ What's inside`, `🏗 Architecture`, `1 · Database — Supabase SQL editor`, `2 · Run both halves` (+441 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 28` to `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `CreateProjectDto`, `Community 26`, `Community 27`, `AddMilestoneDialog.tsx`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `Community 50`, `@nestjs/swagger`, `PeopleRepository`, `.add`, `react-dom`, `.add`, `DatabaseService`, `undici`, `status-reports.repository.ts`, `Get`, `PeoplePage.tsx`, `ApiProperty`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 9`, `Community 10`, `CreateProjectDto`, `Community 20`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 44`, `RecordHistoryService`, `ProjectsController`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `react-dom`, `RecordHistoryService`, `WorkflowPanel.tsx`, `.add`, `.add`, `WorkflowPanel.tsx`, `Get`, `ApiProperty`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 9`, `Community 10`, `CreateProjectDto`, `Community 20`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 44`, `RecordHistoryService`, `ProjectsController`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `react-dom`, `RecordHistoryService`, `WorkflowPanel.tsx`, `.add`, `.add`, `WorkflowPanel.tsx`, `ApiProperty`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `VIEW_MODES`, `✨ What's inside`, `🏗 Architecture` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._