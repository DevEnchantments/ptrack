# Graph Report - ptrack  (2026-08-18)

## Corpus Check
- 334 files · ~149,718 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2523 nodes · 5792 edges · 143 communities (115 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c32f1d90`
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
- AppModule
- status-reports.repository.ts
- PeopleController
- DatabaseModule
- PeoplePage.tsx
- users.module.ts
- AuthUser
- 1. Data-object mapping (FDD Appendix A → P-Track schema)
- 2. Core functional modules
- README.md
- CreateLookupValueDto
- ProjectsGrid.tsx
- 2. Findings per surface
- ProjectProgressReportPage.tsx
- nest-cli.json
- LookupsService
- 🚀 Quick start
- CreateRiskDto
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- eslint-plugin-prettier
- ProjectsController
- RisksService
- app.module.ts
- submissions.module.ts
- .constructor
- InitialsAvatar.tsx
- vitest
- SectionNav.tsx
- ts-node
- supabase.ts
- Controller
- SubmissionsModule
- InitialsAvatar.tsx
- ProgramOutcomesService
- PaginationQueryDto
- TemplatesModule
- vite
- toaster.tsx
- @eslint/js
- Injectable
- ApiProperty
- IsString
- .update
- MaxLength
- ApiBody
- Body
- Controller
- Get
- Patch
- Post
- Query
- Injectable

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 147 edges
2. `AuthUser` - 91 edges
3. `CurrentUser` - 89 edges
4. `DatabaseService` - 65 edges
5. `@nestjs/swagger` - 60 edges
6. `Button()` - 41 edges
7. `toast` - 36 edges
8. `cn()` - 36 edges
9. `usePageTitle()` - 35 edges
10. `RecordHistoryService` - 30 edges

## Surprising Connections (you probably didn't know these)
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `UsersRolesPage()` --calls--> `usePageTitle()`  [EXTRACTED]
  frontend/src/pages/admin/UsersRolesPage.tsx → frontend/src/lib/use-page-title.ts
- `DashboardPage()` --calls--> `usePageTitle()`  [EXTRACTED]
  frontend/src/pages/DashboardPage.tsx → frontend/src/lib/use-page-title.ts

## Import Cycles
- None detected.

## Communities (143 total, 28 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (18): ApiBody, ApiProperty, UpdateMeDto, UsersController, Module, UsersModule, UsersService, Body (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (3): ActionItemsRepository, Injectable, normalizeOwnerIds()

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (17): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, CyclesController, ReportsController (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (18): AddIssueDialog(), emptyPerson(), AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES, today() (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.27
Nodes (8): MilestonesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (45): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), OutcomeDialog(), SaveTemplateDialog(), NavSection (+37 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (11): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), ChartPoint, CLOSED_PROJECT, DashboardData (+3 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.10
Nodes (17): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (40): FREQUENCIES, ACCESS_LEVELS, CategorySelect(), Props, FY_YEARS, FieldError(), PersonAutocomplete(), Props (+32 more)

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
Cohesion: 0.38
Nodes (4): HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (7): NotificationsController, Controller, AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.05
Nodes (54): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), AddStatusReportDialog() (+46 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.15
Nodes (19): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), DashboardPage() (+11 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.22
Nodes (11): COLUMNS, ProjectsGrid(), Props, TreeRow, StatusPill(), TONE_CLASSES, toneFor(), ProjectListItem (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.14
Nodes (6): Link, LinkListItem, LinksRepository, Injectable, LinksService, Injectable

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.13
Nodes (19): AdminOnly(), MinAppRole(), ProjectAccess(), AccessLevel, AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.23
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

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
Cohesion: 0.17
Nodes (11): columnsFrom(), ColumnSpec, Project, ProjectDetail, ProjectListRow, ProjectListStats, COLUMN_SPEC, projectColumns() (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (6): AttachmentParent, AttachmentsRepository, Injectable, AttachmentsService, safeName(), Injectable

### Community 46 - "nest-cli.json"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.05
Nodes (53): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+45 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.05
Nodes (48): App(), AppLayout(), NAV_ITEMS, addDays(), ProjectGantt(), Props, todayIso(), Props (+40 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.36
Nodes (4): DashboardController, Controller, DashboardService, Injectable

### Community 50 - "Community 50"
Cohesion: 0.15
Nodes (13): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+5 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (20): AuthedRequest, DatabaseService, Injectable, Milestone, MilestoneListItem, ProgramOutcome, DirectoryMembership, DirectoryPerson (+12 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.15
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 56 - "@types/node"
Cohesion: 0.19
Nodes (12): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+4 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.18
Nodes (5): DatabaseModule, Global, Module, RecordHistoryService, Injectable

### Community 59 - "@types/node"
Cohesion: 0.17
Nodes (13): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParentType, PARENT_TABLES, PARENT_TYPES, parseParent(), ApiPropertyOptional (+5 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.06
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.15
Nodes (16): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+8 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.12
Nodes (25): APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS, DEFAULT_GRANTS, defaultLevelFor() (+17 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.13
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - ".add"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "react-dom"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 67 - "CreateLinkDto"
Cohesion: 0.19
Nodes (12): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+4 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.17
Nodes (14): fmtAed(), ProjectOverviewCards(), Props, SectionCard(), Skeleton(), atRiskSuggested(), calculatedProgress(), MilestoneProgressRow (+6 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.19
Nodes (10): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.23
Nodes (8): ProgramOutcomesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 71 - "moduleFileExtensions"
Cohesion: 0.22
Nodes (8): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Assumptions that need your confirmation, 5. Decisions only you can make, 6. Blocked on infrastructure, 7. Out of scope, on purpose, P-Track progress summary

### Community 73 - ".add"
Cohesion: 0.09
Nodes (17): AuthUser, CurrentUser, Delete, Get, Delete, Delete, Get, Param (+9 more)

### Community 74 - "DatabaseService"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.21
Nodes (19): EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, Props, Props, HelpDot(), Props (+11 more)

### Community 76 - ".add"
Cohesion: 0.11
Nodes (21): NotificationBell(), timeAgo(), Chip(), personName(), Props, STATUS_CHIP, WorkflowPanel(), AppNotification (+13 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.10
Nodes (22): ActionItemsService, COLUMN_SPEC, CREATE_DEFAULTS, Owners, ownersLabel(), Injectable, CreateActionItemDto, ApiProperty (+14 more)

### Community 79 - "README.md"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.17
Nodes (14): Props, Props, Props, Props, Props, ProjectSections, Issue, issuesApi (+6 more)

### Community 82 - "🚀 Quick start"
Cohesion: 0.16
Nodes (16): Props, Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS (+8 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.20
Nodes (9): IssuesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 84 - "transform"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.10
Nodes (17): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, AccessAdminService (+9 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.27
Nodes (4): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 89 - "status-reports.repository.ts"
Cohesion: 0.12
Nodes (9): HistoryEntry, logger, toHttpException(), ProjectsRepository, Injectable, Delete, Param, TemplatesService (+1 more)

### Community 90 - "PeopleController"
Cohesion: 0.23
Nodes (6): PortfolioReportsController, Controller, Get, Query, ReportsService, Injectable

### Community 91 - "DatabaseModule"
Cohesion: 0.07
Nodes (31): CommandPalette(), Entry, hitPath(), KIND_META, Props, accessApi, AdminLookupRow, adminLookupsApi (+23 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.24
Nodes (9): AddKpiDialog(), emptyPerson(), Props, Kpi, formatValue(), KpiDetail(), KpisPage(), sortedReadings() (+1 more)

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.25
Nodes (5): 🏗 Architecture, 📚 More docs, 🧪 Quality, 🗺 Roadmap, ✨ What's inside

### Community 98 - "CreateLookupValueDto"
Cohesion: 0.29
Nodes (10): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+2 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "LookupsService"
Cohesion: 0.16
Nodes (23): Props, Props, Props, Props, apiUpload(), Attachment, AttachmentDetail, apiDelete() (+15 more)

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 105 - "CreateRiskDto"
Cohesion: 0.07
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+23 more)

### Community 110 - "ProjectsController"
Cohesion: 0.11
Nodes (19): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+11 more)

### Community 111 - "RisksService"
Cohesion: 0.08
Nodes (23): riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString (+15 more)

### Community 112 - "app.module.ts"
Cohesion: 0.28
Nodes (8): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), inviteDraft(), isPocEmail(), pocEmail(), tempPassword()

### Community 113 - "submissions.module.ts"
Cohesion: 0.44
Nodes (4): UpdateKpiActionPlanDto, UpdateKpiDto, KpisModule, Module

### Community 114 - ".constructor"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 118 - "SectionNav.tsx"
Cohesion: 0.29
Nodes (6): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength

### Community 119 - "ts-node"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 120 - "supabase.ts"
Cohesion: 0.50
Nodes (3): buildCsv(), escapeCell(), parseCsv()

### Community 121 - "Controller"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.17
Nodes (4): ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 125 - "PaginationQueryDto"
Cohesion: 0.10
Nodes (26): DirectoryPerson, GlobalMilestone, importApi, registryApi, milestonesApi, usePageTitle(), AttachmentDetailPage(), formatSize() (+18 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 133 - ".update"
Cohesion: 0.07
Nodes (24): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+16 more)

## Knowledge Gaps
- **512 isolated node(s):** `NAV_ITEMS`, `Props`, `Props`, `AppRole`, `MyMembership` (+507 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ms()` connect `RecordHistoryService` to `Community 16`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `status-reports.repository.ts` to `Injectable`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 16`, `CreateProjectDto`, `Community 26`, `Community 27`, `Community 34`, `CreateProjectDto`, `Community 44`, `Community 45`, `ProjectsController`, `@types/node`, `PeopleRepository`, `auth-context.tsx`, `PaginationQueryDto`, `@nestjs/config`, `@nestjs/swagger`, `AppModule`, `PeopleController`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `ProjectsController`, `RisksService`, `ts-node`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `.add` to `.update`, `Community 7`, `Community 10`, `Community 13`, `CreateProjectDto`, `Community 27`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 44`, `RecordHistoryService`, `Community 50`, `@types/node`, `PeopleRepository`, `CreateMilestoneDto`, `auth-context.tsx`, `react-dom`, `CreateLinkDto`, `WorkflowPanel.tsx`, `2. Core functional modules`, `WorkflowPanel.tsx`, `README.md`, `AddMilestoneDialog.tsx`, `@nestjs/swagger`, `PeopleController`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `RisksService`, `submissions.module.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `Props`, `Props` to the rest of the system?**
  _512 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._