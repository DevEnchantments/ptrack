# Graph Report - ptrack  (2026-08-19)

## Corpus Check
- 361 files · ~167,126 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2625 nodes · 6268 edges · 139 communities (119 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41ae5c7f`
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
- CreateKpiDto
- 🚀 Quick start
- CreateRiskDto
- AddMilestoneDialog.tsx
- eslint-plugin-react-hooks
- frappe-gantt
- eslint-plugin-prettier
- ProjectsController
- @nestjs/swagger
- app.module.ts
- ts-loader
- CreateLookupValueDto
- CreateMilestoneDto
- vitest
- seed-generic-lookups.mjs
- project-sections.service.ts
- eslint
- attachments.controller.ts
- project-sections.service.ts
- .create
- UpdateMeDto
- milestones.repository.ts
- AccessModule
- CreateAccountDialog.tsx
- toaster.tsx
- DatabaseModule
- Injectable
- columnsFrom
- AccessModule
- .update
- @eslint/js
- eslint-plugin-prettier
- UpdateMeDto
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `toHttpException()` - 135 edges
2. `AuthUser` - 100 edges
3. `CurrentUser` - 96 edges
4. `DatabaseService` - 63 edges
5. `@nestjs/swagger` - 60 edges
6. `Button()` - 51 edges
7. `usePageTitle()` - 51 edges
8. `toast` - 39 edges
9. `cn()` - 36 edges
10. `Input()` - 33 edges

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

## Communities (139 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): 10. PL/SQL package layer, 11. Notable architectural patterns, 12. Summary, 1. Application overview, 3. Dashboards & reporting, 4. Notifications & email automation, 5. Security & access control, 6. Extensibility framework ("Flex Columns") (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (13): Invalid, LookupOption, MILESTONE_STATUS, parseBoolValue(), parseDateValue(), parseMilestoneStatus(), parseNumberValue(), resolveLookup() (+5 more)

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
Cohesion: 0.14
Nodes (7): riskScore(), Risk, RiskListItem, RisksRepository, Injectable, RisksService, Injectable

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (34): PaginationQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type, describeProjectScopedContract() (+26 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (45): actionItems, AI_ROWS, byName(), curCycle, cycleName(), daysFromNow(), db, dep() (+37 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (9): CreateLinkDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsOptional, IsString, MaxLength (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (10): RequireCapability(), KpisController, ApiBody, Body, Controller, Delete, Get, Param (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (22): CreateResourceDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, MaxLength, UpdateResourceDto (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (10): AppRole, categoriesApi, lookupCache, MyMembership, MyWork, MyWorkItem, peopleApi, rolesApi (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (30): CreateLookupValueDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsOptional, IsString (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (9): ActionItemsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (52): AddAttachmentDialog(), AddLinkDialog(), Props, AddResourceDialog(), AddUpdateDialog(), AdjustWeightsDialog(), OutcomeDialog(), SaveTemplateDialog() (+44 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (18): calculatedProgress(), INITIATIVE_BUCKETS, initiativeBucket, MilestoneProgressRow, plannedProgress(), DashboardController, Controller, DashboardModule (+10 more)

### Community 17 - "CreateProjectDto"
Cohesion: 0.16
Nodes (7): UpdateIssueDto, Issue, IssueListItem, IssuesRepository, Injectable, IssuesService, Injectable

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (16): SubmissionActionDto, ApiPropertyOptional, IsOptional, IsString, MaxLength, CyclesController, ReportsController, SubmissionsController (+8 more)

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
Cohesion: 0.12
Nodes (4): MilestonesRepository, Injectable, MilestonesService, Injectable

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (9): UpdateLinkDto, Link, LinkListItem, LinksRepository, Injectable, COLUMN_SPEC, CREATE_DEFAULTS, LinksService (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (32): AddStatusReportDialog(), today(), AvatarCluster(), colorOf(), InitialsAvatar(), initialsOf(), PALETTE, dateParts() (+24 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): scripts, build, dev, format, lint, seed:demo, seed:demo:wipe, start (+8 more)

### Community 31 - "AddMilestoneDialog.tsx"
Cohesion: 0.09
Nodes (29): Props, TasksCard(), dueIn(), formatDate(), initials(), PersonLike, personName(), relativeTime() (+21 more)

### Community 32 - "CreateActionItemDto"
Cohesion: 0.20
Nodes (9): 1. Contrast report (measured 2026-07-29), 3. Staged plan (one stage = one commit; tick when shipped), 4. House recipes (decide once in Stage 1, reuse forever), 5. Cross-session evidence pointers, 6. RESOLVED 2026-07-29 (Fares ruled on all seven; demo constraint lifted), Item 1 detail: the two categories must not be collapsed, Items 5-6 scope note, Token changes — SHIPPED in Stage 1 (2026-07-29), re-measured after landing (+1 more)

### Community 33 - "nest-cli.json"
Cohesion: 0.21
Nodes (13): classifyDue(), inSubmissionWindow(), ReminderKind, reminderType(), resolveRecipients(), submissionPendingType(), DueActionItem, DueMilestone (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (19): CreateProjectDto, ProjectMemberDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn (+11 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 36 - "ProjectsRepository"
Cohesion: 0.05
Nodes (30): ApiConsumes, ApiBody, Body, Get, Param, Patch, Post, Query (+22 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 38 - "status-reports.repository.ts"
Cohesion: 0.18
Nodes (5): AccessAdminController, Controller, Get, AccessAdminService, Injectable

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
Cohesion: 0.26
Nodes (9): Project, ProjectDetail, ProjectListRow, ProjectListStats, COLUMN_SPEC, projectColumns(), ProjectsService, Injectable (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.07
Nodes (22): CreateSavedSearchDto, ApiProperty, IsString, MaxLength, MinLength, SearchController, ApiBody, Body (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (17): fmtAed(), ProjectOverviewCards(), atRiskSuggested(), calculatedProgress(), kpiAchievement(), kpiDataQuality(), KpiReadingLike, KpiScoreInput (+9 more)

### Community 46 - "nest-cli.json"
Cohesion: 0.12
Nodes (5): AppNotification, NotificationsRepository, Injectable, NotificationsService, Injectable

### Community 47 - "Community 47"
Cohesion: 0.05
Nodes (51): ApiSecurity, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+43 more)

### Community 48 - "status-reports.repository.ts"
Cohesion: 0.09
Nodes (29): App(), InitiativeProgressRow, MonthlyPerformanceMonth, reportsApi, AuthProvider(), usePageTitle(), CodeTablesPage(), labelFor() (+21 more)

### Community 49 - "RecordHistoryService"
Cohesion: 0.18
Nodes (11): AdjustWeightsDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber, IsOptional, IsUUID, Min (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.21
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogDescription() (+7 more)

### Community 54 - "ProjectsController"
Cohesion: 0.08
Nodes (29): AddKpiDialog(), emptyPerson(), Props, CommandPalette(), Entry, hitPath(), KIND_META, Props (+21 more)

### Community 55 - "action-items.repository.ts"
Cohesion: 0.11
Nodes (18): 1. Baseline, measured 2026-08-18 on this branch, 2026-08-19 — B1, public surface per module, 2026-08-19 — B2 + B3, the rule and the last reach-in, 2026-08-19 — B4, contract conformance. **Phase B complete.**, 2026-08-19 — Gate review, then one APPROVED BEHAVIOUR CHANGE, 2. Ground rules, 3. Per-session protocol, 4. Decisions already taken (+10 more)

### Community 56 - "@types/node"
Cohesion: 0.23
Nodes (8): LinksController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 57 - ".update"
Cohesion: 0.20
Nodes (10): CLAUDE.md — P-Track, Current state — Phase 1 complete (full CRUD), graphify, Hard architectural rules (do not violate), How I like to work — follow precisely, Known gotchas — carry these forward, Repo & environment, Roadmap — deferred to Phase 2+ (+2 more)

### Community 58 - "@nestjs/swagger"
Cohesion: 0.20
Nodes (4): ActionItemsRepository, Injectable, normalizeOwnerIds(), ownersLabel()

### Community 59 - "@types/node"
Cohesion: 0.19
Nodes (8): StatusReportsController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 60 - "ActionItemDetailPage.tsx"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 61 - "PeopleRepository"
Cohesion: 0.07
Nodes (22): CreatePersonDto, ApiProperty, ApiPropertyOptional, IsEmail, IsIn, IsOptional, IsString, IsUUID (+14 more)

### Community 62 - "CreateMilestoneDto"
Cohesion: 0.14
Nodes (10): TemplatesController, ApiBody, Body, Controller, Delete, Get, Param, Post (+2 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.07
Nodes (26): AuthUser, CurrentUser, Delete, Get, Delete, Delete, NotificationsController, Controller (+18 more)

### Community 64 - "PaginationQueryDto"
Cohesion: 0.14
Nodes (6): logger, toHttpException(), RegistryService, Injectable, Injectable, UsersService

### Community 66 - "react-dom"
Cohesion: 0.29
Nodes (10): CreateTemplateDto, InstantiateTemplateDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID (+2 more)

### Community 67 - "CreateLinkDto"
Cohesion: 0.14
Nodes (14): ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional (+6 more)

### Community 68 - "RecordHistoryService"
Cohesion: 0.11
Nodes (22): initials(), Props, RecordHistory(), relativeTime(), TABLE_NOUNS, username(), Props, SectionCard() (+14 more)

### Community 69 - "WorkflowPanel.tsx"
Cohesion: 0.23
Nodes (9): MilestonesController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 70 - "2. Core functional modules"
Cohesion: 0.14
Nodes (31): Props, Props, Props, Props, Props, Props, Props, Props (+23 more)

### Community 71 - "moduleFileExtensions"
Cohesion: 0.25
Nodes (7): 1. Where the project stands, 2. What is built, by area, 3. The fifteen functional requirements, one by one, 4. Decisions taken under your delegation (18 August), 5. The two remaining items, 6. Out of scope, on purpose, P-Track progress summary

### Community 72 - "@nestjs/config"
Cohesion: 0.16
Nodes (15): Chip(), personName(), Props, STATUS_CHIP, WorkflowPanel(), Cycle, cyclesApi, CycleStatusReport (+7 more)

### Community 73 - ".add"
Cohesion: 0.23
Nodes (8): ProgramOutcomesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 74 - "DatabaseService"
Cohesion: 0.18
Nodes (12): CreateProgramOutcomeDto, ApiProperty, ApiPropertyOptional, IsDateString, IsInt, IsOptional, IsString, MaxLength (+4 more)

### Community 75 - "AddStatusReportDialog.tsx"
Cohesion: 0.22
Nodes (24): FREQUENCIES, ACCESS_LEVELS, EDITABLE_OPTIONS, VIEWABLE_OPTIONS, ConfirmDeleteButton(), Props, FY_YEARS, Props (+16 more)

### Community 76 - ".add"
Cohesion: 0.25
Nodes (5): DatabaseModule, Global, Module, RecordHistoryService, Injectable

### Community 78 - "WorkflowPanel.tsx"
Cohesion: 0.07
Nodes (32): AddIssueDialog(), emptyPerson(), AddRiskDialog(), emptyPerson(), AppLayout(), NAV_ITEMS, EditProjectDialog(), personFromProfile() (+24 more)

### Community 79 - "README.md"
Cohesion: 0.17
Nodes (10): CreateIssueDto, ApiProperty, ApiPropertyOptional, IsArray, IsDateString, IsIn, IsOptional, IsString (+2 more)

### Community 80 - "ApiProperty"
Cohesion: 0.20
Nodes (9): Budget threshold, F1 — Calculated progress (project), F2 — Planned progress (project), F3 — Risk score and severity, F4 — At-risk suggestion (display-only), F5 — Initiative delivery buckets (DECIDED 2026-08-18), F6 — KPI achievement % (DECIDED 2026-08-18), F7 — KPI data-quality index (DECIDED 2026-08-18) (+1 more)

### Community 81 - "lookups.service.ts"
Cohesion: 0.09
Nodes (35): AddMilestoneDialog(), emptyOwner(), ownerFromMilestone(), profileName(), STATUSES, today(), CategorySelect(), Props (+27 more)

### Community 82 - "🚀 Quick start"
Cohesion: 0.17
Nodes (17): Props, Props, Props, formatAed(), milestoneShares(), MONTHS, ProjectDashboardTab(), Props (+9 more)

### Community 83 - "AddMilestoneDialog.tsx"
Cohesion: 0.27
Nodes (4): ProjectAccessGuard, Injectable, ProjectAccessService, Injectable

### Community 84 - "users.service.ts"
Cohesion: 0.13
Nodes (14): ProvisionUserDto, ApiProperty, IsEmail, IsString, MaxLength, MinLength, ApiProperty, IsString (+6 more)

### Community 85 - "@nestjs/swagger"
Cohesion: 0.12
Nodes (25): APP_ROLES, AppRole, atLeastRole(), CAPABILITIES, Capability, CAPABILITY_KEYS, DEFAULT_GRANTS, defaultLevelFor() (+17 more)

### Community 87 - "@supabase/supabase-js"
Cohesion: 0.33
Nodes (3): frappe-gantt, FrappeTask, Gantt

### Community 88 - "templates.service.ts"
Cohesion: 0.16
Nodes (12): ApiBody, Body, Param, Patch, ReplaceGrantsDto, ApiProperty, IsArray, IsString (+4 more)

### Community 89 - "ActionItemsController"
Cohesion: 0.14
Nodes (5): ProgramOutcome, ProgramOutcomesRepository, Injectable, ProgramOutcomesService, Injectable

### Community 90 - "PeopleController"
Cohesion: 0.23
Nodes (8): IssuesController, ApiBody, Body, Controller, Get, Param, Patch, Post

### Community 92 - "PeoplePage.tsx"
Cohesion: 0.25
Nodes (7): 1. The headline finding: 9 modules return 500 where they should return 404, 2. Other bugs found, all still present on `main`, 3. Two things that look like bugs and are not, 4. What `main` might want to take, ranked by value per unit of risk, 5. Notes on working in this codebase, 6. Suggested order if any of this is acted on, Findings for `main` from the exploratory refactor branch

### Community 94 - "AuthUser"
Cohesion: 0.20
Nodes (10): importApi, ImportSummary, parseCsv(), FieldDef, ImportPage(), MILESTONE_FIELDS, PROJECT_FIELDS, RowCheck (+2 more)

### Community 95 - "1. Data-object mapping (FDD Appendix A → P-Track schema)"
Cohesion: 0.22
Nodes (9): 1.1 Project → `projects` (EXTEND), 1.2 Milestone → `milestones` (mostly HAVE — big head start), 1.3 Task / Work Activity → `action_items` (EXTEND), 1.4 Risk → BUILD `risks` (new module, follows our new-record-type recipe), 1.5 Issue → `issues` (EXTEND), 1.6 Workflow Submission → BUILD `cycles` + `submissions`, 1.7 Attachment → `attachments` (EXTEND for parent scoping — see 1.3), 1.8 Dashboard/KPI → BUILD `kpis` + `kpi_readings` + `kpi_action_plans` (LAST) (+1 more)

### Community 96 - "2. Core functional modules"
Cohesion: 0.22
Nodes (9): 2.1 Project management (core), 2.2 Milestones, 2.3 Action items (tasks), 2.4 Issues, 2.5 Status reports & status updates, 2.6 Resources & people, 2.7 Attachments, links & tags, 2.8 Search (+1 more)

### Community 97 - "README.md"
Cohesion: 0.15
Nodes (10): 1 · Database — Supabase SQL editor, 2 · Run both halves, 3 · Optional: demo data, 4 · Explore, 🏗 Architecture, 📚 More docs, 🧪 Quality, 🚀 Quick start (+2 more)

### Community 100 - "2. Findings per surface"
Cohesion: 0.25
Nodes (8): 2. Findings per surface, A. Tokens + `components/ui` primitives — severity HIGH, effort M, B. Dialogs (10 Add*/Edit*) — severity HIGH, effort M, C. Detail pages — severity HIGH, effort M-L, D. AppLayout + CommandPalette — severity MED, effort S, E. HomePage — severity LOW, effort S, F. Dashboard preview — severity LOW, effort S, G. Login + Wizard — severity LOW, effort S

### Community 102 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 103 - "CreateKpiDto"
Cohesion: 0.19
Nodes (10): ArrayMinSize, ImportRowsDto, ApiProperty, ArrayMaxSize, IsArray, ImportController, ApiBody, Body (+2 more)

### Community 105 - "CreateRiskDto"
Cohesion: 0.16
Nodes (12): columnsFrom(), ColumnSpec, CreateStatusReportDto, ApiProperty, IsDateString, IsIn, IsString, MaxLength (+4 more)

### Community 107 - "eslint-plugin-react-hooks"
Cohesion: 0.06
Nodes (29): CreateKpiDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsInt, IsNumber, IsOptional (+21 more)

### Community 110 - "ProjectsController"
Cohesion: 0.29
Nodes (6): ActionItem, ActionItemComment, ActionItemListItem, COLUMN_SPEC, CREATE_DEFAULTS, Owners

### Community 112 - "app.module.ts"
Cohesion: 0.09
Nodes (24): AdminOnly(), MinAppRole(), ProjectAccess(), ProjectScoped(), AccessLevel, CreateCommentDto, ApiProperty, IsString (+16 more)

### Community 113 - "ts-loader"
Cohesion: 0.18
Nodes (11): CreateActionItemDto, ApiProperty, ApiPropertyOptional, ArrayMaxSize, IsArray, IsDateString, IsIn, IsOptional (+3 more)

### Community 114 - "CreateLookupValueDto"
Cohesion: 0.19
Nodes (8): PortfolioReportsController, Controller, Get, Query, ReportsModule, Module, ReportsService, Injectable

### Community 115 - "CreateMilestoneDto"
Cohesion: 0.17
Nodes (12): CreateMilestoneDto, ApiProperty, ApiPropertyOptional, IsArray, IsBoolean, IsDateString, IsIn, IsNumber (+4 more)

### Community 118 - "seed-generic-lookups.mjs"
Cohesion: 0.25
Nodes (7): db, ensure(), env, PROGRAMS, root, rows(), STANDARD

### Community 120 - "eslint"
Cohesion: 0.17
Nodes (5): Cycle, Submission, SubmissionListItem, SubmissionsRepository, Injectable

### Community 121 - "attachments.controller.ts"
Cohesion: 0.22
Nodes (9): RisksController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+1 more)

### Community 122 - "project-sections.service.ts"
Cohesion: 0.15
Nodes (7): ApiTags, ProjectSectionsController, Controller, Get, Param, ProjectSectionsService, Injectable

### Community 123 - ".create"
Cohesion: 0.22
Nodes (9): CreateRiskDto, ApiProperty, ApiPropertyOptional, IsDateString, IsIn, IsOptional, IsString, IsUUID (+1 more)

### Community 124 - "UpdateMeDto"
Cohesion: 0.29
Nodes (7): dayOffset(), materializeOffset(), FIELD_KEYS, TemplateListItem, TemplateMilestone, TemplateOutcome, TemplatePayload

### Community 125 - "milestones.repository.ts"
Cohesion: 0.36
Nodes (4): Milestone, MilestoneListItem, COLUMN_SPEC, CREATE_DEFAULTS

### Community 127 - "CreateAccountDialog.tsx"
Cohesion: 0.09
Nodes (40): ExportCsvDialog(), FromTemplateDialog(), COLUMNS, ProjectsGrid(), ProjectTree(), Props, TreeRow, StatusPill() (+32 more)

### Community 128 - "toaster.tsx"
Cohesion: 0.24
Nodes (11): KIND_CLASSES, pauseTimers(), resumeTimers(), startTimer(), timers, TOAST_MS, Toaster(), ToastItem (+3 more)

### Community 129 - "DatabaseModule"
Cohesion: 0.46
Nodes (7): AddActionItemDialog(), emptyOwner(), ownerFromItem(), ownersFromItem(), profileName(), STATUSES, today()

### Community 130 - "Injectable"
Cohesion: 0.08
Nodes (14): AuthedRequest, SupabaseAuthGuard, Injectable, DatabaseService, Injectable, Kpi, KpiActionPlan, KpiListItem (+6 more)

### Community 132 - "AccessModule"
Cohesion: 0.90
Nodes (3): StatusReport, StatusReportDetail, StatusReportListItem

### Community 133 - ".update"
Cohesion: 0.17
Nodes (10): ProjectsController, ApiBody, Body, Controller, Delete, Get, Param, Patch (+2 more)

### Community 136 - "UpdateMeDto"
Cohesion: 0.31
Nodes (9): AddPersonDialog(), emptyPerson(), memberName(), CreateAccountDialog(), Props, inviteDraft(), isPocEmail(), pocEmail() (+1 more)

## Knowledge Gaps
- **548 isolated node(s):** `Owners`, `COLUMN_SPEC`, `CREATE_DEFAULTS`, `COLUMN_SPEC`, `CREATE_DEFAULTS` (+543 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fetchMe()` connect `WorkflowPanel.tsx` to `auth-context.tsx`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `auth-context.tsx` to `.update`, `Community 6`, `Community 9`, `Community 10`, `Community 13`, `CreateProjectDto`, `Community 20`, `Community 27`, `ProjectsRepository`, `Community 44`, `@types/node`, `@types/node`, `CreateMilestoneDto`, `PaginationQueryDto`, `WorkflowPanel.tsx`, `.add`, `DatabaseService`, `users.service.ts`, `@nestjs/swagger`, `templates.service.ts`, `PeopleController`, `CreateKpiDto`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `app.module.ts`, `CreateLookupValueDto`, `attachments.controller.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `auth-context.tsx` to `.update`, `Community 6`, `Community 9`, `Community 10`, `Community 13`, `CreateProjectDto`, `Community 20`, `Community 27`, `ProjectsRepository`, `Community 44`, `@types/node`, `@types/node`, `CreateMilestoneDto`, `WorkflowPanel.tsx`, `.add`, `DatabaseService`, `users.service.ts`, `templates.service.ts`, `PeopleController`, `CreateKpiDto`, `CreateRiskDto`, `eslint-plugin-react-hooks`, `app.module.ts`, `CreateLookupValueDto`, `attachments.controller.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `Owners`, `COLUMN_SPEC`, `CREATE_DEFAULTS` to the rest of the system?**
  _548 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._