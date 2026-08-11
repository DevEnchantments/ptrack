# Graph Report - ptrack  (2026-08-08)

## Corpus Check
- 234 files · ~102,286 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1924 nodes · 4251 edges · 98 communities (85 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4afddccc`
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
- Injectable
- @types/node
- nest-cli.json
- WeightEntryDto
- kpis.repository.ts
- RisksModule
- moduleFileExtensions
- jose

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 115 edges
2. `AuthUser` - 63 edges
3. `CurrentUser` - 63 edges
4. `DatabaseService` - 49 edges
5. `@nestjs/swagger` - 47 edges
6. `Button()` - 37 edges
7. `cn()` - 36 edges
8. `usePageTitle()` - 29 edges
9. `toast` - 28 edges
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

## Communities (98 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (27): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Delete, Get, Param (+19 more)

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
Cohesion: 0.08
Nodes (31): AppModule, Module, bootstrap(), ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (13): AuthUser, CurrentUser, Delete, NotificationsController, Controller, Get, Param, Post (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (14): Props, Props, Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (21): dashboardApi, DashboardData, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CategoryDonut(), ChartPoint, ChartSegment (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (34): Props, AddIssueDialog(), emptyPerson(), Props, AddRiskDialog(), emptyPerson(), EDITABLE_OPTIONS, VIEWABLE_OPTIONS (+26 more)

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (37): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), EditOutcomeDialog(), NavSection, Props (+29 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (21): EditProjectDialog(), personFromProfile(), PersonAutocomplete(), Props, categoriesApi, sectorsApi, usersApi, UserSummary (+13 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.16
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (11): calculatedProgress(), MilestoneProgressRow, plannedProgress(), Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository (+3 more)

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
Nodes (19): class-variance-authority, clsx, @fontsource-variable/inter, dependencies, class-variance-authority, clsx, @fontsource-variable/inter, lucide-react (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, class-validator, @nestjs/config, @nestjs/core, @nestjs/schedule, @nestjs/swagger, reflect-metadata (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (24): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+16 more)

### Community 27 - "Community 27"
Cohesion: 0.16
Nodes (12): DashboardController, Controller, Get, DashboardModule, Module, ChartPoint, CLOSED_PROJECT, DashboardData (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.17
Nodes (14): Props, ActionItem, actionItemsApi, auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel() (+6 more)

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
Cohesion: 0.18
Nodes (13): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES, today(), ProtectedRoute(), AuthContext (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.07
Nodes (25): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+17 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

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
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.15
Nodes (13): AppLayout(), NAV_ITEMS, ACTIONS, CommandPalette(), Entry, Props, NotificationBell(), timeAgo() (+5 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (8): Controller, Get, Query, UsersController, Module, UsersModule, Injectable, UsersService

### Community 46 - "nest-cli.json"
Cohesion: 0.15
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.09
Nodes (32): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), Props, ActionItemOwner, AdminLookupRow, adminLookupsApi (+24 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+17 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.19
Nodes (14): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), Textarea() (+6 more)

### Community 56 - "@types/node"
Cohesion: 0.15
Nodes (3): toHttpException(), SubmissionsRepository, Injectable

### Community 57 - ".update"
Cohesion: 0.24
Nodes (12): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+4 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.13
Nodes (14): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 59 - "@types/node"
Cohesion: 0.16
Nodes (17): App(), Chip(), attachmentsApi, AuthProvider(), usePageTitle(), CodeTablesPage(), labelFor(), AttachmentDetailPage() (+9 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+20 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.23
Nodes (10): StatusPill(), TONE_CLASSES, toneFor(), calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore(), riskSeverityTone() (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.21
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.13
Nodes (17): ArrayMaxSize, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn (+9 more)

### Community 65 - ".add"
Cohesion: 0.18
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 66 - "react-dom"
Cohesion: 0.24
Nodes (7): HistoryEntry, logger, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 67 - "CreateLinkDto"
Cohesion: 0.18
Nodes (12): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, ActionItemDetailPage(), commentAuthor() (+4 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.21
Nodes (11): AddKpiDialog(), emptyPerson(), FREQUENCIES, Props, Kpi, KpiReading, kpisApi, formatValue() (+3 more)

### Community 69 - "CreateRiskDto"
Cohesion: 0.13
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, ReportsController, SubmissionsController (+8 more)

### Community 70 - "CreatePersonDto"
Cohesion: 0.23
Nodes (8): KpisController, Body, Controller, Delete, Get, Param, Patch, Post

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 73 - ".add"
Cohesion: 0.12
Nodes (6): HistoryInsert, ActionItemsRepository, Injectable, ActionItemsService, ownersLabel(), Injectable

### Community 74 - "DatabaseService"
Cohesion: 0.12
Nodes (8): AuthedRequest, DatabaseModule, Module, DatabaseService, Injectable, RecordHistoryService, Injectable, Global

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.19
Nodes (11): classifyDue(), ReminderKind, reminderType(), resolveRecipients(), DueActionItem, DueMilestone, localIso(), ProjectRef (+3 more)

### Community 76 - ".add"
Cohesion: 0.18
Nodes (23): Props, CategorySelect(), Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+15 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.15
Nodes (15): AddStatusReportDialog(), Props, today(), dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS (+7 more)

### Community 79 - "ActionItemsController"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "RecordHistory.tsx"
Cohesion: 0.21
Nodes (10): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), Props, SectionCard() (+2 more)

### Community 82 - "skeleton.tsx"
Cohesion: 0.67
Nodes (3): Cycle, Submission, SubmissionListItem

### Community 84 - "AddActionItemDialog.tsx"
Cohesion: 0.18
Nodes (17): COLUMNS, ProjectsGrid(), Project, ProjectListItem, buildCsv(), downloadCsv(), escapeCell(), GridSort (+9 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 92 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 93 - "WeightEntryDto"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 94 - "kpis.repository.ts"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 96 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

## Knowledge Gaps
- **407 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+402 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `@types/node` to `Community 1`, `Community 6`, `Community 7`, `Community 10`, `Community 12`, `CreateProjectDto`, `Community 20`, `Community 26`, `Community 27`, `Community 34`, `status-reports.repository.ts`, `Community 45`, `RecordHistoryService`, `ProjectsController`, `PeopleRepository`, `.add`, `react-dom`, `CreateRiskDto`, `.add`, `skeleton.tsx`, `kpis.repository.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `Community 1`, `Community 5`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 26`, `AddMilestoneDialog.tsx`, `Community 34`, `ProjectsRepository`, `status-reports.repository.ts`, `CreateProjectDto`, `RecordHistoryService`, `ProjectsController`, `.update`, `PeopleRepository`, `PaginationQueryDto`, `CreateRiskDto`, `nest-cli.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `Community 8` to `PaginationQueryDto`, `Community 1`, `Community 34`, `Community 26`, `CreateRiskDto`, `CreatePersonDto`, `Community 7`, `status-reports.repository.ts`, `Community 10`, `nest-cli.json`, `ActionItemsController`, `RecordHistoryService`, `@nestjs/swagger`, `ProjectsController`, `.update`, `@nestjs/swagger`, `PeopleRepository`, `auth-context.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _407 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05989110707803993 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._