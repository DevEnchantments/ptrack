# Graph Report - ptrack  (2026-08-05)

## Corpus Check
- 215 files · ~88,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1711 nodes · 3569 edges · 100 communities (80 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a5931f5`
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
- MiniCalendar.tsx
- NotificationBell.tsx
- tw-animate-css
- ProjectsGrid.tsx
- Update
- ApiBody
- Body
- moduleFileExtensions
- submissions.repository.ts
- Get
- Param
- Post
- Module
- HomePage

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 90 edges
2. `AuthUser` - 52 edges
3. `CurrentUser` - 52 edges
4. `@nestjs/swagger` - 43 edges
5. `DatabaseService` - 41 edges
6. `cn()` - 36 edges
7. `Button()` - 27 edges
8. `RecordHistoryService` - 26 edges
9. `CreateProjectDto` - 22 edges
10. `compilerOptions` - 22 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `Props` --references--> `ProjectDetail`  [EXTRACTED]
  frontend/src/components/EditProjectDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `ProjectDetail`  [EXTRACTED]
  frontend/src/components/ProjectOverviewCards.tsx → frontend/src/lib/api.ts
- `Props` --references--> `Milestone`  [EXTRACTED]
  frontend/src/components/AdjustWeightsDialog.tsx → frontend/src/lib/api.ts
- `Props` --references--> `MilestoneDetail`  [EXTRACTED]
  frontend/src/components/AddMilestoneDialog.tsx → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (100 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (3): AttachmentsRepository, Injectable, safeName()

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (44): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+36 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (17): ArrayMaxSize, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (26): ACTION_ITEM_SEGMENTS, ActionItemsBreakdown(), ActivityHeatmap(), ActivityLineChart(), CATEGORY_SEGMENTS, CategoryDonut(), CompletionRadial(), FLOW_SERIES (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (15): LookupsController, Body, Controller, Get, Param, Post, LookupsModule, Module (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (28): ACTIONS, attachmentUploader(), collapsePrefsKey(), EXT_STYLES, fileExt(), formatReportDate(), formatSize(), initials() (+20 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (17): ApiBody, ACTION_BODY, ReportsController, SubmissionsController, Cycle, Submission, SubmissionListItem, SubmissionsRepository (+9 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.15
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (4): ProjectsRepository, Injectable, ProjectsService, Injectable

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node (+13 more)

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
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (11): auditLine(), formatLongDate(), MilestoneDetailPage(), MONTHS, ownerLabel(), profileName(), relativeTime(), STATUS_LABELS (+3 more)

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
Cohesion: 0.13
Nodes (14): AuthUser, CurrentUser, Delete, Delete, NotificationsController, Controller, Get, Param (+6 more)

### Community 34 - "Community 34"
Cohesion: 0.08
Nodes (24): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+16 more)

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
Cohesion: 0.24
Nodes (5): AttachmentsController, Controller, Delete, Get, Param

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (8): PeopleController, ApiBody, Body, Controller, Delete, Param, Patch, Post

### Community 46 - "nest-cli.json"
Cohesion: 0.12
Nodes (5): ActionItemsRepository, Injectable, ActionItemsService, ownersLabel(), Injectable

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.08
Nodes (32): Props, Props, Props, Props, ActionItemOwner, apiDelete(), apiGet(), apiPatch() (+24 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (22): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+14 more)

### Community 54 - "ProjectsController"
Cohesion: 0.21
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.22
Nodes (5): DatabaseModule, Module, RecordHistoryService, Injectable, Global

### Community 56 - "@types/node"
Cohesion: 0.24
Nodes (9): HistoryEntry, HistoryInsert, logger, toHttpException(), ActionItem, ActionItemComment, ActionItemListItem, Milestone (+1 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (8): Body, Patch, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 58 - "@nestjs/swagger"
Cohesion: 0.14
Nodes (5): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.09
Nodes (20): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, IsUUID, MaxLength (+12 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.13
Nodes (13): Props, Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Issue (+5 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 65 - ".add"
Cohesion: 0.83
Nodes (3): Attachment, AttachmentDetail, AttachmentListItem

### Community 66 - "react-dom"
Cohesion: 0.14
Nodes (12): App(), AppLayout(), NAV_ITEMS, Chip(), CycleStatusReport, ProjectSections, reportsApi, AuthProvider() (+4 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (12): colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage(), commentAuthor() (+4 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.05
Nodes (105): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), AddIssueDialog() (+97 more)

### Community 69 - "CreateRiskDto"
Cohesion: 0.31
Nodes (3): AttachmentsService, Injectable, UploadedFileLike

### Community 71 - "moduleFileExtensions"
Cohesion: 0.38
Nodes (6): KIND_CLASSES, TOAST_MS, Toaster(), ToastItem, subscribeToasts(), ToastKind

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.33
Nodes (7): statusReportsApi, usePageTitle(), DashboardPage(), ACCESS_LABELS, authorName(), longDate(), StatusReportDetailPage()

### Community 76 - ".add"
Cohesion: 0.25
Nodes (6): ACTIONS, Entry, Props, Props, Project, ProjectDetail

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.38
Nodes (6): personName(), Props, STATUS_CHIP, WorkflowPanel(), Submission, submissionsApi

### Community 79 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 80 - "ApiProperty"
Cohesion: 0.29
Nodes (6): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), FORMULAS.md — P-Track calculation registry

### Community 81 - "RecordHistory.tsx"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 82 - ".add"
Cohesion: 0.33
Nodes (5): ApiConsumes, ApiBody, Post, UploadedFile, UseInterceptors

### Community 83 - "formulas.ts"
Cohesion: 0.23
Nodes (8): Props, Skeleton(), attachmentsApi, AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 84 - "AddActionItemDialog.tsx"
Cohesion: 0.33
Nodes (5): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength

### Community 86 - "MiniCalendar.tsx"
Cohesion: 0.40
Nodes (5): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS

### Community 87 - "NotificationBell.tsx"
Cohesion: 0.50
Nodes (4): NotificationBell(), timeAgo(), AppNotification, notificationsApi

### Community 93 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 99 - "HomePage"
Cohesion: 0.27
Nodes (9): COLUMNS, ProjectsGrid(), StatusPill(), TONE_CLASSES, toneFor(), ProjectListItem, GridSort, GridSortKey (+1 more)

## Knowledge Gaps
- **362 isolated node(s):** `ACTION_BODY`, `Cycle`, `1.1 Project → `projects` (EXTEND)`, `1.2 Milestone → `milestones` (mostly HAVE — big head start)`, `1.3 Task / Work Activity → `action_items` (EXTEND)` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/swagger` connect `auth-context.tsx` to `nest-cli.json`, `Community 2`, `Community 34`, `CreateRiskDto`, `status-reports.repository.ts`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 44`, `nest-cli.json`, `Community 16`, `RecordHistoryService`, `AddActionItemDialog.tsx`, `Community 26`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `@types/node` to `Community 1`, `Community 2`, `Community 5`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 13`, `CreateProjectDto`, `Community 20`, `Community 26`, `Community 34`, `ProjectsRepository`, `status-reports.repository.ts`, `CreateProjectDto`, `nest-cli.json`, `RecordHistoryService`, `.update`, `PeopleRepository`, `.add`, `CreateRiskDto`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `nest-cli.json` to `Community 2`, `Community 34`, `CreateRiskDto`, `status-reports.repository.ts`, `Community 7`, `Community 9`, `CreateProjectDto`, `Community 10`, `Community 45`, `Community 13`, `RecordHistoryService`, `.add`, `ProjectsController`, `Community 26`, `Community 27`, `PeopleRepository`, `auth-context.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `ACTION_BODY`, `Cycle`, `1.1 Project → `projects` (EXTEND)` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07215541165587419 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._