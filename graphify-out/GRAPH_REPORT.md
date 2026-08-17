# Graph Report - ptrack  (2026-08-17)

## Corpus Check
- 298 files · ~139,625 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2329 nodes · 5365 edges · 114 communities (100 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3d036de`
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
- lookups.service.ts
- 🚀 Quick start
- AddMilestoneDialog.tsx
- transform
- @nestjs/swagger
- AttachmentDetailPage.tsx
- @supabase/supabase-js
- DashboardService
- projects.module.ts
- Get
- DatabaseModule
- ImportPage.tsx
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- ProjectsGrid.tsx
- 2. Findings per surface
- .findOne
- 🚀 Quick start
- jose
- AddPersonDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- AppModule
- vitest
- @vitejs/plugin-react
- AddStatusReportDialog
- @tailwindcss/vite
- @testing-library/react
- typescript-eslint
- DatabaseModule
- @eslint/js

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 142 edges
2. `AuthUser` - 78 edges
3. `CurrentUser` - 76 edges
4. `DatabaseService` - 59 edges
5. `@nestjs/swagger` - 56 edges
6. `personName()` - 52 edges
7. `Button()` - 45 edges
8. `usePageTitle()` - 45 edges
9. `toast` - 36 edges
10. `cn()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `ProjectGantt()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `ProjectGantt()` --indirect_call--> `statusClass()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → frontend/src/pages/TimelinePage.tsx

## Import Cycles
- None detected.

## Communities (114 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (17): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiBody, Body (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (9): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Conventions carried forward, FDD Alignment — P-Track ⇄ Project Tracker FDD (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (38): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+30 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (19): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (24): logger, DatabaseService, Injectable, RecordHistoryService, Injectable, Issue, IssueListItem, Kpi (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (19): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (13): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, AttachmentsRepository, PARENT_TABLES, Injectable (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (20): dashboardApi, DashboardData, ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (22): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+14 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (12): RegistryController, Controller, Get, RegistryModule, Module, DirectoryMembership, DirectoryPerson, GlobalActionItem (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.04
Nodes (77): AddAttachmentDialog(), AddIssueDialog(), emptyPerson(), Props, AddLinkDialog(), AddMilestoneDialog(), emptyOwner(), ownerFromMilestone() (+69 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (3): toHttpException(), ProjectsRepository, Injectable

### Community 17 - "CreateProjectDto"
Cohesion: 0.08
Nodes (24): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+16 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+17 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (20): hooks, PreToolUse, includeCoAuthoredBy, permissions, allow, defaultMode, deny, $schema (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.08
Nodes (25): @base-ui/react, class-variance-authority, clsx, dhtmlx-gantt, @fontsource-variable/inter, frappe-gantt, dependencies, @base-ui/react (+17 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, jose, @nestjs/config, @nestjs/core, @nestjs/platform-express, @nestjs/swagger, reflect-metadata (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (7): riskScore(), Risk, RiskListItem, RisksRepository, Injectable, RisksService, Injectable

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (4): LinksRepository, Injectable, LinksService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.06
Nodes (53): App(), AppLayout(), NAV_ITEMS, ProtectedRoute(), Props, TagChips(), Chip(), cyclesApi (+45 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.08
Nodes (14): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+6 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.29
Nodes (9): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), ChartPoint, CLOSED_PROJECT, DashboardData, iso() (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (23): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+15 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.27
Nodes (5): DashboardController, Controller, Get, DashboardService, Injectable

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.07
Nodes (26): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+18 more)

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
Cohesion: 0.09
Nodes (20): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+12 more)

### Community 45 - "Community 45"
Cohesion: 0.20
Nodes (10): UpdateMilestoneDto, MilestonesController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.24
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.05
Nodes (54): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), today(), AvatarCluster(), colorOf(), InitialsAvatar() (+46 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.04
Nodes (50): Props, Props, Props, Props, AddStatusReportDialog(), Props, today(), Props (+42 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.08
Nodes (21): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+13 more)

### Community 50 - "Community 50"
Cohesion: 0.12
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (26): 1. Ground rules (every session obeys these), 2026-08-13 — Phase 0a, frontend test runner (no skill; a port, not a design pass), 2026-08-13 — Phase 0b, characterization tests for the three pilot modules, 2026-08-13 — Phase 1a, `modules/links/` (the control case), 2026-08-13 — Phase 1b, `modules/projects/` (the complex case), 2026-08-13 — Phase 1c, `modules/action-items/` + the shared-helper promotion, 2026-08-13 — Phase 2a, `modules/program-outcomes/` (+ a bug fix), 2026-08-13 — Phase 2b, `modules/milestones/` (+18 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 56 - "@types/node"
Cohesion: 0.10
Nodes (20): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+12 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.48
Nodes (7): apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload(), authHeader(), handle()

### Community 59 - "@types/node"
Cohesion: 0.15
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.28
Nodes (8): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), inviteDraft(), isPocEmail(), pocEmail(), tempPassword()

### Community 63 - "auth-context.tsx"
Cohesion: 0.05
Nodes (39): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+31 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.22
Nodes (9): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+1 more)

### Community 65 - ".add"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 66 - "react-dom"
Cohesion: 0.40
Nodes (3): ProgramOutcomesController, Controller, Get

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (7): ApiTags, ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 68 - "RecordHistoryService"
Cohesion: 0.20
Nodes (11): AddKpiDialog(), emptyPerson(), Props, Kpi, KpiReading, kpisApi, formatValue(), KpiDetail() (+3 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.17
Nodes (13): sectorsApi, emptyMember(), Props, StepAccess(), StepConfirmation(), Props, StepDetails(), Props (+5 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.09
Nodes (18): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable, classifyDue(), inSubmissionWindow(), ReminderKind (+10 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.06
Nodes (43): AuthUser, CurrentUser, ActionItemsController, ApiBody, Body, Controller, Delete, Get (+35 more)

### Community 73 - ".add"
Cohesion: 0.08
Nodes (23): CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray, IsDateString, IsIn, IsOptional (+15 more)

### Community 74 - "DatabaseService"
Cohesion: 0.21
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.19
Nodes (37): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, CategorySelect(), Props (+29 more)

### Community 76 - ".add"
Cohesion: 0.29
Nodes (4): UpdateProgramOutcomeDto, ProgramOutcome, COLUMN_SPEC, CREATE_DEFAULTS

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.17
Nodes (9): PortfolioReportsController, Controller, Get, Query, ReportsModule, Module, MONTH_LABELS, ReportsService (+1 more)

### Community 82 - "🚀 Quick start"
Cohesion: 0.10
Nodes (24): db, ensure(), env, PROGRAMS, root, rows(), STANDARD, Props (+16 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.13
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 84 - "transform"
Cohesion: 0.17
Nodes (4): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 85 - "@nestjs/swagger"
Cohesion: 0.18
Nodes (10): MilestoneProgressRow, Project, ProjectDetail, ProjectListRow, ProjectListStats, COLUMN_SPEC, projectColumns(), ProjectsService (+2 more)

### Community 86 - "AttachmentDetailPage.tsx"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "DashboardService"
Cohesion: 0.13
Nodes (20): DashboardModule, Module, ImportModule, Module, KpisModule, Module, MilestonesModule, Module (+12 more)

### Community 89 - "projects.module.ts"
Cohesion: 0.27
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 90 - "Get"
Cohesion: 0.10
Nodes (9): ActionItemsRepository, Injectable, ActionItemsService, COLUMN_SPEC, CREATE_DEFAULTS, normalizeOwnerIds(), Owners, ownersLabel() (+1 more)

### Community 91 - "DatabaseModule"
Cohesion: 0.40
Nodes (3): LinksController, Controller, Get

### Community 93 - "ImportPage.tsx"
Cohesion: 0.13
Nodes (22): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+14 more)

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
Cohesion: 0.18
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - ".findOne"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 110 - "AppModule"
Cohesion: 0.50
Nodes (3): AppModule, Module, bootstrap()

### Community 124 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Module, Global

## Knowledge Gaps
- **490 isolated node(s):** `$schema`, `includeCoAuthoredBy`, `defaultMode`, `Bash(npm run dev:*)`, `Bash(npm run start:*)` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `Community 16` to `Community 1`, `Community 5`, `Community 7`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `CreateProjectDto`, `Community 26`, `Community 27`, `AddMilestoneDialog.tsx`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `PeopleRepository`, `auth-context.tsx`, `2. Core functional modules`, `.add`, `lookups.service.ts`, `AddMilestoneDialog.tsx`, `transform`, `@nestjs/swagger`, `projects.module.ts`, `Get`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `@nestjs/config` to `Community 1`, `Community 34`, `ProjectsGrid.tsx`, `Community 5`, `Community 6`, `status-reports.repository.ts`, `Community 8`, `.add`, `Community 10`, `.add`, `Community 45`, `Community 44`, `CreateProjectDto`, `RecordHistoryService`, `auth-context.tsx`, `@types/node`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `.add` to `.add`, `Community 1`, `ProjectsGrid.tsx`, `CreateLinkDto`, `Community 5`, `status-reports.repository.ts`, `Community 8`, `Community 10`, `eslint-plugin-react-hooks`, `Community 12`, `.add`, `AppModule`, `Community 44`, `CreateProjectDto`, `RecordHistoryService`, `PeopleRepository`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `$schema`, `includeCoAuthoredBy`, `defaultMode` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._