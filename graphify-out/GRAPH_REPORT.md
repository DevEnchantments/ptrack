# Graph Report - ptrack  (2026-08-05)

## Corpus Check
- 228 files · ~95,794 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1827 nodes · 4083 edges · 98 communities (86 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc81e1ea`
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
- IsInt

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 112 edges
2. `AuthUser` - 63 edges
3. `CurrentUser` - 63 edges
4. `DatabaseService` - 47 edges
5. `@nestjs/swagger` - 46 edges
6. `Button()` - 36 edges
7. `cn()` - 36 edges
8. `toast` - 27 edges
9. `usePageTitle()` - 27 edges
10. `RecordHistoryService` - 26 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/dialog.tsx → frontend/src/lib/utils.ts
- `Props` --references--> `ActionItem`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/api.ts
- `AddActionItemDialog()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AddActionItemDialog.tsx → frontend/src/lib/auth-context.tsx

## Import Cycles
- None detected.

## Communities (98 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (22): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (19): AddKpiDialog(), emptyPerson(), FREQUENCIES, Props, Textarea(), personName(), Props, STATUS_CHIP (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (26): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (37): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (18): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (20): AuthUser, CurrentUser, ApiBody, Body, Delete, Patch, Post, Delete (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.21
Nodes (15): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (4): ResourcesRepository, Injectable, ResourcesService, Injectable

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (21): dashboardApi, DashboardData, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CategoryDonut(), ChartPoint, ChartSegment (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (15): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (37): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), EditOutcomeDialog(), NavSection, Props (+29 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.30
Nodes (15): Props, Props, CategorySelect(), Props, Input(), Label(), SelectContent(), SelectItem() (+7 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.11
Nodes (8): NotificationsController, Controller, Param, Post, NotificationsRepository, Injectable, NotificationsService, Injectable

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
Cohesion: 0.08
Nodes (24): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (13): Props, ActionItem, auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName() (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

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
Cohesion: 0.16
Nodes (9): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, UploadedFileLike (+1 more)

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
Cohesion: 0.10
Nodes (13): ApiBody, Body, Controller, Get, Param, Patch, Post, Query (+5 more)

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
Cohesion: 0.05
Nodes (31): ArrayMaxSize, HistoryEntry, HistoryInsert, ActionItemsController, Controller, Get, Param, ActionItem (+23 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.10
Nodes (27): Props, Props, Props, ActionItemOwner, actionItemsApi, apiDelete(), apiGet(), apiPatch() (+19 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 54 - "ProjectsController"
Cohesion: 0.18
Nodes (13): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+5 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.21
Nodes (9): KpisController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 56 - "@types/node"
Cohesion: 0.21
Nodes (3): toHttpException(), SubmissionsRepository, Injectable

### Community 57 - ".update"
Cohesion: 0.17
Nodes (13): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), Props, STATUSES, today(), MilestoneDetail (+5 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.11
Nodes (11): AuthedRequest, DatabaseModule, Module, DatabaseService, Injectable, AppNotification, Resource, ResourceListItem (+3 more)

### Community 59 - "@types/node"
Cohesion: 0.11
Nodes (31): STATUSES, Props, Props, Props, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, Props, ConfirmDeleteButton() (+23 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.21
Nodes (11): StatusPill(), TONE_CLASSES, toneFor(), ProjectSections, calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore() (+3 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.40
Nodes (6): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), today()

### Community 64 - "PaginationQueryDto"
Cohesion: 0.17
Nodes (11): logger, Attachment, AttachmentDetail, AttachmentListItem, Issue, IssueListItem, Milestone, MilestoneListItem (+3 more)

### Community 65 - ".add"
Cohesion: 0.50
Nodes (3): AppModule, Module, bootstrap()

### Community 66 - "react-dom"
Cohesion: 0.17
Nodes (14): AddStatusReportDialog(), Props, today(), dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS (+6 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.18
Nodes (12): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, ActionItemDetailPage(), commentAuthor() (+4 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.12
Nodes (23): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, PersonAutocomplete(), Props, peopleApi (+15 more)

### Community 69 - "CreateRiskDto"
Cohesion: 0.14
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+8 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 74 - "ProjectOverviewCards.tsx"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.19
Nodes (12): Chip(), CycleStatusReport, reportsApi, usePageTitle(), AttachmentDetailPage(), formatSize(), longDate(), relativeTime() (+4 more)

### Community 76 - ".add"
Cohesion: 0.26
Nodes (9): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+1 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.12
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 79 - "nest-cli.json"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 83 - "formulas.ts"
Cohesion: 0.29
Nodes (6): fmtAed(), ProjectOverviewCards(), Props, SectionCard(), Skeleton(), atRiskSuggested()

### Community 84 - "AddActionItemDialog.tsx"
Cohesion: 0.18
Nodes (17): COLUMNS, ProjectsGrid(), ProjectListItem, projectsApi, buildCsv(), downloadCsv(), escapeCell(), GridSort (+9 more)

### Community 86 - "Get"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 87 - "NotificationBell.tsx"
Cohesion: 0.25
Nodes (8): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto

### Community 89 - "ProjectsGrid.tsx"
Cohesion: 0.10
Nodes (23): App(), AddIssueDialog(), emptyPerson(), AddRiskDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, ACTIONS (+15 more)

### Community 90 - "Injectable"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 91 - "CreateKpiActionPlanDto"
Cohesion: 0.20
Nodes (14): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+6 more)

### Community 93 - "transform"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 94 - "ActionItemsModule"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 96 - "@types/node"
Cohesion: 0.40
Nodes (4): ApiBody, Body, Patch, Post

## Knowledge Gaps
- **367 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+362 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `@types/node` to `Community 1`, `Community 6`, `Community 7`, `Community 10`, `Community 12`, `CreateProjectDto`, `Community 20`, `Community 26`, `Community 27`, `Community 34`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 45`, `nest-cli.json`, `RecordHistoryService`, `@nestjs/swagger`, `PeopleRepository`, `PaginationQueryDto`, `.add`, `WorkflowPanel.tsx`, `toast.ts`, `transform`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 7`, `CreateProjectDto`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `nest-cli.json`, `RecordHistoryService`, `ProjectsController`, `action-items.repository.ts`, `PeopleRepository`, `CreateRiskDto`, `.add`, `nest-cli.json`, `Get`, `CreateKpiActionPlanDto`, `@types/node`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Community 8` to `Community 1`, `Community 6`, `Community 7`, `CreateProjectDto`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `nest-cli.json`, `RecordHistoryService`, `ProjectsController`, `action-items.repository.ts`, `PeopleRepository`, `CreateRiskDto`, `.add`, `nest-cli.json`, `Get`, `CreateKpiActionPlanDto`, `@types/node`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06290471785383904 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._