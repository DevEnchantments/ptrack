# Graph Report - ptrack  (2026-08-18)

## Corpus Check
- 337 files · ~153,755 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2540 nodes · 5943 edges · 144 communities (116 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd8f75d1`
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
- users.service.ts
- @nestjs/swagger
- AttachmentDetailPage.tsx
- @supabase/supabase-js
- templates.service.ts
- ActionItemsController
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
- eslint-plugin-prettier
- 🚀 Quick start
- CreateRiskDto
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- eslint-plugin-prettier
- ProjectsController
- ts-jest
- app.module.ts
- ts-loader
- ts-node
- DatabaseModule
- vitest
- @types/supertest
- project-sections.service.ts
- UpdateMeDto
- project-sections.service.ts
- SectionNav.tsx
- DatabaseModule
- ProgramOutcomesService
- jose
- @nestjs/common
- @nestjs/platform-express
- toaster.tsx
- ApiProperty
- Injectable
- ApiPropertyOptional
- IsBoolean
- .update
- @eslint/js
- IsIn
- IsInt
- IsNumber
- IsOptional
- IsString
- IsUUID
- Max
- MaxLength
- Min

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 145 edges
2. `AuthUser` - 100 edges
3. `CurrentUser` - 96 edges
4. `DatabaseService` - 65 edges
5. `@nestjs/swagger` - 60 edges
6. `Button()` - 49 edges
7. `usePageTitle()` - 49 edges
8. `toast` - 37 edges
9. `cn()` - 36 edges
10. `Input()` - 32 edges

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

## Communities (144 total, 28 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (42): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+34 more)

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
Cohesion: 0.14
Nodes (6): ActionItemsRepository, Injectable, ActionItemsService, normalizeOwnerIds(), ownersLabel(), Injectable

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (4): KpisRepository, Injectable, KpisService, Injectable

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (4): SubmissionsRepository, Injectable, SubmissionsService, Injectable

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (9): RegistryController, Controller, DirectoryMembership, DirectoryPerson, GlobalActionItem, GlobalMilestone, MemberRow, RegistryService (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (15): COLUMN_SPEC, CREATE_DEFAULTS, Owners, CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (20): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (6): CreateAccountDialog(), Props, inviteDraft(), isPocEmail(), pocEmail(), tempPassword()

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (29): ACTIONS, attachmentUploader(), collapsePrefsKey(), EXT_STYLES, fileExt(), formatReportDate(), formatSize(), initials() (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (16): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), ChartPoint, CLOSED_PROJECT, DashboardData (+8 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.07
Nodes (26): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (12): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+4 more)

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
Cohesion: 0.12
Nodes (7): RecordHistoryService, Injectable, ProgramOutcome, ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 28 - "Community 28"
Cohesion: 0.07
Nodes (35): AddStatusReportDialog(), today(), dateParts(), MiniCalendar(), MONTHS, Props, WEEKDAY_HEADERS, GlobalMilestone (+27 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform, transformIgnorePatterns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.09
Nodes (28): MyWork, dashboardApi, DashboardData, formatDate(), initials(), PersonLike, personName(), relativeTime() (+20 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.10
Nodes (36): ExportCsvDialog(), FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill() (+28 more)

### Community 34 - "Community 34"
Cohesion: 0.07
Nodes (26): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+18 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.06
Nodes (31): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, CreateUpdateDto (+23 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.22
Nodes (11): Props, Props, Props, fmtAed(), ProjectOverviewCards(), Props, Project, ProjectDetail (+3 more)

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
Nodes (8): logger, toHttpException(), ProjectDetail, ProjectsRepository, Injectable, ProjectsService, Injectable, utilizationRatio()

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.07
Nodes (22): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.05
Nodes (32): ApiConsumes, AttachmentsController, ApiBody, Body, Controller, Get, Param, Patch (+24 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.18
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (18): ActionItemsModule, Module, AttachmentsModule, Module, IssuesModule, Module, LinksModule, Module (+10 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.06
Nodes (45): App(), ProtectedRoute(), Props, Skeleton(), Chip(), personName(), STATUS_CHIP, WorkflowPanel() (+37 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.12
Nodes (15): AccessModule, Global, Module, AccessAdminModule, Module, DashboardModule, Module, LookupsModule (+7 more)

### Community 50 - "Community 50"
Cohesion: 0.12
Nodes (13): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+5 more)

### Community 54 - "ProjectsController"
Cohesion: 0.10
Nodes (8): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable, Cycle, Submission, SubmissionListItem

### Community 55 - "action-items.repository.ts"
Cohesion: 0.29
Nodes (5): ApiTags, ProjectSectionsController, Controller, Get, Param

### Community 56 - "@types/node"
Cohesion: 0.09
Nodes (17): AccessAdminController, ApiBody, Body, Controller, Get, Param, Patch, AccessAdminService (+9 more)

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.21
Nodes (19): Props, Props, Props, apiUpload(), Attachment, AttachmentDetail, apiDelete(), apiGet() (+11 more)

### Community 59 - "@types/node"
Cohesion: 0.23
Nodes (7): ApiSecurity, AppController, Controller, Get, AppService, Injectable, Public()

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (22): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.12
Nodes (18): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+10 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.06
Nodes (37): AuthUser, CurrentUser, Delete, DashboardController, Controller, Get, Delete, NotificationsController (+29 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.10
Nodes (9): AdjustWeightsDto, ApiProperty, IsArray, Type, ValidateNested, MilestonesRepository, Injectable, MilestonesService (+1 more)

### Community 65 - ".add"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 66 - "react-dom"
Cohesion: 0.40
Nodes (4): ProgramOutcomesModule, Module, TemplatesModule, Module

### Community 67 - "CreateLinkDto"
Cohesion: 0.15
Nodes (13): ApiProperty, ApiPropertyOptional, CreateKpiDto, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+5 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.22
Nodes (10): ImportModule, Module, MilestonesModule, Module, NotificationsModule, Module, ProjectsModule, Module (+2 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.16
Nodes (5): riskScore(), RisksRepository, Injectable, RisksService, Injectable

### Community 70 - "2. Core functional modules"
Cohesion: 0.10
Nodes (44): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES, today(), ACCESS_LEVELS, AddPersonDialog() (+36 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.22
Nodes (8): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Assumptions that need your confirmation, 5. Decisions only you can make, 6. Blocked on infrastructure, 7. Out of scope, on purpose, P-Track progress summary

### Community 72 - "@nestjs/config"
Cohesion: 0.14
Nodes (18): calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput, MilestoneProgressRow, PERIODS_PER_YEAR, plannedProgress() (+10 more)

### Community 74 - "DatabaseService"
Cohesion: 0.23
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.15
Nodes (22): AddIssueDialog(), emptyPerson(), EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, Props, FieldError() (+14 more)

### Community 76 - ".add"
Cohesion: 0.31
Nodes (7): HistoryEntry, HistoryInsert, ActionItem, ActionItemComment, ActionItemListItem, Milestone, MilestoneListItem

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.20
Nodes (9): Props, Cycle, CycleStatusReport, CycleStatusRow, DashboardChartPoint, InitiativeProgressRow, MonthlyPerformanceMonth, Submission (+1 more)

### Community 79 - "README.md"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 80 - "ApiProperty"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "lookups.service.ts"
Cohesion: 0.06
Nodes (42): AppLayout(), NAV_ITEMS, CommandPalette(), Entry, hitPath(), KIND_META, Props, NotificationBell() (+34 more)

### Community 82 - "🚀 Quick start"
Cohesion: 0.14
Nodes (20): Props, Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab() (+12 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.24
Nodes (8): parseCsv(), FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck, validDate(), validNumber()

### Community 84 - "users.service.ts"
Cohesion: 0.08
Nodes (18): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiBody, Body (+10 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.12
Nodes (28): AdminOnly(), MinAppRole(), AccessLevel, APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability (+20 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "templates.service.ts"
Cohesion: 0.33
Nodes (6): ApiPropertyOptional, IsNumber, IsOptional, IsUUID, Min, WeightEntryDto

### Community 89 - "ActionItemsController"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 90 - "PeopleController"
Cohesion: 0.18
Nodes (11): Props, Props, Props, ProjectSections, issuesApi, Link, linksApi, Resource (+3 more)

### Community 91 - "DatabaseModule"
Cohesion: 0.50
Nodes (4): AddKpiDialog(), emptyPerson(), FREQUENCIES, Props

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.15
Nodes (10): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🏗 Architecture, 📚 More docs, 🧪 Quality, 🚀 Quick start (+2 more)

### Community 98 - "CreateLookupValueDto"
Cohesion: 0.14
Nodes (11): AccessLevel, AccessLevelValue, MEMBERSHIP_LEVEL, AppRole, lookupCache, Me, MyMembership, MyWorkItem (+3 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "eslint-plugin-prettier"
Cohesion: 0.11
Nodes (22): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today(), colorOf() (+14 more)

### Community 104 - "🚀 Quick start"
Cohesion: 0.29
Nodes (10): CreateKpiActionPlanDto, CreateKpiReadingDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsNumber, IsOptional (+2 more)

### Community 105 - "CreateRiskDto"
Cohesion: 0.10
Nodes (15): CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength, UpdateStatusReportDto, StatusReport (+7 more)

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.36
Nodes (4): UpdateKpiActionPlanDto, UpdateKpiDto, KpisModule, Module

### Community 110 - "ProjectsController"
Cohesion: 0.10
Nodes (21): columnsFrom(), ColumnSpec, CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString (+13 more)

### Community 111 - "ts-jest"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 112 - "app.module.ts"
Cohesion: 0.23
Nodes (8): RisksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 113 - "ts-loader"
Cohesion: 0.22
Nodes (8): ACCESS_LEVELS, AdminLookupRow, AdminLookupTable, ALLOWED, CacheSlot, EXTRA_COLUMNS, LookupRow, SELECTS

### Community 114 - "ts-node"
Cohesion: 0.33
Nodes (7): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), HistoryEntry

### Community 115 - "DatabaseModule"
Cohesion: 0.50
Nodes (3): AppModule, Module, bootstrap()

### Community 118 - "@types/supertest"
Cohesion: 0.50
Nodes (4): Kpi, KpiActionPlan, KpiListItem, KpiReading

### Community 119 - "project-sections.service.ts"
Cohesion: 0.18
Nodes (9): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload, TemplatesService (+1 more)

### Community 120 - "UpdateMeDto"
Cohesion: 0.40
Nodes (4): ApiProperty, IsString, MaxLength, UpdateMeDto

### Community 121 - "project-sections.service.ts"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 123 - "DatabaseModule"
Cohesion: 0.67
Nodes (3): DatabaseModule, Global, Module

### Community 124 - "ProgramOutcomesService"
Cohesion: 0.10
Nodes (18): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+10 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 130 - "Injectable"
Cohesion: 0.18
Nodes (6): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable, DashboardService, Injectable

### Community 133 - ".update"
Cohesion: 0.11
Nodes (19): ProjectAccess(), PeopleController, ApiBody, Body, Controller, Delete, Param, Patch (+11 more)

## Knowledge Gaps
- **512 isolated node(s):** `KpiReading`, `KpiActionPlan`, `FREQUENCIES`, `Props`, `KpiActionPlan` (+507 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fetchMe()` connect `lookups.service.ts` to `@nestjs/swagger`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `auth-context.tsx` to `Community 1`, `.update`, `Community 8`, `Community 10`, `CreateProjectDto`, `Community 34`, `ProjectsRepository`, `Community 44`, `Community 45`, `Community 50`, `@types/node`, `CreateMilestoneDto`, `.add`, `DatabaseService`, `README.md`, `users.service.ts`, `@nestjs/swagger`, `ActionItemsController`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `app.module.ts`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `auth-context.tsx` to `Community 1`, `.update`, `Community 8`, `Community 10`, `CreateProjectDto`, `Community 34`, `ProjectsRepository`, `Community 44`, `Community 45`, `Community 50`, `@types/node`, `CreateMilestoneDto`, `.add`, `DatabaseService`, `README.md`, `users.service.ts`, `@nestjs/swagger`, `ActionItemsController`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `app.module.ts`, `ProgramOutcomesService`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **What connects `KpiReading`, `KpiActionPlan`, `FREQUENCIES` to the rest of the system?**
  _512 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.061952861952861954 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._