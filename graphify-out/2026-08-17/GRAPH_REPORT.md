# Graph Report - ptrack  (2026-08-17)

## Corpus Check
- 329 files · ~145,425 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2474 nodes · 5576 edges · 137 communities (120 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9821bcd6`
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
- ApiProperty
- StatusReportDetailPage.tsx
- vitest
- ActionItemsPage.tsx
- app.controller.ts
- AttachmentDetailPage.tsx
- action-items.repository.ts
- CreateTemplateDto
- SupabaseAuthGuard
- ProgramOutcomesService
- PaginationQueryDto
- AdjustWeightsDto
- attachments.repository.ts
- toaster.tsx
- ImportRowsDto
- IsArray
- IsString
- workflow.ts
- .update
- IsIn
- @eslint/js
- Global

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 148 edges
2. `AuthUser` - 66 edges
3. `CurrentUser` - 63 edges
4. `DatabaseService` - 61 edges
5. `@nestjs/swagger` - 59 edges
6. `Button()` - 44 edges
7. `usePageTitle()` - 43 edges
8. `cn()` - 36 edges
9. `toast` - 35 edges
10. `RequireCapability()` - 30 edges

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

## Communities (137 total, 17 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (12): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, PendingMembershipRow, planClaim() (+4 more)

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
Cohesion: 0.10
Nodes (8): Patch, ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable, UpdateActionItemDto

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (29): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (13): ApiBody, Body, CurrentUser, Param, Patch, ReplaceGrantsDto, ApiProperty, ApiProperty (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (7): NotificationsController, Controller, AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (9): ApiConsumes, ApiBody, Get, Param, Post, Query, UploadedFileLike, UploadedFile (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (24): ProjectSectionsService, Injectable, CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (19): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), DashboardPage() (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): RequireCapability(), LookupsController, Body, Controller, Get, Param, Patch, Post (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (5): toHttpException(), LookupsService, Injectable, RegistryService, Injectable

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (49): AddAttachmentDialog(), AddLinkDialog(), AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), OutcomeDialog(), SaveTemplateDialog(), NavSection (+41 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (18): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), DashboardController, Controller, DashboardModule (+10 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.08
Nodes (23): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+15 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (38): ACCESS_LEVELS, AddPersonDialog(), emptyPerson(), memberName(), CategorySelect(), Props, EditProjectDialog(), FY_YEARS (+30 more)

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
Cohesion: 0.09
Nodes (9): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, SubmissionsRepository, Injectable, SubmissionsService (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (20): Props, initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry (+12 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.11
Nodes (18): ApiTags, AdminOnly(), MinAppRole(), ProjectAccess(), ProjectScoped(), AccessLevel, LEVEL_LABEL, CreateCommentDto (+10 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.13
Nodes (21): Props, TagChips(), GlobalActionItem, GlobalMilestone, registryApi, usePageTitle(), ActionItemsPage(), isOverdue() (+13 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.19
Nodes (13): AppRole, CAPABILITIES, Capability, GRANTABLE_ROLES, GrantableRole, isCapability(), AppRoleGuard, Injectable (+5 more)

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
Nodes (11): Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository, Injectable, COLUMN_SPEC, projectColumns() (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.08
Nodes (22): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.13
Nodes (5): AttachmentsRepository, Injectable, AttachmentsService, safeName(), Injectable

### Community 46 - "nest-cli.json"
Cohesion: 0.19
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (10): CyclesController, ReportsController, SubmissionsController, ApiBody, Body, Controller, CurrentUser, Get (+2 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.17
Nodes (26): Props, Props, Props, Props, Props, Props, Props, apiUpload() (+18 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.22
Nodes (10): AddKpiDialog(), emptyPerson(), Props, Kpi, kpisApi, formatValue(), KpiDetail(), KpisPage() (+2 more)

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (14): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+6 more)

### Community 54 - "ProjectsController"
Cohesion: 0.12
Nodes (5): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable

### Community 55 - "action-items.repository.ts"
Cohesion: 0.25
Nodes (8): RisksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 56 - "@types/node"
Cohesion: 0.29
Nodes (6): ImportController, ApiBody, Body, Controller, CurrentUser, Post

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 59 - "@types/node"
Cohesion: 0.13
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (30): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+22 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.18
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.18
Nodes (11): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module (+3 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.10
Nodes (11): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem, MilestonesRepository (+3 more)

### Community 65 - ".add"
Cohesion: 0.20
Nodes (8): Body, Patch, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, UpdateAttachmentDto

### Community 66 - "react-dom"
Cohesion: 0.25
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Post

### Community 67 - "CreateLinkDto"
Cohesion: 0.17
Nodes (13): AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, ActionItemComment, actionItemsApi, ActionItemDetailPage() (+5 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.16
Nodes (16): Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail, Risk (+8 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.24
Nodes (11): APP_ROLES, atLeastRole(), CAPABILITY_KEYS, DEFAULT_GRANTS, defaultLevelFor(), isAppRole(), MEMBERSHIP_LEVEL, ProjectAccessInput (+3 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.22
Nodes (12): COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill(), TONE_CLASSES, toneFor() (+4 more)

### Community 72 - "@nestjs/config"
Cohesion: 0.23
Nodes (10): CreateAccountDialog(), Props, formatSize(), Props, TaskAttachments(), attachmentsApi, inviteDraft(), isPocEmail() (+2 more)

### Community 73 - ".add"
Cohesion: 0.08
Nodes (21): AuthUser, CurrentUser, AttachmentsController, Controller, Delete, Get, Delete, Delete (+13 more)

### Community 74 - "DatabaseService"
Cohesion: 0.13
Nodes (12): columnsFrom(), ColumnSpec, DatabaseModule, Global, Module, RecordHistoryService, Injectable, COLUMN_SPEC (+4 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.22
Nodes (24): FREQUENCIES, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, FieldError() (+16 more)

### Community 76 - ".add"
Cohesion: 0.17
Nodes (8): App(), AuthProvider(), ACCESS_LEVELS, CodeTablesPage(), labelFor(), GRID_ROLES, ROLES, UsersRolesPage()

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.09
Nodes (20): logger, Issue, IssueListItem, Kpi, KpiActionPlan, KpiListItem, KpiReading, ACCESS_LEVELS (+12 more)

### Community 79 - "README.md"
Cohesion: 0.15
Nodes (12): KpisController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+4 more)

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.36
Nodes (6): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset()

### Community 82 - "🚀 Quick start"
Cohesion: 0.18
Nodes (17): Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab(), Props (+9 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 84 - "transform"
Cohesion: 0.09
Nodes (30): AppLayout(), NAV_ITEMS, FromTemplateDialog(), NotificationBell(), timeAgo(), projectsApi, AppNotification, notificationsApi (+22 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.19
Nodes (5): AccessAdminController, Controller, Get, AccessAdminService, Injectable

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.12
Nodes (18): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+10 more)

### Community 89 - "status-reports.repository.ts"
Cohesion: 0.19
Nodes (8): PortfolioReportsController, Controller, Get, Query, ReportsModule, Module, ReportsService, Injectable

### Community 90 - "PeopleController"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 91 - "DatabaseModule"
Cohesion: 0.09
Nodes (25): CommandPalette(), Entry, hitPath(), KIND_META, Props, accessApi, AdminLookupRow, adminLookupsApi (+17 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.19
Nodes (8): ApiBody, Body, Controller, CurrentUser, Get, Post, Query, UsersController

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.25
Nodes (5): 🏗 Architecture, 📚 More docs, 🧪 Quality, 🗺 Roadmap, ✨ What's inside

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+23 more)

### Community 110 - "ProjectsController"
Cohesion: 0.10
Nodes (20): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+12 more)

### Community 111 - "RisksService"
Cohesion: 0.09
Nodes (17): riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString (+9 more)

### Community 112 - "app.module.ts"
Cohesion: 0.23
Nodes (8): AppModule, Module, AccessModule, Module, bootstrap(), AccessAdminModule, Module, Global

### Community 113 - "submissions.module.ts"
Cohesion: 0.20
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 114 - "ApiProperty"
Cohesion: 0.20
Nodes (9): TemplatesController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+1 more)

### Community 115 - "StatusReportDetailPage.tsx"
Cohesion: 0.23
Nodes (10): dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, statusReportsApi, ACCESS_LABELS, authorName() (+2 more)

### Community 118 - "ActionItemsPage.tsx"
Cohesion: 0.12
Nodes (20): AddIssueDialog(), emptyPerson(), AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES, today() (+12 more)

### Community 119 - "app.controller.ts"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 120 - "AttachmentDetailPage.tsx"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 121 - "action-items.repository.ts"
Cohesion: 0.27
Nodes (4): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 122 - "CreateTemplateDto"
Cohesion: 0.46
Nodes (7): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today()

### Community 123 - "SupabaseAuthGuard"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.07
Nodes (17): ProgramOutcomesModule, Module, ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable, dayOffset(), materializeOffset() (+9 more)

### Community 125 - "PaginationQueryDto"
Cohesion: 0.48
Nodes (5): AttachmentDetailPage(), formatSize(), longDate(), relativeTime(), uploaderName()

### Community 126 - "AdjustWeightsDto"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 127 - "attachments.repository.ts"
Cohesion: 0.31
Nodes (8): Attachment, AttachmentDetail, AttachmentListItem, AttachmentParent, AttachmentParentType, PARENT_TABLES, PARENT_TYPES, parseParent()

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "ImportRowsDto"
Cohesion: 0.33
Nodes (5): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray

### Community 132 - "workflow.ts"
Cohesion: 0.10
Nodes (24): Props, SectionCard(), Skeleton(), Chip(), personName(), Props, STATUS_CHIP, WorkflowPanel() (+16 more)

### Community 133 - ".update"
Cohesion: 0.17
Nodes (11): ProjectsController, ApiBody, Body, Controller, CurrentUser, Delete, Get, Param (+3 more)

## Knowledge Gaps
- **494 isolated node(s):** `MEMBERSHIP_LEVEL`, `ACTION_BODY`, `1.1 Project → `projects` (EXTEND)`, `1.2 Milestone → `milestones` (mostly HAVE — big head start)`, `1.3 Task / Work Activity → `action_items` (EXTEND)` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ms()` connect `Community 16` to `RecordHistoryService`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `Community 13` to `Community 1`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 16`, `CreateProjectDto`, `Community 26`, `Community 34`, `CreateProjectDto`, `Community 44`, `Community 45`, `@nestjs/swagger`, `PeopleRepository`, `auth-context.tsx`, `PaginationQueryDto`, `.add`, `WorkflowPanel.tsx`, `DatabaseService`, `WorkflowPanel.tsx`, `AddMilestoneDialog.tsx`, `status-reports.repository.ts`, `eslint-plugin-react-hooks`, `RisksService`, `action-items.repository.ts`, `ProgramOutcomesService`, `attachments.repository.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `.add` to `Community 1`, `react-dom`, `Community 5`, `Community 8`, `Community 9`, `Community 10`, `eslint-plugin-react-hooks`, `Community 44`, `Community 16`, `CreateProjectDto`, `AddMilestoneDialog.tsx`, `action-items.repository.ts`, `AppModule`, `status-reports.repository.ts`, `@nestjs/swagger`, `PeopleRepository`, `CreateMilestoneDto`, `AddMilestoneDialog.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `MEMBERSHIP_LEVEL`, `ACTION_BODY`, `1.1 Project → `projects` (EXTEND)` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._