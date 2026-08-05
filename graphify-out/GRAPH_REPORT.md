# Graph Report - ptrack  (2026-08-05)

## Corpus Check
- 227 files · ~94,747 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1819 nodes · 4049 edges · 98 communities (86 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0add8c3e`
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
- ProjectOverviewCards.tsx
- AddStatusReportDialog.tsx
- .add
- dev.ps1
- WorkflowPanel.tsx
- nest-cli.json
- ApiProperty
- RecordHistory.tsx
- .add
- formulas.ts
- AddActionItemDialog.tsx
- react-dom
- Get
- NotificationBell.tsx
- tw-animate-css
- ProjectsGrid.tsx
- Injectable
- CreateKpiActionPlanDto
- toast.ts
- transform
- ActionItemsModule
- RisksModule
- @types/node
- HomePage

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 112 edges
2. `AuthUser` - 63 edges
3. `CurrentUser` - 63 edges
4. `DatabaseService` - 47 edges
5. `@nestjs/swagger` - 46 edges
6. `cn()` - 36 edges
7. `Button()` - 35 edges
8. `usePageTitle()` - 27 edges
9. `RecordHistoryService` - 26 edges
10. `toast` - 26 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `SelectGroup()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts
- `SelectLabel()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/select.tsx → frontend/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (98 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (27): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (18): AddKpiDialog(), emptyPerson(), Props, Textarea(), personName(), Props, STATUS_CHIP, WorkflowPanel() (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.24
Nodes (10): AuthUser, MilestonesController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (35): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot, AdjustWeightsDto, ApiProperty (+27 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (24): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (18): AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module, NotificationsModule, Module (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (10): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Input() (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (23): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (22): dashboardApi, DashboardData, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CategoryDonut(), ChartPoint, ChartSegment (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (15): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (36): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), NavSection, Props, SectionNav() (+28 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (11): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, Cycle, Submission (+3 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.11
Nodes (10): NotificationsController, Controller, Get, Param, Post, AppNotification, NotificationsRepository, Injectable (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.20
Nodes (4): ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, clsx, dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, jose, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express, @nestjs/swagger (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.07
Nodes (25): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+17 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (18): Props, dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, ActionItem, auditLine() (+10 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transformIgnorePatterns (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, lint, start, start:debug, start:dev (+6 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.11
Nodes (17): 1. Contrast report (measured 2026-07-29), 2. Findings per surface, 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M (+9 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.20
Nodes (7): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 34 - "Community 34"
Cohesion: 0.07
Nodes (25): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+17 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.35
Nodes (7): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow, ProjectListStats

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.07
Nodes (25): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+17 more)

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
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 46 - "nest-cli.json"
Cohesion: 0.12
Nodes (4): HistoryInsert, ActionItemsRepository, Injectable, ownersLabel()

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.15
Nodes (20): Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload() (+12 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (24): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+16 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.21
Nodes (9): KpisController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 57 - ".update"
Cohesion: 0.27
Nodes (10): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), MilestoneDetail (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 59 - "@types/node"
Cohesion: 0.13
Nodes (29): Props, FREQUENCIES, Props, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, Props, Props, ConfirmDeleteButton() (+21 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.29
Nodes (8): ProjectSections, calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore(), riskSeverityTone(), MILESTONE_LABELS, ProjectProgressReportPage()

### Community 63 - "auth-context.tsx"
Cohesion: 0.46
Nodes (7): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today()

### Community 64 - "PaginationQueryDto"
Cohesion: 0.18
Nodes (6): DatabaseService, Injectable, RecordHistoryService, Injectable, Issue, IssueListItem

### Community 65 - ".add"
Cohesion: 0.16
Nodes (12): AppModule, Module, DatabaseModule, Module, bootstrap(), KpisModule, Module, MilestonesModule (+4 more)

### Community 66 - "react-dom"
Cohesion: 0.15
Nodes (16): App(), AddStatusReportDialog(), today(), ProtectedRoute(), Chip(), CycleStatusReport, reportsApi, statusReportsApi (+8 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (13): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage() (+5 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.12
Nodes (30): CategorySelect(), Props, EditProjectDialog(), personFromProfile(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+22 more)

### Community 69 - "CreateRiskDto"
Cohesion: 0.25
Nodes (8): ReportsController, SubmissionsController, ApiBody, Body, Controller, Get, Param, Post

### Community 71 - "moduleFileExtensions"
Cohesion: 0.38
Nodes (6): KIND_CLASSES, TOAST_MS, Toaster(), ToastItem, subscribeToasts(), ToastKind

### Community 73 - ".add"
Cohesion: 0.22
Nodes (8): ActionItemsService, Owners, Injectable, CreateCommentDto, ApiProperty, IsString, UpdateActionItemDto, MinLength

### Community 74 - "ProjectOverviewCards.tsx"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.23
Nodes (9): Props, SectionCard(), Skeleton(), attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime() (+1 more)

### Community 76 - ".add"
Cohesion: 0.23
Nodes (10): CurrentUser, ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.10
Nodes (8): logger, toHttpException(), Kpi, KpiActionPlan, KpiListItem, KpiReading, KpisRepository, Injectable

### Community 79 - "nest-cli.json"
Cohesion: 0.35
Nodes (4): UpdateKpiActionPlanDto, UpdateKpiDto, KpisService, Injectable

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 83 - "formulas.ts"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Issue, Project (+3 more)

### Community 84 - "AddActionItemDialog.tsx"
Cohesion: 0.27
Nodes (10): buildCsv(), downloadCsv(), escapeCell(), HomePage(), initials(), prefersReducedMotion(), relativeTime(), ROWS_OPTIONS (+2 more)

### Community 86 - "Get"
Cohesion: 0.18
Nodes (11): ArrayMaxSize, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional (+3 more)

### Community 87 - "NotificationBell.tsx"
Cohesion: 0.19
Nodes (13): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, PersonAutocomplete(), Props, peopleApi (+5 more)

### Community 89 - "ProjectsGrid.tsx"
Cohesion: 0.11
Nodes (18): AddIssueDialog(), emptyPerson(), AddRiskDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, ACTIONS, CommandPalette() (+10 more)

### Community 90 - "Injectable"
Cohesion: 0.29
Nodes (6): HistoryEntry, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 91 - "CreateKpiActionPlanDto"
Cohesion: 0.29
Nodes (10): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+2 more)

### Community 92 - "toast.ts"
Cohesion: 0.32
Nodes (6): NotificationBell(), timeAgo(), AppNotification, notificationsApi, Listener, toast

### Community 93 - "transform"
Cohesion: 0.67
Nodes (3): transform, ^.+\\.(t|j)s$, ts-jest

### Community 99 - "HomePage"
Cohesion: 0.27
Nodes (9): COLUMNS, ProjectsGrid(), StatusPill(), TONE_CLASSES, toneFor(), ProjectListItem, GridSort, GridSortKey (+1 more)

## Knowledge Gaps
- **365 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+360 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `WorkflowPanel.tsx` to `Community 1`, `Community 6`, `Community 7`, `Community 10`, `Community 12`, `Community 16`, `CreateProjectDto`, `Community 20`, `Community 26`, `Community 27`, `Community 34`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 45`, `nest-cli.json`, `RecordHistoryService`, `ProjectsController`, `@types/node`, `PeopleRepository`, `PaginationQueryDto`, `Injectable`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 5` to `Community 1`, `Community 6`, `Community 7`, `Community 10`, `Community 13`, `Community 16`, `CreateProjectDto`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `RecordHistoryService`, `ProjectsController`, `action-items.repository.ts`, `PeopleRepository`, `CreateRiskDto`, `.add`, `.add`, `nest-cli.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `.add` to `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 10`, `Community 13`, `Community 16`, `CreateProjectDto`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `RecordHistoryService`, `ProjectsController`, `action-items.repository.ts`, `PeopleRepository`, `CreateRiskDto`, `.add`, `nest-cli.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _365 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05827067669172932 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._