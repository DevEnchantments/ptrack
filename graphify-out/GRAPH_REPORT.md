# Graph Report - ptrack  (2026-08-17)

## Corpus Check
- 298 files · ~139,764 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2329 nodes · 5294 edges · 122 communities (107 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84c3dd7c`
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
- ts-jest
- ImportPage.tsx
- ts-loader
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- ts-node
- ProjectsGrid.tsx
- 2. Findings per surface
- @types/supertest
- seed-generic-lookups.mjs
- lookups.service.ts
- 🚀 Quick start
- jose
- .add
- eslint-plugin-react-hooks
- frappe-gantt
- moduleFileExtensions
- AppModule
- vitest
- jose
- @nestjs/common
- @nestjs/platform-express
- @vitejs/plugin-react
- AddStatusReportDialog
- @tailwindcss/vite
- @testing-library/react
- typescript-eslint
- @eslint/js

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 134 edges
2. `AuthUser` - 78 edges
3. `CurrentUser` - 76 edges
4. `DatabaseService` - 57 edges
5. `@nestjs/swagger` - 56 edges
6. `personName()` - 52 edges
7. `Button()` - 45 edges
8. `usePageTitle()` - 45 edges
9. `toast` - 36 edges
10. `cn()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `ProjectGantt()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → backend/scripts/seed-generic-lookups.mjs
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `ProjectGantt()` --indirect_call--> `statusClass()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → frontend/src/pages/TimelinePage.tsx

## Import Cycles
- None detected.

## Communities (122 total, 15 thin omitted)

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
Cohesion: 0.06
Nodes (31): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (19): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): logger, DatabaseService, Injectable, Issue, IssueListItem, Kpi, KpiActionPlan, KpiListItem (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (9): RisksController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (15): RecordHistoryService, Injectable, Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, AttachmentsRepository (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (20): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+12 more)

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
Nodes (92): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), today(), AddAttachmentDialog(), AddIssueDialog(), emptyPerson() (+84 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.10
Nodes (22): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+14 more)

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
Nodes (21): dependencies, class-transformer, class-validator, @nestjs/config, @nestjs/core, @nestjs/schedule, @nestjs/swagger, reflect-metadata (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (9): riskScore(), NotificationsModule, Module, Risk, RiskListItem, RisksRepository, Injectable, RisksService (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (9): importApi, ImportSummary, FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck, validDate() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.05
Nodes (53): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, Props, SectionCard(), Props (+45 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.16
Nodes (11): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+3 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.14
Nodes (16): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), DashboardController, Controller, Get (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.31
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.07
Nodes (24): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+16 more)

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
Cohesion: 0.11
Nodes (18): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+10 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.10
Nodes (16): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.21
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 46 - "nest-cli.json"
Cohesion: 0.24
Nodes (9): CommandPalette(), Entry, hitPath(), KIND_META, Props, SavedSearch, searchApi, SearchHit (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (16): AddStatusReportDialog(), EDITABLE_OPTIONS, Props, today(), VIEWABLE_OPTIONS, dateParts(), MiniCalendar(), MONTHS (+8 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.05
Nodes (42): Props, Props, Props, Props, Props, NotificationBell(), timeAgo(), formatSize() (+34 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.09
Nodes (18): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+10 more)

### Community 50 - "Community 50"
Cohesion: 0.12
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (26): 1. Ground rules (every session obeys these), 2026-08-13 — Phase 0a, frontend test runner (no skill; a port, not a design pass), 2026-08-13 — Phase 0b, characterization tests for the three pilot modules, 2026-08-13 — Phase 1a, `modules/links/` (the control case), 2026-08-13 — Phase 1b, `modules/projects/` (the complex case), 2026-08-13 — Phase 1c, `modules/action-items/` + the shared-helper promotion, 2026-08-13 — Phase 2a, `modules/program-outcomes/` (+ a bug fix), 2026-08-13 — Phase 2b, `modules/milestones/` (+18 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 56 - "@types/node"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, LinksModule, Module, ProjectSectionsModule, Module (+10 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.48
Nodes (7): apiDelete(), apiGet(), apiPatch(), apiPost(), apiUpload(), authHeader(), handle()

### Community 59 - "@types/node"
Cohesion: 0.21
Nodes (6): ProjectsController, Controller, Delete, Get, Param, Query

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (28): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+20 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.27
Nodes (10): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), Props, usersApi, inviteDraft(), isPocEmail() (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.13
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 65 - ".add"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 66 - "react-dom"
Cohesion: 0.28
Nodes (6): ApiBody, Body, Delete, Param, Patch, Post

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (7): ApiTags, ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 68 - "RecordHistoryService"
Cohesion: 0.20
Nodes (11): AddKpiDialog(), emptyPerson(), Props, Kpi, KpiReading, kpisApi, formatValue(), KpiDetail() (+3 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.08
Nodes (32): App(), AppLayout(), NAV_ITEMS, ProtectedRoute(), Card(), CardAction(), CardContent(), CardDescription() (+24 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.12
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 71 - "moduleFileExtensions"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.21
Nodes (11): CurrentUser, NotificationsController, Controller, Get, Param, Post, SubmissionsController, ApiBody (+3 more)

### Community 73 - ".add"
Cohesion: 0.12
Nodes (15): AuthUser, ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param (+7 more)

### Community 74 - "DatabaseService"
Cohesion: 0.12
Nodes (8): CreateCommentDto, ApiProperty, IsString, MinLength, UpdateActionItemDto, UpdateMilestoneDto, UpdateRiskDto, @nestjs/swagger

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.17
Nodes (42): STATUSES, FREQUENCIES, STATUSES, ACCESS_LEVELS, CategorySelect(), Props, ConfirmDeleteButton(), Props (+34 more)

### Community 76 - ".add"
Cohesion: 0.22
Nodes (9): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+1 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.13
Nodes (6): toHttpException(), IssuesRepository, Injectable, ProgramOutcome, ProgramOutcomesRepository, Injectable

### Community 79 - "README.md"
Cohesion: 0.20
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.18
Nodes (8): PortfolioReportsController, Controller, Get, Query, ReportsModule, Module, ReportsService, Injectable

### Community 82 - "🚀 Quick start"
Cohesion: 0.10
Nodes (28): Props, Props, Props, Props, Props, Props, formatAed(), milestoneShares() (+20 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.14
Nodes (4): Milestone, MilestoneListItem, MilestonesRepository, Injectable

### Community 84 - "transform"
Cohesion: 0.10
Nodes (19): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+11 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.14
Nodes (10): Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository, Injectable, COLUMN_SPEC, ProjectsService (+2 more)

### Community 86 - "AttachmentDetailPage.tsx"
Cohesion: 0.21
Nodes (3): AuthedRequest, SupabaseAuthGuard, Injectable

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "DashboardService"
Cohesion: 0.19
Nodes (10): ImportModule, Module, MilestonesModule, Module, ProgramOutcomesModule, Module, ProjectsModule, Module (+2 more)

### Community 89 - "projects.module.ts"
Cohesion: 0.21
Nodes (4): COLUMN_SPEC, CREATE_DEFAULTS, MilestonesService, Injectable

### Community 90 - "Get"
Cohesion: 0.08
Nodes (17): columnsFrom(), ColumnSpec, HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, ActionItemsRepository (+9 more)

### Community 91 - "DatabaseModule"
Cohesion: 0.21
Nodes (9): KpisController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 92 - "ts-jest"
Cohesion: 0.21
Nodes (10): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 93 - "ImportPage.tsx"
Cohesion: 0.14
Nodes (22): FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES (+14 more)

### Community 94 - "ts-loader"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.25
Nodes (5): 🏗 Architecture, 📚 More docs, 🧪 Quality, 🗺 Roadmap, ✨ What's inside

### Community 98 - "ts-node"
Cohesion: 0.18
Nodes (11): CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray, IsDateString, IsIn, IsOptional (+3 more)

### Community 99 - "ProjectsGrid.tsx"
Cohesion: 0.08
Nodes (21): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+13 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 101 - "@types/supertest"
Cohesion: 0.20
Nodes (4): COLUMN_SPEC, CREATE_DEFAULTS, ProgramOutcomesService, Injectable

### Community 102 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 103 - "lookups.service.ts"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 106 - ".add"
Cohesion: 0.28
Nodes (6): ApiBody, Body, Delete, Param, Patch, Post

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 109 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 110 - "AppModule"
Cohesion: 0.12
Nodes (16): AppModule, Module, DatabaseModule, Module, bootstrap(), DashboardModule, Module, IssuesModule (+8 more)

## Knowledge Gaps
- **490 isolated node(s):** `COLUMN_SPEC`, `CREATE_DEFAULTS`, `COLUMN_SPEC`, `CREATE_DEFAULTS`, `Verification gate (all must pass before a phase is ticked)` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toHttpException()` connect `WorkflowPanel.tsx` to `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `Community 16`, `Community 20`, `Community 26`, `nest-cli.json`, `Community 34`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `@types/node`, `PeopleRepository`, `auth-context.tsx`, `PaginationQueryDto`, `2. Core functional modules`, `lookups.service.ts`, `@nestjs/swagger`, `Get`, `ProjectsGrid.tsx`, `lookups.service.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `.add` to `Community 1`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `CreateProjectDto`, `AddMilestoneDialog.tsx`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 44`, `Community 45`, `RecordHistoryService`, `PeopleRepository`, `auth-context.tsx`, `react-dom`, `@nestjs/config`, `DatabaseService`, `transform`, `DatabaseModule`, `ts-jest`, `ProjectsGrid.tsx`, `.add`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `@nestjs/config` to `Community 1`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `CreateProjectDto`, `AddMilestoneDialog.tsx`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 44`, `Community 45`, `RecordHistoryService`, `PeopleRepository`, `auth-context.tsx`, `react-dom`, `.add`, `DatabaseService`, `transform`, `DatabaseModule`, `ts-jest`, `ProjectsGrid.tsx`, `.add`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `COLUMN_SPEC`, `CREATE_DEFAULTS`, `COLUMN_SPEC` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._