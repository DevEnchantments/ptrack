# Graph Report - ptrack  (2026-08-11)

## Corpus Check
- 258 files · ~113,198 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2090 nodes · 4659 edges · 114 communities (99 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `719c1c70`
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
- CreateRiskDto
- CreatePersonDto
- moduleFileExtensions
- @nestjs/config
- .add
- DatabaseService
- AddStatusReportDialog.tsx
- .add
- dev.ps1
- WorkflowPanel.tsx
- ActionItemsController
- ApiProperty
- RecordHistory.tsx
- skeleton.tsx
- milestones.repository.ts
- AddActionItemDialog.tsx
- @nestjs/swagger
- undici
- @supabase/supabase-js
- tw-animate-css
- ProjectsGrid.tsx
- UsersModule
- @types/node
- PeoplePage.tsx
- StatusReportDetailPage.tsx
- lookups.service.ts
- AddPersonDialog.tsx
- CreateMilestoneDto
- AddActionItemDialog.tsx
- tailwind-merge
- ProjectsGrid.tsx
- StatusReportsRepository
- moduleFileExtensions
- nest-cli.json
- AppModule
- kpis.repository.ts
- DatabaseModule
- attachments.module.ts
- eslint-plugin-react-hooks
- frappe-gantt
- lucide-react
- react-router-dom
- tw-animate-css
- risks.module.ts
- ProgramOutcomesModule

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 127 edges
2. `AuthUser` - 70 edges
3. `CurrentUser` - 70 edges
4. `DatabaseService` - 55 edges
5. `@nestjs/swagger` - 51 edges
6. `usePageTitle()` - 41 edges
7. `Button()` - 38 edges
8. `cn()` - 36 edges
9. `toast` - 31 edges
10. `Input()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx

## Import Cycles
- None detected.

## Communities (114 total, 15 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (23): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (18): importApi, ImportSummary, projectsApi, buildCsv(), downloadCsv(), escapeCell(), parseCsv(), HomePage() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (38): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+30 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (22): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (16): AuthUser, CurrentUser, Delete, Delete, Delete, Delete, NotificationsController, Controller (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): RecordHistoryService, Injectable, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+11 more)

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
Cohesion: 0.06
Nodes (42): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), EditOutcomeDialog(), NavSection, Props (+34 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (16): PersonAutocomplete(), Props, Project, emptyMember(), Props, StepAccess(), StepConfirmation(), Props (+8 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.09
Nodes (15): NotificationsRepository, Injectable, NotificationsService, Injectable, classifyDue(), ReminderKind, reminderType(), resolveRecipients() (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.19
Nodes (12): AddStatusReportDialog(), today(), dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, statusReportsApi (+4 more)

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
Cohesion: 0.17
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (13): Props, ActionItem, auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName() (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.35
Nodes (7): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow, ProjectListStats

### Community 34 - "Community 34"
Cohesion: 0.23
Nodes (10): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.14
Nodes (5): Cycle, Submission, SubmissionListItem, SubmissionsRepository, Injectable

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.06
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
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 46 - "nest-cli.json"
Cohesion: 0.09
Nodes (27): AddIssueDialog(), emptyPerson(), AddKpiDialog(), emptyPerson(), AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName() (+19 more)

### Community 47 - "Community 47"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.06
Nodes (48): Props, Props, Props, Props, Props, CommandPalette(), Entry, hitPath() (+40 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (19): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+11 more)

### Community 50 - "Community 50"
Cohesion: 0.11
Nodes (23): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+15 more)

### Community 54 - "ProjectsController"
Cohesion: 0.16
Nodes (4): IssuesRepository, Injectable, IssuesService, Injectable

### Community 55 - "action-items.repository.ts"
Cohesion: 0.17
Nodes (16): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+8 more)

### Community 56 - "@types/node"
Cohesion: 0.16
Nodes (12): IssuesModule, Module, NotificationsModule, Module, ResourcesModule, Module, StatusReportsModule, Module (+4 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.16
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 59 - "@types/node"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.15
Nodes (12): AppModule, Module, DatabaseModule, Module, bootstrap(), ActionItemsModule, Module, KpisModule (+4 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.29
Nodes (5): SelectContent(), AdminLookupRow, adminLookupsApi, AdminLookupTable, ACCESS_LEVELS

### Community 64 - "PaginationQueryDto"
Cohesion: 0.13
Nodes (19): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Chip(), Issue (+11 more)

### Community 66 - "react-dom"
Cohesion: 0.21
Nodes (11): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+3 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (13): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage() (+5 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.23
Nodes (9): Props, SectionCard(), Skeleton(), attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime() (+1 more)

### Community 69 - "CreateRiskDto"
Cohesion: 0.14
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+8 more)

### Community 70 - "CreatePersonDto"
Cohesion: 0.19
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.12
Nodes (25): App(), GlobalMilestone, registryApi, AuthProvider(), usePageTitle(), CodeTablesPage(), labelFor(), CategoriesPage() (+17 more)

### Community 73 - ".add"
Cohesion: 0.13
Nodes (5): ActionItemsRepository, Injectable, ActionItemsService, ownersLabel(), Injectable

### Community 74 - "DatabaseService"
Cohesion: 0.09
Nodes (26): logger, toHttpException(), DatabaseService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, Issue (+18 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.24
Nodes (24): FREQUENCIES, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props, ConfirmDeleteButton(), Props, FY_YEARS (+16 more)

### Community 76 - ".add"
Cohesion: 0.27
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 79 - "ActionItemsController"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): AdjustWeightsDto, ApiProperty, IsArray, Type, ValidateNested, UpdateMilestoneDto, @nestjs/swagger

### Community 82 - "skeleton.tsx"
Cohesion: 0.24
Nodes (8): Props, Kpi, KpiReading, kpisApi, formatValue(), KpiDetail(), sortedReadings(), Trend()

### Community 84 - "AddActionItemDialog.tsx"
Cohesion: 0.22
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 85 - "@nestjs/swagger"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 86 - "undici"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "tw-animate-css"
Cohesion: 0.21
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 89 - "ProjectsGrid.tsx"
Cohesion: 0.31
Nodes (8): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, peopleApi, ProjectMemberDetail, rolesApi

### Community 90 - "UsersModule"
Cohesion: 0.24
Nodes (9): NAV_ITEMS, Button(), buttonVariants, personName(), Props, STATUS_CHIP, WorkflowPanel(), Submission (+1 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.15
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 93 - "StatusReportDetailPage.tsx"
Cohesion: 0.31
Nodes (7): Props, TagChips(), GlobalActionItem, ActionItemsPage(), isOverdue(), ownerNames(), STATUS_LABELS

### Community 94 - "lookups.service.ts"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 95 - "AddPersonDialog.tsx"
Cohesion: 0.40
Nodes (4): ApiBody, Body, Patch, Post

### Community 96 - "CreateMilestoneDto"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 97 - "AddActionItemDialog.tsx"
Cohesion: 0.29
Nodes (10): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), Props (+2 more)

### Community 99 - "ProjectsGrid.tsx"
Cohesion: 0.22
Nodes (12): COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES, toneFor() (+4 more)

### Community 100 - "StatusReportsRepository"
Cohesion: 0.29
Nodes (6): ImportModule, Module, MilestonesModule, Module, ProjectsModule, Module

### Community 101 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 104 - "kpis.repository.ts"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 105 - "DatabaseModule"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

## Knowledge Gaps
- **438 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+433 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `DatabaseService` to `Community 1`, `Community 6`, `Community 7`, `Community 10`, `Community 12`, `Community 13`, `CreateProjectDto`, `Community 26`, `Community 27`, `nest-cli.json`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 44`, `Community 45`, `RecordHistoryService`, `Community 50`, `ProjectsController`, `@nestjs/swagger`, `PeopleRepository`, `CreatePersonDto`, `.add`, `AddActionItemDialog.tsx`, `undici`, `@types/node`, `PeoplePage.tsx`, `AppModule`, `kpis.repository.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 26`, `Community 34`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `Community 50`, `PeopleRepository`, `react-dom`, `CreateRiskDto`, `.add`, `WorkflowPanel.tsx`, `ActionItemsController`, `RecordHistory.tsx`, `tw-animate-css`, `AddPersonDialog.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 26`, `Community 34`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `Community 50`, `PeopleRepository`, `react-dom`, `CreateRiskDto`, `.add`, `WorkflowPanel.tsx`, `ActionItemsController`, `RecordHistory.tsx`, `tw-animate-css`, `AddPersonDialog.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _438 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06431372549019608 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._