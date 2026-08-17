# Graph Report - ptrack  (2026-08-17)

## Corpus Check
- 330 files · ~147,049 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2474 nodes · 5707 edges · 135 communities (115 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81e479e6`
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
- app.controller.ts
- supabase.ts
- eslint
- eslint-plugin-prettier
- ts-jest
- ProgramOutcomesService
- PaginationQueryDto
- ts-loader
- ts-node
- toaster.tsx
- @types/supertest
- Injectable
- workflow.ts
- .update
- @eslint/js
- Global

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 152 edges
2. `AuthUser` - 95 edges
3. `CurrentUser` - 92 edges
4. `DatabaseService` - 67 edges
5. `@nestjs/swagger` - 59 edges
6. `usePageTitle()` - 45 edges
7. `Button()` - 43 edges
8. `cn()` - 36 edges
9. `toast` - 35 edges
10. `Input()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `ProjectGantt()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/ProjectGantt.tsx → backend/scripts/seed-generic-lookups.mjs
- `KpisPage()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/pages/KpisPage.tsx → backend/scripts/seed-generic-lookups.mjs
- `RecordHistory()` --indirect_call--> `rows()`  [INFERRED]
  frontend/src/components/RecordHistory.tsx → backend/scripts/seed-generic-lookups.mjs
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  backend/src/main.ts → backend/src/app.module.ts
- `AccessAdminController` --references--> `RequireCapability()`  [EXTRACTED]
  backend/src/modules/access-admin/access-admin.controller.ts → backend/src/common/access/access.decorators.ts

## Import Cycles
- None detected.

## Communities (135 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (19): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiBody, Body (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): actionItems, AI_TITLES, byName(), daysFromNow(), db, did(), dISO(), env (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): 2. Functionality inventory (FDD FR-01…15 → status), 3. Use cases UC-01…18 — acceptance checklist, 4. Key validations / business rules (FDD 3.3.2), 5. Reports & notifications (defer until math lands), 6. Open questions for the supervisor (blockers marked ⛔), 7. Execution roadmap, 8. Security phase — access model (ASSUMED 2026-08-17; ENFORCED same day, Fares approved "as I see fit"), 9. Conventions carried forward (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): devDependencies, eslint-config-prettier, @eslint/eslintrc, @eslint/js, globals, jest, @nestjs/cli, @nestjs/schematics (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (8): logger, toHttpException(), ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (8): CyclesController, ReportsController, Controller, Get, SubmissionsRepository, Injectable, SubmissionsService, Injectable

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (23): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (12): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (18): ActionItemsBreakdown(), ActivityLineChart(), BudgetBar(), CategoryDonut(), ChartPoint, ChartSegment, CompletionRadial(), FlowLineChart() (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (11): LookupsController, Body, Controller, Get, Param, Patch, Post, LookupsModule (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (36): Props, SectionCard(), Chip(), personName(), Props, STATUS_CHIP, WorkflowPanel(), ACTIONS (+28 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (22): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, plannedProgress(), DashboardController, Controller, DashboardModule, Module (+14 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.16
Nodes (7): UpdateIssueDto, IssuesModule, Module, IssuesRepository, Injectable, IssuesService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (42): CategorySelect(), Props, Props, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+34 more)

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
Cohesion: 0.07
Nodes (27): dependencies, class-transformer, class-validator, jose, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+19 more)

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (5): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (20): NotificationsController, Controller, AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable, classifyDue() (+12 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (34): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), dateParts() (+26 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.16
Nodes (8): ApiTags, ProjectScoped(), ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.10
Nodes (31): AppLayout(), NAV_ITEMS, FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow (+23 more)

### Community 34 - "Community 34"
Cohesion: 0.23
Nodes (11): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, ACTION_BODY, SubmissionsController, ApiBody (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.15
Nodes (14): AttachmentsModule, Module, Attachment, AttachmentDetail, AttachmentListItem, AttachmentParentType, PARENT_TABLES, UploadedFileLike (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.10
Nodes (27): AdminOnly(), MinAppRole(), APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS (+19 more)

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
Nodes (12): MilestoneProgressRow, Project, ProjectDetail, ProjectListRow, ProjectListStats, ProjectsRepository, Injectable, COLUMN_SPEC (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (18): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.10
Nodes (8): AttachmentParent, AttachmentsRepository, Injectable, AttachmentsService, PARENT_TYPES, parseParent(), safeName(), Injectable

### Community 46 - "nest-cli.json"
Cohesion: 0.20
Nodes (14): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+6 more)

### Community 47 - "Community 47"
Cohesion: 0.09
Nodes (26): ActionItemsModule, Module, ImportModule, Module, LinksModule, Module, MilestonesModule, Module (+18 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.22
Nodes (19): Props, Props, Props, apiUpload(), Attachment, AttachmentDetail, apiDelete(), apiGet() (+11 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.22
Nodes (10): AddKpiDialog(), emptyPerson(), Props, Kpi, kpisApi, formatValue(), KpiDetail(), KpisPage() (+2 more)

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (12): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+4 more)

### Community 54 - "ProjectsController"
Cohesion: 0.07
Nodes (24): AuthedRequest, DatabaseService, Injectable, Issue, IssueListItem, Milestone, MilestoneListItem, ProgramOutcome (+16 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.23
Nodes (8): RisksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 56 - "@types/node"
Cohesion: 0.27
Nodes (8): ActionItemsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 59 - "@types/node"
Cohesion: 0.09
Nodes (21): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, ApiPropertyOptional (+13 more)

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (31): ProjectAccess(), CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString (+23 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.10
Nodes (20): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+12 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.15
Nodes (13): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.13
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 65 - ".add"
Cohesion: 0.21
Nodes (11): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+3 more)

### Community 66 - "react-dom"
Cohesion: 0.17
Nodes (10): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+2 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.14
Nodes (14): db, ensure(), env, PROGRAMS, root, rows(), STANDARD, initials() (+6 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+3 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.18
Nodes (7): RegistryController, Controller, Get, RegistryModule, Module, RegistryService, Injectable

### Community 70 - "2. Core functional modules"
Cohesion: 0.10
Nodes (19): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+11 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.22
Nodes (8): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Assumptions that need your confirmation, 5. Decisions only you can make, 6. Blocked on infrastructure, 7. Out of scope, on purpose, P-Track progress summary

### Community 72 - "@nestjs/config"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 73 - ".add"
Cohesion: 0.08
Nodes (18): AuthUser, CurrentUser, Delete, Delete, Get, Delete, Delete, Get (+10 more)

### Community 74 - "DatabaseService"
Cohesion: 0.19
Nodes (5): DatabaseModule, Global, Module, RecordHistoryService, Injectable

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.16
Nodes (29): FREQUENCIES, ACCESS_LEVELS, Props, AddStatusReportDialog(), EDITABLE_OPTIONS, today(), VIEWABLE_OPTIONS, ConfirmDeleteButton() (+21 more)

### Community 76 - ".add"
Cohesion: 0.12
Nodes (19): App(), AddIssueDialog(), emptyPerson(), AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES (+11 more)

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.12
Nodes (19): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+11 more)

### Community 79 - "README.md"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 80 - "ApiProperty"
Cohesion: 0.25
Nodes (7): Explicitly not implemented (await real sign-off), F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13), FORMULAS.md — P-Track calculation registry

### Community 81 - "lookups.service.ts"
Cohesion: 0.36
Nodes (6): formatDate(), initials(), PersonLike, personName(), relativeTime(), atOffset()

### Community 82 - "🚀 Quick start"
Cohesion: 0.15
Nodes (19): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+11 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.08
Nodes (23): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReportsController (+15 more)

### Community 84 - "transform"
Cohesion: 0.24
Nodes (8): projectsApi, FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck, validDate(), validNumber()

### Community 85 - "@nestjs/swagger"
Cohesion: 0.10
Nodes (17): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, AccessAdminModule (+9 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "AppModule"
Cohesion: 0.11
Nodes (22): columnsFrom(), ColumnSpec, AdjustWeightsDto, IsArray, Type, ValidateNested, UpdateMilestoneDto, COLUMN_SPEC (+14 more)

### Community 90 - "PeopleController"
Cohesion: 0.23
Nodes (8): ResourcesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 91 - "DatabaseModule"
Cohesion: 0.08
Nodes (26): CommandPalette(), Entry, hitPath(), KIND_META, Props, accessApi, AdminLookupRow, adminLookupsApi (+18 more)

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.32
Nodes (8): calculatedProgress(), MilestoneProgressRow, plannedProgress(), riskScore(), riskSeverityTone(), ms(), MILESTONE_LABELS, ProjectProgressReportPage()

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
Nodes (7): ApiProperty, ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "LookupsService"
Cohesion: 0.20
Nodes (10): Props, Props, ProjectSections, issuesApi, Link, linksApi, Resource, resourcesApi (+2 more)

### Community 104 - "🚀 Quick start"
Cohesion: 0.40
Nodes (5): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🚀 Quick start

### Community 105 - "CreateRiskDto"
Cohesion: 0.31
Nodes (9): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), Props, inviteDraft(), isPocEmail(), pocEmail() (+1 more)

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.08
Nodes (24): CreateUpdateDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, IsUUID (+16 more)

### Community 110 - "ProjectsController"
Cohesion: 0.17
Nodes (9): AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, AppRole, lookupCache, Me, peopleApi, rolesApi (+1 more)

### Community 111 - "RisksService"
Cohesion: 0.08
Nodes (21): AccessLevel, ProjectAccessRow, ProjectAccessService, Injectable, riskScore(), CreateRiskDto, ApiProperty, ApiPropertyOptional (+13 more)

### Community 112 - "app.module.ts"
Cohesion: 0.18
Nodes (9): AppModule, Module, AccessModule, Module, LEVEL_LABEL, ProjectAccessGuard, bootstrap(), Global (+1 more)

### Community 113 - "submissions.module.ts"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 114 - ".constructor"
Cohesion: 0.47
Nodes (4): colorOf(), InitialsAvatar(), initialsOf(), PALETTE

### Community 115 - "InitialsAvatar.tsx"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 119 - "app.controller.ts"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 120 - "supabase.ts"
Cohesion: 0.50
Nodes (3): supabase, supabaseKey, supabaseUrl

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.10
Nodes (12): ProgramOutcomesController, ApiBody, Body, Controller, Get, Param, Patch, Post (+4 more)

### Community 125 - "PaginationQueryDto"
Cohesion: 0.08
Nodes (41): Props, TagChips(), Skeleton(), GlobalMilestone, registryApi, milestonesApi, statusReportsApi, reportsApi (+33 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 132 - "workflow.ts"
Cohesion: 0.14
Nodes (14): NotificationBell(), timeAgo(), AppNotification, Cycle, cyclesApi, CycleStatusReport, CycleStatusRow, dashboardApi (+6 more)

### Community 133 - ".update"
Cohesion: 0.16
Nodes (9): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

## Knowledge Gaps
- **499 isolated node(s):** `LEVEL_LABEL`, `Props`, `Props`, `STATUS_CHIP`, `ProjectDashboardTab` (+494 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ms()` connect `AuthUser` to `Community 16`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `toHttpException()` connect `Community 5` to `Community 1`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 12`, `Community 16`, `CreateProjectDto`, `Community 26`, `Community 27`, `ProjectsRepository`, `status-reports.repository.ts`, `CreateProjectDto`, `Community 44`, `Community 45`, `Community 50`, `ProjectsController`, `@nestjs/swagger`, `PeopleRepository`, `CreateMilestoneDto`, `PaginationQueryDto`, `react-dom`, `WorkflowPanel.tsx`, `2. Core functional modules`, `.add`, `AddMilestoneDialog.tsx`, `@nestjs/swagger`, `eslint-plugin-react-hooks`, `RisksService`, `submissions.module.ts`, `InitialsAvatar.tsx`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `.add` to `Community 1`, `.update`, `Community 7`, `Community 9`, `Community 10`, `Community 13`, `Community 16`, `CreateProjectDto`, `Community 27`, `Community 34`, `ProjectsRepository`, `status-reports.repository.ts`, `Community 44`, `nest-cli.json`, `Community 50`, `action-items.repository.ts`, `@types/node`, `@nestjs/swagger`, `@types/node`, `PeopleRepository`, `CreateMilestoneDto`, `WorkflowPanel.tsx`, `@nestjs/config`, `WorkflowPanel.tsx`, `README.md`, `AddMilestoneDialog.tsx`, `@nestjs/swagger`, `AppModule`, `PeopleController`, `eslint-plugin-react-hooks`, `RisksService`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `LEVEL_LABEL`, `Props`, `Props` to the rest of the system?**
  _499 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0944741532976827 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._